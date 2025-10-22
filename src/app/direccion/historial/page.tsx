'use client';

import { useEffect, useRef, useState } from 'react';
import { searchLegacy, getPayments, type PersonaRow, type PaymentRow } from '@/lib/api';

import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, FileSpreadsheet, Clock, Printer, FileText, FileDown } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

type StudentReportRow = {
  ci: string;
  nombreCompleto: string;
  origen: string;
  tieneDeuda: boolean;
  monto: number;
};

type PaymentReportRow = {
  codPago: string;
  monto: string;
  origen: string;
  estado: string;
  gestion: string;
  mes: string;
  anioCancelacion: string;
  fechaCancelacion: string;
};

const PAGE_SIZE = 20;
export default function DireccionHistorialPage() {
  // === Estado REAL (reemplaza mocks) ===
  // BÃƒÂºsqueda/listado de personas
  const [query, setQuery] = useState('');
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [page, setPage] = useState(1);
  const [students, setStudents] = useState<PersonaRow[]>([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [activeQuery, setActiveQuery] = useState('');

  // SelecciÃƒÂ³n y pagos
  const [selected, setSelected] = useState<PersonaRow | null>(null);
  const [loadingPayments, setLoadingPayments] = useState(false);
  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const [paymentsPersonaCi, setPaymentsPersonaCi] = useState<string>('');
  const [paymentsError, setPaymentsError] = useState<string | null>(null);
  const [isPaymentsOpen, setIsPaymentsOpen] = useState(false);

  const isMounted = useRef(true);
  const searchRequestId = useRef(0);
  const paymentsRequestId = useRef(0);

  // === Llamadas a la API (una sola vez definidas) ===
  async function runSearch(q: string, targetPage = 1) {
    const requestId = ++searchRequestId.current;
    setLoadingSearch(true);
    setSearchError(null);
    setSelected(null);
    setPayments([]);
    setPaymentsPersonaCi('');
    setPaymentsError(null);
    setIsPaymentsOpen(false);
    setActiveQuery(q);

    try {
      const data = await searchLegacy(q, targetPage, PAGE_SIZE);
      if (isMounted.current && searchRequestId.current === requestId) {
        setStudents(data.items);
        setTotalStudents(data.total);
        const normalizedTotalPages = Math.max(1, Math.ceil(data.total / PAGE_SIZE));
        const safePage = Math.min(targetPage, normalizedTotalPages);
        setPage(safePage);
      }
    } catch (error) {
      if (isMounted.current && searchRequestId.current === requestId) {
        console.error('Error al buscar personas', error);
        setStudents([]);
        setTotalStudents(0);
        setPage(1);
        const message = error instanceof Error ? error.message : 'No se pudo cargar el historial.';
        setSearchError(message);
      }
    } finally {
      if (isMounted.current && searchRequestId.current === requestId) {
        setLoadingSearch(false);
      }
    }
  }

  async function loadPayments(row: PersonaRow) {
    const requestId = ++paymentsRequestId.current;
    setSelected(row);
    setLoadingPayments(true);
    setPaymentsError(null);
    setPayments([]);
    const ciValue = (row.ci ?? row.ciAlt ?? '').trim();
    setPaymentsPersonaCi(ciValue);
    setIsPaymentsOpen(true);

    const personaIds = row.codPersonas && row.codPersonas.length > 0
      ? Array.from(new Set(row.codPersonas))
      : [row.codPersona];

    try {
      const responses = await Promise.all(
        personaIds.map(async (personaId) => {
          const result = await getPayments(personaId, 1, 200);
          return result.items;
        }),
      );

      if (isMounted.current && paymentsRequestId.current === requestId) {
        const merged = new Map<number, PaymentRow>();
        for (const items of responses) {
          for (const item of items) {
            merged.set(item.codPago, item);
          }
        }
        const combined = Array.from(merged.values()).sort((a, b) => paymentSortKey(b) - paymentSortKey(a));
        setPayments(combined);
      }
    } catch (error) {
      if (isMounted.current && paymentsRequestId.current === requestId) {
        console.error('Error al cargar pagos', error);
        setPayments([]);
        const message = error instanceof Error ? error.message : 'No se pudo cargar los pagos.';
        setPaymentsError(message);
      }
    } finally {
      if (isMounted.current && paymentsRequestId.current === requestId) {
        setLoadingPayments(false);
      }
    }
  }

  const brandName = 'First Class Institute';
  const reportTitle = 'Historial de Estudiantes';
  const reportSubtitle = 'Direccion Academica';

  function buildStudentDataset(): StudentReportRow[] {
    return students.map((row) => {
      const ci = (row.ci ?? row.ciAlt ?? '').trim();
      const origen = resolveOrigins(row);
      const monto = Number(row.montoDeuda ?? 0);
      return {
        ci,
        nombreCompleto: row.nombreCompleto,
        origen,
        tieneDeuda: Boolean(row.tieneDeuda),
        monto: row.tieneDeuda ? monto : 0,
      };
    });
  }

  function formatCurrency(amount: number): string {
    return `Bs ${amount.toFixed(2)}`;
  }

  function escapeHtml(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function resolveOrigins(row: PersonaRow): string {
    const originList = row.origenes?.filter((value): value is string => Boolean(value && value.trim())) ?? [];
    if (originList.length > 0) {
      const unique = Array.from(new Set(originList.map((value) => value.trim())));
      return unique.join(' / ');
    }
    const fallback = (row.origenPersona ?? row.origenUltimoPago ?? '').trim();
    return fallback;
  }

  function paymentSortKey(pg: PaymentRow): number {
    const candidates = [pg.fechaQueCancelo, pg.fechaACancelar, pg.fechaPlanificada];
    for (const candidate of candidates) {
      if (!candidate) continue;
      const timestamp = Date.parse(candidate);
      if (!Number.isNaN(timestamp)) {
        return timestamp;
      }
    }
    return 0;
  }

  function buildReportStyles(): string {
    return `
      :root { color-scheme: light; }
      * { box-sizing: border-box; }
      body {
        font-family: 'Inter', 'Space Grotesk', 'Helvetica Neue', Arial, sans-serif;
        color: #1f2933;
        margin: 0;
        padding: 2rem 2.5rem;
        background: #f8fafc;
      }
      header {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        margin-bottom: 1.5rem;
      }
      h1 {
        font-family: 'Space Grotesk', 'Inter', 'Helvetica Neue', Arial, sans-serif;
        font-size: 1.75rem;
        color: #8a1538;
        margin: 0;
      }
      h2 {
        font-size: 1rem;
        margin: 0;
        color: #475569;
      }
      .meta {
        font-size: 0.9rem;
        color: #64748b;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        background: #ffffff;
        border-radius: 0.75rem;
        overflow: hidden;
        box-shadow: 0 12px 24px rgba(31, 45, 61, 0.08);
      }
      thead tr {
        background: linear-gradient(90deg, #8a1538, #b81f4a);
        color: #ffffff;
      }
      th, td {
        padding: 0.75rem 1rem;
        text-align: left;
      }
      th {
        font-size: 0.8rem;
        letter-spacing: 0.05em;
        text-transform: uppercase;
      }
      tbody tr:nth-child(even) {
        background: #f9fafc;
      }
      tbody tr:hover {
        background: #f1f5f9;
      }
      .deuda {
        font-weight: 600;
        color: #b81f4a;
      }
      .sin-deuda {
        font-weight: 600;
        color: #0f9d58;
      }
      .summary {
        margin-top: 1rem;
        font-size: 0.95rem;
        color: #475569;
      }
      @media print {
        body {
          background: #ffffff;
          padding: 1.5rem;
        }
        table {
          box-shadow: none;
        }
      }
    `;
  }

  function buildReportHtml(rows: StudentReportRow[]): string {
    const generatedAt = new Date().toLocaleString('es-BO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const totalConDeuda = rows.filter((row) => row.tieneDeuda).length;
    const totalMonto = rows.reduce((acc, row) => acc + row.monto, 0);

    const headerRow = `
      <tr>
        <th>CI</th>
        <th>Nombre completo</th>
        <th>Origen</th>
        <th>Tiene deuda</th>
        <th>Monto deuda</th>
      </tr>
    `;

    const tableRows = rows
      .map((row) => {
        const deudaClass = row.tieneDeuda ? 'deuda' : 'sin-deuda';
        const deudaTexto = row.tieneDeuda ? 'Si' : 'No';
        return `
          <tr>
            <td>${escapeHtml(row.ci)}</td>
            <td>${escapeHtml(row.nombreCompleto)}</td>
            <td>${escapeHtml(row.origen || '-')}</td>
            <td class="${deudaClass}">${deudaTexto}</td>
            <td class="${deudaClass}">${formatCurrency(row.monto)}</td>
          </tr>
        `;
      })
      .join('');

    return `<!DOCTYPE html>
      <html lang="es">
        <head>
          <meta charset="utf-8" />
          <title>${reportTitle}</title>
          <style>${buildReportStyles()}</style>
        </head>
        <body>
          <header>
            <h1>${brandName}</h1>
            <h2>${reportTitle} - ${reportSubtitle}</h2>
            <p class="meta">Generado: ${generatedAt}  -  Registros: ${rows.length}  -  Con deuda: ${totalConDeuda}  -  Total adeudado: ${formatCurrency(totalMonto)}</p>
          </header>
          <table>
            <thead>${headerRow}</thead>
            <tbody>${tableRows}</tbody>
          </table>
          <p class="summary">
            Este reporte refleja la informacion consolidada del historico de estudiantes proveniente de sistemas Web y Escritorio, filtrando duplicados segun la politica institucional.
          </p>
        </body>
      </html>`;
  }

  function openReportWindow(mode: 'print' | 'pdf') {
    const rows = buildStudentDataset();
    if (rows.length === 0) return;

    const html = buildReportHtml(rows);
    const reportWindow = window.open('', '_blank');
    if (!reportWindow) {
      console.warn('El navegador bloqueÃ³ la ventana emergente.');
      return;
    }

    // Desvincula la ventana emergente del opener por seguridad.
    reportWindow.opener = null;
    reportWindow.document.open();
    reportWindow.document.write(html);
    reportWindow.document.close();

    const handlePrint = () => {
      reportWindow.focus();
      reportWindow.print();
      if (mode === 'pdf') {
        reportWindow.close();
      }
    };

    if (reportWindow.document.readyState === 'complete') {
      handlePrint();
    } else {
      reportWindow.onload = handlePrint;
    }
  }

  function exportStudentsToCsv() {
    const rows = buildStudentDataset();
    if (rows.length === 0) return;

    const headers = ['CI', 'Nombre completo', 'Origen', 'Tiene deuda', 'Monto deuda'];
    const csvLines = [
      headers,
      ...rows.map((row) => [
        row.ci,
        row.nombreCompleto,
        row.origen,
        row.tieneDeuda ? 'Si' : 'No',
        row.monto.toFixed(2),
      ]),
    ]
      .map((line) =>
        line
          .map((value) => {
            const safe = String(value ?? '');
            return `"${safe.replace(/"/g, '""')}"`;
          })
          .join(',')
      )
      .join('\r\n');

    const blob = new Blob([csvLines], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const dateStamp = new Date().toISOString().slice(0, 10);
    link.download = `historial_personas_${dateStamp}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function buildExcelHtml(rows: StudentReportRow[]): string {
    const headerRow = `
      <tr>
        <th>CI</th>
        <th>Nombre completo</th>
        <th>Origen</th>
        <th>Tiene deuda</th>
        <th>Monto deuda</th>
      </tr>
    `;
    const bodyRows = rows
      .map((row) => `
        <tr>
          <td>${escapeHtml(row.ci)}</td>
          <td>${escapeHtml(row.nombreCompleto)}</td>
          <td>${escapeHtml(row.origen || '-')}</td>
          <td>${row.tieneDeuda ? 'Si' : 'No'}</td>
          <td>${row.monto.toFixed(2)}</td>
        </tr>
      `)
      .join('');

    return `<!DOCTYPE html>
      <html lang="es">
        <head>
          <meta charset="utf-8" />
          <title>${reportTitle}</title>
          <style>
            body {
              font-family: 'Inter', 'Space Grotesk', 'Helvetica Neue', Arial, sans-serif;
              color: #1f2933;
            }
            h1 {
              font-size: 1.25rem;
              margin-bottom: 0.75rem;
              color: #8a1538;
            }
            table {
              border-collapse: collapse;
              width: 100%;
            }
            th, td {
              border: 1px solid #cbd5e1;
              padding: 8px 12px;
              text-align: left;
            }
            thead tr {
              background: #8a1538;
              color: #ffffff;
            }
            tbody tr:nth-child(even) {
              background: #f9fafc;
            }
          </style>
        </head>
        <body>
          <h1>${brandName} - ${reportTitle}</h1>
          <table>
            <thead>${headerRow}</thead>
            <tbody>${bodyRows}</tbody>
          </table>
        </body>
      </html>`;
  }

  function exportStudentsToExcel() {
    const rows = buildStudentDataset();
    if (rows.length === 0) return;

    const html = buildExcelHtml(rows);
    const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const dateStamp = new Date().toISOString().slice(0, 10);
    link.download = `historial_personas_${dateStamp}.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function exportStudentsToPdf() {
    openReportWindow('pdf');
  }

  function printStudents() {
    openReportWindow('print');
  }

  function buildPaymentsDataset(): PaymentReportRow[] {
    return payments.map((pg) => ({
      codPago: String(pg.codPago ?? ''),
      monto: formatCurrency(Number(pg.monto ?? 0)),
      origen: pg.origen ? pg.origen : '-',
      estado: pg.estado ? pg.estado : '-',
      gestion: pg.gestion !== undefined && pg.gestion !== null ? String(pg.gestion) : '-',
      mes: pg.mes !== undefined && pg.mes !== null ? String(pg.mes) : '-',
      anioCancelacion: pg.anioCancelacion !== undefined && pg.anioCancelacion !== null ? String(pg.anioCancelacion) : '-',
      fechaCancelacion: pg.fechaQueCancelo ? new Date(pg.fechaQueCancelo).toLocaleDateString() : '-',
    }));
  }

  function buildPaymentsReportHtml(rows: PaymentReportRow[]): string {
    const personaNombre = selected?.nombreCompleto ?? 'Sin selección';
    const personaCi = paymentsPersonaCi || selected?.ci || selected?.ciAlt || 'No disponible';
    const generatedAt = new Date().toLocaleString('es-BO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const headerRow = `
      <tr>
        <th>Código Pago</th>
        <th>Monto</th>
        <th>Origen</th>
        <th>Estado</th>
        <th>Gestión</th>
        <th>Mes</th>
        <th>Año Cancelación</th>
        <th>Fecha Cancelación</th>
      </tr>
    `;

    const tableRows = rows
      .map((row) => `
        <tr>
          <td>${escapeHtml(row.codPago)}</td>
          <td>${escapeHtml(row.monto)}</td>
          <td>${escapeHtml(row.origen)}</td>
          <td>${escapeHtml(row.estado)}</td>
          <td>${escapeHtml(row.gestion)}</td>
          <td>${escapeHtml(row.mes)}</td>
          <td>${escapeHtml(row.anioCancelacion)}</td>
          <td>${escapeHtml(row.fechaCancelacion)}</td>
        </tr>
      `)
      .join('');

    const totalMonto = payments.reduce((acc, pg) => acc + Number(pg.monto ?? 0), 0);

    return `<!DOCTYPE html>
      <html lang="es">
        <head>
          <meta charset="utf-8" />
          <title>Historial de Pagos</title>
          <style>${buildReportStyles()}</style>
        </head>
        <body>
          <header>
            <h1>${brandName}</h1>
            <h2>Historial de Pagos - ${reportSubtitle}</h2>
            <p class="meta">Estudiante: ${escapeHtml(personaNombre)} | CI: ${escapeHtml(personaCi ?? '')} | Generado: ${generatedAt} | Pagos: ${rows.length} | Total: ${formatCurrency(totalMonto)}</p>
          </header>
          <table>
            <thead>${headerRow}</thead>
            <tbody>${tableRows}</tbody>
          </table>
        </body>
      </html>`;
  }

  function triggerHtmlPrint(html: string, mode: 'print' | 'pdf') {
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    iframe.style.visibility = 'hidden';

    document.body.appendChild(iframe);

    const frameDoc = iframe.contentWindow?.document;
    if (!frameDoc) {
      document.body.removeChild(iframe);
      console.warn('No se pudo preparar el documento para imprimir.');
      return;
    }

    frameDoc.open();
    frameDoc.write(html);
    frameDoc.close();

    const cleanup = () => {
      if (iframe.parentNode) {
        iframe.parentNode.removeChild(iframe);
      }
    };

    const handlePrint = () => {
      const frameWindow = iframe.contentWindow;
      if (!frameWindow) {
        cleanup();
        return;
      }
      frameWindow.focus();
      frameWindow.print();
      const delay = mode === 'pdf' ? 1500 : 500;
      window.setTimeout(cleanup, delay);
    };

    if (iframe.contentWindow?.document.readyState === 'complete') {
      handlePrint();
    } else {
      iframe.onload = handlePrint;
    }
  }

  function exportPaymentsToCsv() {
    if (!selected || payments.length === 0) return;
    const rows = buildPaymentsDataset();
    if (rows.length === 0) return;

    const headers = ['Código Pago', 'Monto', 'Origen', 'Estado', 'Gestión', 'Mes', 'Año Cancelación', 'Fecha Cancelación'];
    const csvLines = [
      headers,
      ...rows.map((row) => [
        row.codPago,
        row.monto,
        row.origen,
        row.estado,
        row.gestion,
        row.mes,
        row.anioCancelacion,
        row.fechaCancelacion,
      ]),
    ]
      .map((line) =>
        line
          .map((value) => {
            const safe = String(value ?? '');
            return `"${safe.replace(/"/g, '""')}"`;
          })
          .join(','),
      )
      .join('\r\n');

    const blob = new Blob([csvLines], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const dateStamp = new Date().toISOString().slice(0, 10);
    const personaSlug = selected?.nombreCompleto.replace(/\s+/g, '_') ?? 'sin_nombre';
    link.download = `pagos_${personaSlug}_${dateStamp}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function buildPaymentsExcelHtml(rows: PaymentReportRow[]): string {
    const personaNombre = selected?.nombreCompleto ?? 'Sin selección';
    const personaCi = paymentsPersonaCi || selected?.ci || selected?.ciAlt || 'No disponible';
    const headerRow = `
      <tr>
        <th>Código Pago</th>
        <th>Monto</th>
        <th>Origen</th>
        <th>Estado</th>
        <th>Gestión</th>
        <th>Mes</th>
        <th>Año Cancelación</th>
        <th>Fecha Cancelación</th>
      </tr>
    `;
    const bodyRows = rows
      .map((row) => `
        <tr>
          <td>${escapeHtml(row.codPago)}</td>
          <td>${escapeHtml(row.monto)}</td>
          <td>${escapeHtml(row.origen)}</td>
          <td>${escapeHtml(row.estado)}</td>
          <td>${escapeHtml(row.gestion)}</td>
          <td>${escapeHtml(row.mes)}</td>
          <td>${escapeHtml(row.anioCancelacion)}</td>
          <td>${escapeHtml(row.fechaCancelacion)}</td>
        </tr>
      `)
      .join('');

    return `<!DOCTYPE html>
      <html lang="es">
        <head>
          <meta charset="utf-8" />
          <title>Historial de Pagos</title>
          <style>
            body {
              font-family: 'Inter', 'Space Grotesk', 'Helvetica Neue', Arial, sans-serif;
              color: #1f2933;
            }
            h1 {
              font-size: 1.25rem;
              margin-bottom: 0.75rem;
              color: #8a1538;
            }
            table {
              border-collapse: collapse;
              width: 100%;
            }
            th, td {
              border: 1px solid #cbd5e1;
              padding: 8px 12px;
              text-align: left;
            }
            thead tr {
              background: #8a1538;
              color: #ffffff;
            }
            tbody tr:nth-child(even) {
              background: #f9fafc;
            }
          </style>
        </head>
        <body>
          <h1>${brandName} - Historial de Pagos</h1>
          <p>Estudiante: ${escapeHtml(personaNombre)} | CI: ${escapeHtml(personaCi ?? '')}</p>
          <table>
            <thead>${headerRow}</thead>
            <tbody>${bodyRows}</tbody>
          </table>
        </body>
      </html>`;
  }

  function exportPaymentsToExcel() {
    if (!selected || payments.length === 0) return;
    const rows = buildPaymentsDataset();
    if (rows.length === 0) return;

    const html = buildPaymentsExcelHtml(rows);
    const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const dateStamp = new Date().toISOString().slice(0, 10);
    const personaSlug = selected?.nombreCompleto.replace(/\s+/g, '_') ?? 'sin_nombre';
    link.download = `pagos_${personaSlug}_${dateStamp}.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function exportPaymentsToPdf() {
    if (!selected || payments.length === 0) return;
    const rows = buildPaymentsDataset();
    if (rows.length === 0) return;
    const html = buildPaymentsReportHtml(rows);
    triggerHtmlPrint(html, 'pdf');
  }

  function printPayments() {
    if (!selected || payments.length === 0) return;
    const rows = buildPaymentsDataset();
    if (rows.length === 0) return;
    const html = buildPaymentsReportHtml(rows);
    triggerHtmlPrint(html, 'print');
  }

  useEffect(() => {
    void runSearch('', 1); // primer render: carga sin filtro
    return () => {
      isMounted.current = false;
    };
  }, []);

  const totalPages = Math.max(1, Math.ceil(totalStudents / PAGE_SIZE));
  const canGoPrev = page > 1;
  const canGoNext = page < totalPages;
  const paginationDisabled = loadingSearch || totalStudents === 0;
  const startIndex = totalStudents === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const endIndex = totalStudents === 0 ? 0 : Math.min(totalStudents, page * PAGE_SIZE);
  const rangeLabel =
    totalStudents === 0 ? 'Sin resultados' : `Mostrando ${startIndex}-${endIndex} de ${totalStudents}`;

  function handlePageChange(target: number) {
    if (target < 1 || target > totalPages || target === page) return;
    void runSearch(activeQuery, target);
  }

  const disablePaymentActions = !selected || payments.length === 0;

  return (
    <div className="flex flex-col min-h-screen bg-secondary/20">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button asChild variant="outline" size="sm" className="hover:bg-primary/10 transition-colors">
            <Link href="/direccion">
              <ChevronLeft className="mr-2 h-4 w-4"/>
              Volver al Portal de Direccion
            </Link>
          </Button>
        </div>

        <div className="relative text-center mb-12 p-6 md:p-8 bg-card rounded-xl shadow-xl overflow-hidden border border-border">
          <div className="absolute inset-0 opacity-[0.03] pattern-[0.8rem_0.8rem_#000000_radial-gradient(circle_at_center,_var(--tw-gradient-stops))] dark:opacity-[0.05] dark:pattern-[0.8rem_0.8rem_#ffffff_radial-gradient(circle_at_center,_var(--tw-gradient-stops))]"></div>
          <Clock className="mx-auto mb-4 h-14 w-14 md:h-16 md:w-16 text-primary" />
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-headline mb-3 text-primary">
            Historial de Datos
          </h1>
          <p className="text-md md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Consulta el historial de pagos y estudiantes. Utiliza el filtro para buscar por CI o nombre.
          </p>
        </div>

        {/* === Tabla de Estudiantes === */}
        <Card className="shadow-lg bg-card mb-8">
          <CardHeader>
            <CardTitle className="flex items-center text-xl font-headline">
              Historial de Estudiantes
            </CardTitle>
            <CardDescription>Personas: {totalStudents}</CardDescription>
          </CardHeader>
          <CardContent>
            {searchError && (
              <Alert variant="destructive" className="mb-4">
                <AlertTitle>Error al cargar estudiantes</AlertTitle>
                <AlertDescription>{searchError}</AlertDescription>
              </Alert>
            )}
            <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <Input
                  placeholder="Buscar por CI o nombre..."
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      void runSearch(query, 1);
                    }
                  }}
                  className="max-w-xs"
                />
                <Button
                  type="button"
                  variant="default"
                  onClick={() => void runSearch(query, 1)}
                  disabled={loadingSearch}
                >
                  {loadingSearch ? 'Buscando...' : 'Buscar'}
                </Button>
              </div>

            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>CI</TableHead>
                    <TableHead>Nombre completo</TableHead>
                    <TableHead>Origen</TableHead>
                    <TableHead>Deuda</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        {loadingSearch ? 'Cargando...' : 'No se encontraron estudiantes.'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    students.map((row, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{row.ci ?? row.ciAlt ?? '-'}</TableCell>
                            <TableCell>{row.nombreCompleto}</TableCell>
                            <TableCell>{resolveOrigins(row) || '-'}</TableCell>
                            <TableCell className={row.tieneDeuda ? 'text-destructive font-semibold' : 'text-green-600'}>
                              {row.tieneDeuda ? `Bs ${row.montoDeuda?.toFixed(2) ?? '0.00'}` : 'No'}
                            </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => void loadPayments(row)}
                              disabled={loadingPayments && selected?.codPersona === row.codPersona}
                            >
                              {loadingPayments && selected?.codPersona === row.codPersona ? 'Cargando...' : 'Ver pagos'}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="flex flex-col gap-2 border-t pt-4 md:flex-row md:items-center md:justify-between">
              <span className="text-sm text-muted-foreground">{rangeLabel}</span>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={!canGoPrev || paginationDisabled}
                >
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Anterior
                </Button>
                <span className="text-sm font-medium">
                  Página {Math.min(page, totalPages)} de {totalPages}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={!canGoNext || paginationDisabled}
                >
                  Siguiente
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Dialog open={isPaymentsOpen} onOpenChange={(open) => {
          setIsPaymentsOpen(open);
          if (!open) {
            setPaymentsError(null);
          }
        }}>
          <DialogContent className="max-w-5xl max-h-[80vh] flex flex-col">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl font-headline">
                Historial de Pagos
              </DialogTitle>
              <DialogDescription>
                {selected ? `Pagos de ${selected.nombreCompleto}` : 'Selecciona un estudiante para ver sus pagos.'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 overflow-y-auto pr-1 flex-1">
              {paymentsError && (
                <Alert variant="destructive">
                  <AlertTitle>Error al cargar pagos</AlertTitle>
                  <AlertDescription>{paymentsError}</AlertDescription>
                </Alert>
              )}
              {selected && (
                <div className="text-sm text-muted-foreground">
                  CI persona: <span className="font-mono">{paymentsPersonaCi || 'No disponible'}</span>
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={printPayments}
                  disabled={disablePaymentActions}
                >
                  <Printer className="mr-2 h-4 w-4" />
                  Imprimir
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={exportPaymentsToPdf}
                  disabled={disablePaymentActions}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  PDF
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={exportPaymentsToExcel}
                  disabled={disablePaymentActions}
                >
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Excel
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={exportPaymentsToCsv}
                  disabled={disablePaymentActions}
                >
                  <FileDown className="mr-2 h-4 w-4" />
                  CSV
                </Button>
              </div>
              <div className="overflow-x-auto rounded-lg border border-border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cod Pago</TableHead>
                      <TableHead>Monto</TableHead>
                      <TableHead>Origen</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Gestion</TableHead>
                      <TableHead>Mes</TableHead>
                      <TableHead>Anio de cancelacion</TableHead>
                      <TableHead>Fecha Canc.</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {!selected ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center text-muted-foreground">
                          Selecciona un estudiante arriba para ver sus pagos.
                        </TableCell>
                      </TableRow>
                    ) : payments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center text-muted-foreground">
                          {loadingPayments ? 'Cargando pagos...' : 'Sin pagos.'}
                        </TableCell>
                      </TableRow>
                    ) : (
                      payments.map((pg, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{pg.codPago}</TableCell>
                          <TableCell>{pg.monto}</TableCell>
                          <TableCell>{pg.origen ?? '-'}</TableCell>
                          <TableCell>{pg.estado ?? '-'}</TableCell>
                          <TableCell>{pg.gestion ?? '-'}</TableCell>
                          <TableCell>{pg.mes ?? '-'}</TableCell>
                          <TableCell>{pg.anioCancelacion ?? '-'}</TableCell>
                          <TableCell>
                            {pg.fechaQueCancelo ? new Date(pg.fechaQueCancelo).toLocaleDateString() : '-'}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
            <DialogFooter className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsPaymentsOpen(false)}>
                Cerrar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>

      <footer className="py-8 border-t mt-16 bg-card">
        <div className="container text-center text-sm text-muted-foreground">
          Â© {new Date().getFullYear()} First Class Institute. Historial.
        </div>
      </footer>
    </div>
  );
}












