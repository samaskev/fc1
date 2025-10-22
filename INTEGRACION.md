# Informe de integraciones reales (Frontend ↔ Backend)

## 1. Contexto general
- El único punto de integración efectiva entre el frontend Next.js y el backend .NET es el módulo de consulta de legados (personas y pagos).  
- Tanto la vista `Historial` como la ruta interna `legacy` reutilizan el mismo cliente `src/lib/api.ts`, que consume los endpoints REST expuestos por `LegacySearchController` y `LegacyPaymentsController`.
- No existen otras vistas conectadas a datos en vivo; el resto del portal (profesores, dirección, IA) usa datos mock o lógica local.

## 2. Configuración compartida
- `NEXT_PUBLIC_API_URL` definido en `.env` (`.env:1`) establece el host base para todas las llamadas desde el frontend (`src/lib/api.ts:44`).
- El backend habilita CORS para `http://localhost:9002` (puerto usado por `next dev`) (`back/firstclassBack/LegacyData/Program.cs:21` y `back/firstclassBack/LegacyData/Program.cs:40`).

## 3. Cliente HTTP en el frontend
- `src/lib/api.ts` define las estructuras de datos y funciones reutilizadas por las vistas:
  - Interfaces `PersonaRow` y `PaymentRow` que modelan la respuesta (`src/lib/api.ts:2`, `src/lib/api.ts:23`).
  - `searchLegacy(query, page, pageSize)` construye un `URL` hacia `/api/legacy/search`, agrega parámetros y lanza `fetch` sin cache (`src/lib/api.ts:46`).
  - `getPayments(codPersona, page, pageSize)` llama a `/api/legacy/personas/{codPersona}/pagos` (`src/lib/api.ts:56`).
- Ambas funciones lanzan un `Error` si el status HTTP no es exitoso; el manejo se realiza en las vistas consumidoras.

## 4. Vistas frontend conectadas

### 4.1 `Historial` (Portal de Dirección)
- Archivo: `src/app/direccion/historial/page.tsx`.
- Integración:
  1. Importa el cliente `searchLegacy` y `getPayments` (`src/app/direccion/historial/page.tsx:4`).
  2. En el primer render ejecuta `runSearch('')` dentro de `useEffect` para poblar la tabla (`src/app/direccion/historial/page.tsx:54`).
  3. `runSearch` actualiza estados de carga y guarda estudiantes y totales con los datos REST (`src/app/direccion/historial/page.tsx:29`).
  4. `loadPayments` obtiene pagos de la persona seleccionada y actualiza la tabla de detalle (`src/app/direccion/historial/page.tsx:43`).
  5. Inputs y botones re-disparan `runSearch`/`loadPayments` con los estados correspondientes (`src/app/direccion/historial/page.tsx:95`, `src/app/direccion/historial/page.tsx:98`).
- Presentación:
  - Tabla de estudiantes muestra CI, nombre, origen de último pago y deuda usando campos devueltos por el backend.
  - Tabla secundaria lista los pagos recibidos; fechas se formatean con `toLocaleDateString`.
- Errores no se capturan de forma explícita; el `try/finally` resetea spinners pero no ofrece feedback.

### 4.2 Vista interna `legacy`
- Archivo: `src/app/legacy/page.tsx`.
- Funciona como sandbox simplificada del mismo flujo:
  1. Importa `searchLegacy` y `getPayments` (`src/app/legacy/page.tsx:3`).
  2. Ejecuta `runSearch("")` al montar (`src/app/legacy/page.tsx:39`).
  3. Gestiona selección de persona para obtener pagos (`src/app/legacy/page.tsx:27`).
- Interfaz mínima con inputs HTML nativos y tablas básicas, útil para depurar la API sin depender del look & feel principal.

## 5. Endpoints del backend consumidos

| Endpoint | Controlador | Lógica relevante |
| --- | --- | --- |
| `GET /api/legacy/search` | `LegacySearchController` (`back/firstclassBack/LegacyData/Controllers/LegacySearchController.cs:5`) | Filtra `Personas` por CI o tokens del nombre, calcula deuda y origen del último pago; retorna `total`, `page`, `pageSize` y `items`. |
| `GET /api/legacy/personas/{codPersona}/pagos` | `LegacyPaymentsController` (`back/firstclassBack/LegacyData/Controllers/LegacyPaymentsController.cs:5`) | Filtra `Pagos` por persona y opcionalmente por origen; ordena por fecha y materializa una lista paginada con los campos mostrados en el frontend. |

Otros detalles clave:
- Ambos controladores usan `LegacyContext` (`back/firstclassBack/LegacyData/Data/LegacyContext.cs:7`) para consultar las tablas `PERSONAS_UNIFICADO` y `PAGOS_UNIFICADO`.
- Las selecciones proyectan sólo los campos que el frontend espera; cualquier cambio estructural debe reflejarse en `src/lib/api.ts`.

## 6. Modelo de datos compartido
- `Persona` expone relación `Pagos` (`back/firstclassBack/LegacyData/Models/Persona.cs:18`), usada para calcular `tieneDeuda`, `montoDeuda` y `origenUltimoPago` en el `Select`.
- `Pago` incluye campos financieros y metadatos (`back/firstclassBack/LegacyData/Models/Pago.cs:1`); el frontend muestra `monto`, `estado`, `gestion`, `mes`, `fechaQueCancelo` y `origen`.

## 7. Flujo end-to-end resumido
1. El usuario abre `/direccion/historial`; el componente dispara `runSearch('')`.
2. `runSearch` construye la URL con `NEXT_PUBLIC_API_URL` y llama `fetch` al endpoint legacy.
3. El backend consulta SQL Server vía EF Core, mapea los resultados y devuelve JSON.
4. El frontend actualiza la lista de estudiantes y renderiza la tabla.
5. Al seleccionar “Ver pagos”, el frontend llama al endpoint de pagos con `codPersona`, obtiene la lista y la muestra en la tabla de detalle.
6. El flujo se repite para nuevos filtros o selecciones.

## 8. Elementos pendientes o ausentes
- `ApiKeyMiddleware` nunca se registra en el pipeline, por lo que los endpoints quedan sin autenticación (`back/firstclassBack/ApiKeyMiddleware.cs:1`).
- No hay capas intermedias (React Query, SWR, TanStack) pese a tener dependencias instaladas; el manejo de cache/control de errores se realiza manualmente.
- Las funciones de IA (`generateQuiz`, `translateText`, etc.) todavía no atraviesan el backend ni exponen endpoints; son módulos independientes sin consumo real desde el frontend.

## 9. Consideraciones para ampliar la integración
- Añadir manejo de errores y feedback visual en el frontend (toast/destructive states) cuando los fetch fallen.
- Unificar la vista `legacy` y `Historial` para evitar duplicidad y mantener una sola fuente de verdad.
- Registrar el middleware de API Key y trasladar la cadena de conexión a variables de entorno seguras para endurecer la API antes de exponerla públicamente.
