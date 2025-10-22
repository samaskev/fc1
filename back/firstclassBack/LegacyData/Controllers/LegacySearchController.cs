using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LegacyData.Data;

namespace LegacyData.Controllers;

[ApiController]
[Route("api/legacy")]
public class LegacySearchController : ControllerBase
{
    private readonly LegacyContext _db;
    private static readonly DateTime SqlServerMinDate = new(1753, 1, 1);
    public LegacySearchController(LegacyContext db) => _db = db;

    // GET /api/legacy/search?query=...
    [HttpGet("search")]
    public async Task<IActionResult> Search(
        [FromQuery] string? query,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] bool onlyWithPayments = false)
    {
        page = Math.Max(1, page);
        pageSize = pageSize is < 1 or > 200 ? 20 : pageSize;

        var q = _db.Personas.AsNoTracking()
            .Where(p => p.ESTADO_OBS == false)
            .AsQueryable();

        if (onlyWithPayments)
        {
            q = q.Where(p => p.Pagos.Any(pg => pg.ESTADO_OBS == false));
        }

        if (!string.IsNullOrWhiteSpace(query))
        {
            var term = query.Trim();

            // Tokens separados por espacio permiten buscar "Juan Perez" o solo "Juan".
            var tokens = term.Split(' ', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

            q = q.Where(p =>
                p.NRO_DOCUMENTO_NB.Contains(term) ||
                (p.PERSONAS_NIT_CI_VC ?? string.Empty).Contains(term) ||
                tokens.All(t =>
                    p.NOMBRE_VC.Contains(t) ||
                    p.APELLIDO_PATERNO_VC.Contains(t) ||
                    p.APELLIDO_MATERNO_VC.Contains(t)
                )
            );
        }

        var projections = await q
            .OrderBy(p => p.APELLIDO_PATERNO_VC)
            .ThenBy(p => p.APELLIDO_MATERNO_VC)
            .ThenBy(p => p.NOMBRE_VC)
            .Select(p => new PersonProjection
            {
                CodPersona = p.COD_PERSONA_NB,
                Ci = p.NRO_DOCUMENTO_NB,
                CiAlt = p.PERSONAS_NIT_CI_VC,
                Nombre = p.NOMBRE_VC,
                Paterno = p.APELLIDO_PATERNO_VC,
                Materno = p.APELLIDO_MATERNO_VC,
                NombreCompleto = p.NOMBRE_VC + " " + p.APELLIDO_PATERNO_VC + " " + p.APELLIDO_MATERNO_VC,
                TieneDeuda = p.Pagos.Any(pg =>
                    pg.ESTADO_OBS == false && pg.ESTADO_VC != "CANCELADO" && pg.PM_FECHA_QUE_CANCELO == null),
                MontoDeuda = p.Pagos
                    .Where(pg => pg.ESTADO_OBS == false && pg.ESTADO_VC != "CANCELADO" && pg.PM_FECHA_QUE_CANCELO == null)
                    .Sum(pg => (decimal?)pg.MONTO_NB) ?? 0m,
                OrigenPersona = p.Origen,
                Pagos = p.Pagos
                    .Where(pg => pg.ESTADO_OBS == false)
                    .Select(pg => new PaymentProjection
                    {
                        Origen = pg.Origen,
                        FechaQueCancelo = pg.PM_FECHA_QUE_CANCELO,
                        FechaRegistro = pg.FECHA_REGISTRO_DH,
                        FechaPlanificada = pg.FECHA_PLANIFICADA_DH
                    })
            })
            .ToListAsync();

        var rawItems = projections
            .Select(ToLegacyPersonRow)
            .ToList();

        var grouped = rawItems
            .GroupBy(NormalizeDocumentKey)
            .Select(CombineGroup)
            .ToList();

        var total = grouped.Count;
        var totalPages = total == 0 ? 1 : (int)Math.Ceiling(total / (double)pageSize);
        var currentPage = Math.Min(page, totalPages);
        var skip = (currentPage - 1) * pageSize;

        var orderedItems = grouped
            .OrderBy(item => item.Paterno ?? string.Empty, StringComparer.OrdinalIgnoreCase)
            .ThenBy(item => item.Materno ?? string.Empty, StringComparer.OrdinalIgnoreCase)
            .ThenBy(item => item.Nombre ?? string.Empty, StringComparer.OrdinalIgnoreCase)
            .Skip(skip)
            .Take(pageSize)
            .ToList();

        return Ok(new { total, page = currentPage, pageSize, items = orderedItems });
    }

    private static string NormalizeDocumentKey(LegacyPersonRow row)
    {
        if (!string.IsNullOrWhiteSpace(row.Ci))
        {
            return row.Ci.Trim();
        }
        if (!string.IsNullOrWhiteSpace(row.CiAlt))
        {
            return row.CiAlt.Trim();
        }
        return $"cod:{row.CodPersona}";
    }

    private static CombinedPersonDto CombineGroup(IGrouping<string, LegacyPersonRow> group)
    {
        var ordered = group
            .OrderBy(r => r.Paterno ?? string.Empty, StringComparer.OrdinalIgnoreCase)
            .ThenBy(r => r.Materno ?? string.Empty, StringComparer.OrdinalIgnoreCase)
            .ThenBy(r => r.Nombre ?? string.Empty, StringComparer.OrdinalIgnoreCase)
            .ThenBy(r => r.CodPersona)
            .ToList();

        var primary = ordered[0];

        var ciValues = ordered
            .Select(r => r.Ci)
            .Where(ci => !string.IsNullOrWhiteSpace(ci))
            .Select(ci => ci!.Trim())
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();

        var ciAltValues = ordered
            .Select(r => r.CiAlt)
            .Where(ciAlt => !string.IsNullOrWhiteSpace(ciAlt))
            .Select(ciAlt => ciAlt!.Trim())
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();

        var canonicalCi = ciValues.FirstOrDefault();
        var canonicalCiAlt = ciAltValues.FirstOrDefault(value =>
            canonicalCi is null ||
            !string.Equals(value, canonicalCi, StringComparison.OrdinalIgnoreCase))
            ?? ciAltValues.FirstOrDefault();

        var originSet = ordered
            .Select(r => r.OrigenPersona)
            .Concat(ordered.Select(r => r.UltimoPagoOrigen))
            .Where(origin => !string.IsNullOrWhiteSpace(origin))
            .Select(origin => origin!.Trim())
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();

        var latestPagoOrigin = ordered
            .OrderByDescending(r => r.UltimoPagoFecha ?? DateTime.MinValue)
            .Select(r => r.UltimoPagoOrigen)
            .FirstOrDefault(origin => !string.IsNullOrWhiteSpace(origin));

        var montoTotal = ordered.Sum(r => r.MontoDeuda);
        var tieneDeuda = ordered.Any(r => r.TieneDeuda);

        return new CombinedPersonDto
        {
            CodPersona = primary.CodPersona,
            CodPersonas = ordered.Select(r => r.CodPersona).Distinct().ToArray(),
            Ci = canonicalCi ?? canonicalCiAlt,
            CiAlt = canonicalCiAlt,
            Nombre = primary.Nombre,
            Paterno = primary.Paterno,
            Materno = primary.Materno,
            NombreCompleto = primary.NombreCompleto,
            TieneDeuda = tieneDeuda,
            MontoDeuda = montoTotal,
            OrigenPersona = originSet.Count switch
            {
                0 => null,
                1 => originSet[0],
                _ => string.Join(" / ", originSet)
            },
            OrigenUltimoPago = latestPagoOrigin,
            Origenes = originSet
        };
    }

    private sealed record LegacyPersonRow(
        int CodPersona,
        string? Ci,
        string? CiAlt,
        string Nombre,
        string Paterno,
        string Materno,
        string NombreCompleto,
        bool TieneDeuda,
        decimal MontoDeuda,
        string? OrigenPersona,
        string? UltimoPagoOrigen,
        DateTime? UltimoPagoFecha
    );

    private sealed class PersonProjection
    {
        public int CodPersona { get; init; }
        public string? Ci { get; init; }
        public string? CiAlt { get; init; }
        public string Nombre { get; init; } = string.Empty;
        public string Paterno { get; init; } = string.Empty;
        public string Materno { get; init; } = string.Empty;
        public string NombreCompleto { get; init; } = string.Empty;
        public bool TieneDeuda { get; init; }
        public decimal MontoDeuda { get; init; }
        public string? OrigenPersona { get; init; }
        public IEnumerable<PaymentProjection> Pagos { get; init; } = Array.Empty<PaymentProjection>();
    }

    private sealed class PaymentProjection
    {
        public string? Origen { get; init; }
        public DateTime? FechaQueCancelo { get; init; }
        public DateTime? FechaRegistro { get; init; }
        public DateTime? FechaPlanificada { get; init; }
    }

    private static LegacyPersonRow ToLegacyPersonRow(PersonProjection projection)
    {
        var pagos = projection.Pagos?.ToList() ?? [];
        var latest = pagos
            .Select(pg => new
            {
                pg.Origen,
                Fecha = NormalizeDate(pg.FechaQueCancelo)
                    ?? NormalizeDate(pg.FechaRegistro)
                    ?? NormalizeDate(pg.FechaPlanificada)
            })
            .Where(x => x.Fecha.HasValue)
            .OrderByDescending(x => x.Fecha)
            .FirstOrDefault();

        var ultimoOrigen = latest?.Origen;
        var ultimoMomento = latest?.Fecha;

        return new LegacyPersonRow(
            projection.CodPersona,
            projection.Ci,
            projection.CiAlt,
            projection.Nombre,
            projection.Paterno,
            projection.Materno,
            projection.NombreCompleto,
            projection.TieneDeuda,
            projection.MontoDeuda,
            projection.OrigenPersona,
            ultimoOrigen,
            ultimoMomento
        );
    }

    private static DateTime? NormalizeDate(DateTime? value)
    {
        if (!value.HasValue)
        {
            return null;
        }

        var date = value.Value;
        return date >= SqlServerMinDate ? date : null;
    }

    private sealed class CombinedPersonDto
    {
        public int CodPersona { get; init; }
        public IReadOnlyList<int> CodPersonas { get; init; } = Array.Empty<int>();
        public string? Ci { get; init; }
        public string? CiAlt { get; init; }
        public string Nombre { get; init; } = string.Empty;
        public string Paterno { get; init; } = string.Empty;
        public string Materno { get; init; } = string.Empty;
        public string NombreCompleto { get; init; } = string.Empty;
        public bool TieneDeuda { get; init; }
        public decimal MontoDeuda { get; init; }
        public string? OrigenPersona { get; init; }
        public string? OrigenUltimoPago { get; init; }
        public IReadOnlyList<string> Origenes { get; init; } = Array.Empty<string>();
    }
}
