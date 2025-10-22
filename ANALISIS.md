# Análisis del proyecto First Class Institute

## 1. Visión general
- Repositorio híbrido con frontend en Next.js 15 (TypeScript/React) en `src/` y un backend separado en .NET 8 Web API dentro de `back/firstclassBack`.
- Enfoque principal: portal administrativo para instituto de idiomas con paneles para profesores y dirección, más utilidades IA (quiz, sopa de letras, diccionario y traductor).
- El diseño replica patrones de [shadcn/ui] combinados con Tailwind y fuentes Google (`Inter`, `Space Grotesk`, `Roboto Mono`) (`src/app/layout.tsx:7`).
- La mayoría de las páginas son maquetas ricas en UI sin conexión real; sólo `'Historial'` consume datos del backend (`src/app/direccion/historial/page.tsx:1`).
- Existen problemas de internacionalización/codificación: caracteres como `InglǸs` o `Gesti��n` aparecen en múltiples vistas, evidenciando archivos guardados con codificación Windows-1252 en un proyecto que asume UTF-8 (`src/app/page.tsx:16`, `src/components/dictionary/DictionarySection.tsx:17`).

## 2. Frontend (Next.js)

**Arquitectura y routing**
- App Router con rutas organizadas por dominios (`/profesores`, `/direccion` y submódulos) (`src/app/direccion/page.tsx:1`).
- `src/components` agrupa: IU reutilizable (shadcn adaptado), secciones de curso, quiz, word-search y layout (`src/components/layout/header.tsx:1`).
- No se usa React Server Components de forma diferenciada; todas las subpáginas son `use client` o componentes tradicionales, con mucho contenido estático y arrays placeholder (por ejemplo, `gestion-profesores` define datos en el componente) (`src/app/direccion/gestion-profesores/page.tsx:13`).

**Estado y datos**
- Única integración real: módulo Historial llama al backend legacy vía `fetch` usando `NEXT_PUBLIC_API_URL` (`src/lib/api.ts:31` y `src/app/direccion/historial/page.tsx:28`).
- Formularios/clientes usan `react-hook-form` + `zod` para validación (`src/components/dictionary/DictionarySection.tsx:21`, `src/components/translator/TranslatorSection.tsx:24`).
- Dependencias declaradas como React Query, Firebase o TanStack Query no se utilizan en el código actual (`package.json:30`), por lo que se pueden depurar o aprovechar.

**Integración con flows IA**
- El frontend importa funciones marcadas con `'use server'` directamente en componentes cliente (`src/components/quiz/quiz-section.tsx:4`, `src/components/word-search/word-search-section.tsx:5`).
- En Next 15 esto implica que el bundler tratará esos módulos como server-only y bloqueará la importación directa; falta un puente (API Route, acción de servidor o el helper de `@genkit-ai/next`) que haga las llamadas desde el cliente.
- Falta manejo de concurrencia/cancelación: llamadas repetidas pueden solaparse; no hay límites ni fallback hasta que termine la promesa.

**UI/UX y componentes**
- `Header` y layout definen estilos base con Tailwind; el diseño es consistente y aprovecha los tokens configurados (`tailwind.config.ts:7`).
- `QuizDisplay` y `WordSearchGrid` ofrecen experiencias interactivas, pero usan `alert` del navegador y estados locales sin feedback accesible (`src/components/quiz/quiz-display.tsx:32`, `src/components/word-search/word-search-grid.tsx:86`).
- `WordSearchGrid` implementa selección de celdas manual (tracking de mouse/touch) pero no controla selección de texto en desktop (`onMouseDown={() => false}` no previene highlight) ni valida que la trayectoria esté dentro de la cuadrícula (`src/components/word-search/word-search-grid.tsx:70`).
- No hay pruebas automatizadas ni storybook; cualquier regresión requerirá verificación manual.

**Configuración y build**
- `next.config.ts` ignora errores de TypeScript y ESLint, ocultando posibles defectos en tiempo de compilación (`next.config.ts:5`). 
- Fonts especificadas se cargan con `next/font` lo que facilita FOIT, pero la metadata mantiene textos con codificación incorrecta (`src/app/layout.tsx:9`).
- Tailwind configurado con custom tokens, animaciones y modo `class` para dark mode (`tailwind.config.ts:4`).

## 3. Módulo de IA (Genkit)
- Configurado en `src/ai/genkit.ts:1` con el plugin `@genkit-ai/googleai` y modelo `gemini-2.0-flash`.
- Flows implementados:
  1. `generateQuiz` — genera preguntas tipo test (`src/ai/flows/generate-quiz.ts:1`).
  2. `generateWordSearch` — devuelve sopa de letras con grid/words (`src/ai/flows/generate-word-search.ts:1`).
  3. `defineWord` — define palabra y ejemplo (`src/ai/flows/define-word.ts:1`).
  4. `translateText` — traduce entre inglés/español (`src/ai/flows/translate-text.ts:1`).
- Cada flow define esquema con `z.object` y crea un prompt textual; no hay guardas para uso indebido ni sanitización adicional de prompts.
- Falta configuración de logging, cuotas o reintentos; el consumo se hace directo y sin wrapper que maneje latencia o errores recurrentes.
- El archivo `src/ai/dev.ts:1` registra los flows y carga `.env`, pensado para ejecutarse con `genkit start`, pero no hay docs sobre despliegue productivo ni variables obligatorias.

## 4. Backend Legacy (.NET)

**Estructura**
- Proyecto `LegacyData` (ASP.NET Core) con DbContext que mapea tablas `PERSONAS_UNIFICADO` y `PAGOS_UNIFICADO` (`back/firstclassBack/LegacyData/Data/LegacyContext.cs:7`).
- Modelos `Persona` y `Pago` describen campos numerados y relaciones uno-a-muchos (`back/firstclassBack/LegacyData/Models/Persona.cs:1`, `back/firstclassBack/LegacyData/Models/Pago.cs:1`).
- Controladores:
  * `LegacySearchController` expone `/api/legacy/search` con filtros por CI o tokens de nombre y calcula deuda/origen último pago (`back/firstclassBack/LegacyData/Controllers/LegacySearchController.cs:10`).
  * `LegacyPaymentsController` entrega pagos paginados por persona (`back/firstclassBack/LegacyData/Controllers/LegacyPaymentsController.cs:10`).
- `Program.cs` habilita Swagger y CORS para puertos 9002/3000, sin HTTPS forzado en desarrollo (`back/firstclassBack/LegacyData/Program.cs:5`).

**Seguridad y configuración**
- `ApiKeyMiddleware` existe pero no se registra en la tubería, por lo que todas las rutas quedan abiertas (`back/firstclassBack/ApiKeyMiddleware.cs:1`).
- Credenciales productivas (usuario/contraseña SQL) están hardcodeadas en `appsettings.json` comprometido en el repositorio (`back/firstclassBack/LegacyData/appsettings.json:3`).
- No hay migraciones ni scripts de base de datos; se asume esquema existente.
- Falta manejo de errores: exceptions de EF terminan en 500 sin logging estructurado.

## 5. Configuración y dependencias
- `package.json` define scripts básicos (`dev`, `build`, `start`, `lint`, `typecheck`) pero no incorpora pruebas (`package.json:6`).
- Dependencias UI: `@radix-ui/*`, `class-variance-authority`, `lucide-react`, `tailwind-merge`.
- Dependencias AI: `genkit`, `@genkit-ai/googleai`, `@genkit-ai/next`.
- Varias dependencias sin uso aparente (Firebase, Tanstack Query, Recharts, Date-fns); revisar para reducir peso del bundle.
- `tsconfig.json` no habilita `strict`; se heredan defaults menos seguros.
- `.env` sólo contiene `NEXT_PUBLIC_API_URL` (`.env:1`); no hay variables para credenciales de Genkit ni API key del backend.

## 6. Riesgos principales
1. **Fallo en la frontera server/client**: importar flows `use server` desde componentes cliente romperá el build o provocará referencias `__next_internal_action__`, dejando inoperativas las funciones IA (`src/components/quiz/quiz-section.tsx:4`).
2. **Secretos expuestos**: el connection string en git es un riesgo crítico. Incluso en desarrollo, debería extraerse a variables de entorno (`back/firstclassBack/LegacyData/appsettings.json:3`).
3. **Codificación incorrecta**: caracteres corruptos afectan UX y SEO; indican inconsistencia de encoding que debe normalizarse a UTF-8 (`src/app/page.tsx:19`).
4. **Errores silenciados**: `ignoreBuildErrors` y `ignoreDuringBuilds` ocultan problemas de tipado/lint que podrían escalar a runtime (`next.config.ts:5`).
5. **Ausencia de autenticación**: API carece de protección real pese al middleware sin registrar; cualquier cliente puede consultar datos sensibles.
6. **Falta de pruebas y monitoreo**: ni frontend ni backend incluyen suites de test, ni observabilidad/logging estructurado.
7. **UX inconsistentes**: alertas nativas, falta de deshabilitado preventivo en botones (`QuizDisplay`), y selección de texto accidental en el juego (`src/components/word-search/word-search-grid.tsx:101`).

## 7. Recomendaciones
1. **Normalizar encoding y contenidos**: reabrir archivos afectados en UTF-8 y reemplazar caracteres corruptos, empezando por layout y páginas principales.
2. **Rearquitecturar llamadas IA**: envolver flows en API routes (`app/api/*`) o usar el helper oficial `createRouteHandler` de `@genkit-ai/next`, exponiéndolos vía fetch seguro desde el cliente.
3. **Implementar seguridad en backend**: mover cadena de conexión a secrets, registrar `ApiKeyMiddleware` en `Program.cs`, y añadir rate-limiting/logging.
4. **Restaurar validaciones de build**: quitar `ignoreBuildErrors`, activar `tsconfig` estricto y añadir `eslint`/`tsc` a CI.
5. **Cubrir funcionalidades reales**: conectar formularios de Dirección (inscripción, cambio de status, etc.) a endpoints o separar en historias pendientes para evitar confusión con maquetas.
6. **Depurar dependencias**: eliminar paquetes no usados o justificar su presencia para reducir tiempos de instalación/bundle.
7. **Agregar pruebas**: comenzar con pruebas de integración en backend (controllers) y pruebas unitarias en flows IA; en frontend, tests de componentes críticos (`Historial`, `QuizSection`).
8. **Documentar despliegue**: ampliar README con instrucciones para levantar backend, configurar Genkit (claves API), y flujo de desarrollo conjunto.
9. **Mejorar UX**: reemplazar `alert` por toasts (`useToast`), bloquear acciones repetidas mientras se espera respuesta, y manejar cancelaciones (AbortController) en fetch.

---

Este documento cubre el estado actual del repositorio a la fecha del análisis. Cualquier cambio posterior debería reflejarse actualizando las secciones afectadas.
