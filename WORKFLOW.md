# Flujo de Trabajo de la Aplicación y Estructura de Datos

Este documento detalla el flujo de trabajo de la aplicación, dividido por roles de usuario, y las principales "tablas" o colecciones de datos que cada sección utilizaría. Está diseñado para ser una guía para la creación de un mapa conceptual.

---

## 1. ROL: DIRECCIÓN (El Centro de Mando)

**Portal Principal (`/direccion`)**
*   **Flujo:** Punto de acceso central a todas las funciones administrativas. El director ve tarjetas para cada módulo de gestión.
*   **Tablas/Datos Involucrados:** `Usuarios` (para validar el rol de Dirección).

### Módulos de Gestión:

*   **Formulario de Inscripción (`/direccion/inscripcion-alumnos`)**
    *   **Flujo:** El personal llena un formulario detallado para registrar a un nuevo estudiante en un curso. Al enviar, se crea un nuevo registro.
    *   **Tabla Principal:** `Inscripciones` (cada envío genera un nuevo documento aquí con todos los datos del formulario).
    *   **Tablas Relacionadas:** `Personas` (se podría crear/actualizar un registro de la persona), `Cursos` (para validar que el curso existe).

*   **Registro de Pagos (`/direccion/registro-pagos`)**
    *   **Flujo:** Se busca un estudiante por CI. El sistema carga sus datos. El personal ingresa los detalles del pago (mes, monto) y lo registra.
    *   **Tabla Principal:** `Pagos` (se crea un nuevo documento por cada pago, vinculado al estudiante).
    *   **Tablas Relacionadas:** `Inscripciones` o `Personas` (para buscar y obtener los datos del estudiante).

*   **Congelación de Cuentas (`/direccion/congelacion-cuentas`)**
    *   **Flujo:** El sistema muestra una lista de alumnos con pagos atrasados. El director puede buscar a un alumno específico o usar la lista para encontrar y "congelar" su cuenta, cambiando su estado.
    *   **Tabla Principal:** `Pagos` (para identificar quiénes tienen retrasos).
    *   **Tablas Relacionadas:** `Personas` o `Inscripciones` (para cambiar el campo "status" del alumno a "Congelado").

*   **Gestión de Comunicados (`/direccion/comunicaciones`)**
    *   **Flujo:** El director redacta un mensaje, selecciona un grupo de destinatarios (General, Alumnos, Profesores) y lo envía. También puede ver una lista de alumnos con pagos pendientes para enviarles recordatorios.
    *   **Tabla Principal:** `Comunicados` (se guarda un registro de cada mensaje enviado).
    *   **Tablas Relacionadas:** `Usuarios` (para filtrar por rol), `Pagos` (para la lista de deudores).

*   **Gestión de Status (`/direccion/cambio-status`)**
    *   **Flujo:** Permite crear, ver, editar o eliminar los diferentes estados que un alumno puede tener en el sistema (Activo, Retirado, Egresado, etc.).
    *   **Tabla Principal:** `Status` (una colección que define los posibles estados y sus propiedades, como el color).

*   **Gestión de Profesores (`/direccion/gestion-profesores`)**
    *   **Flujo:** Ver la lista de profesores, añadir nuevos, editar su información y asignarles cursos.
    *   **Tabla Principal:** `Usuarios` (filtrada por rol "Profesor").
    *   **Tablas Relacionadas:** `Cursos` (para la asignación).

---

## 2. ROL: PROFESOR (El Guía Educativo)

**Portal Principal (`/profesores`)**
*   **Flujo:** Vista general de las herramientas disponibles para el profesor.

### Módulos Clave:

*   **Gestión del Aula Virtual (`/profesores/aula-virtual`)**
    *   **Flujo:** Es el centro de operaciones del profesor. Desde aquí puede:
        1.  **Tomar Asistencia:** Usar la tabla interactiva para marcar la asistencia diaria de cada alumno con un menú desplegable. El total de asistencias se calcula automáticamente.
        2.  **Gestionar Temario:** Añadir/editar unidades del curso y subir el material de lectura (PDFs).
        3.  **Gestionar Alumnos:** Ver la lista de alumnos inscritos en su clase.
    *   **Tabla Principal:** `Asistencias` (contiene los registros de asistencia por curso y mes). `Cursos` (para gestionar el temario y materiales).
    *   **Tablas Relacionadas:** `Inscripciones` (para obtener la lista de alumnos).

*   **Gestión de Calificaciones (`/profesores/calificaciones`)**
    *   **Flujo:** El profesor selecciona un curso y ve la lista de alumnos con sus calificaciones promedio. Puede registrar nuevas notas y dejar feedback.
    *   **Tabla Principal:** `Calificaciones` (un registro por cada evaluación de cada alumno).
    *   **Tablas Relacionadas:** `Inscripciones` (para la lista de alumnos por curso).

*   **Perfil del Profesor (`/profesores/perfil`)**
    *   **Flujo:** El profesor puede ver su información personal, profesional y los cursos que tiene asignados.
    *   **Tabla Principal:** `Usuarios` (el documento específico del profesor que ha iniciado sesión).

---

## 3. ROL: ALUMNO (El Aprendiz)

**Portal Principal (`/alumnos`)**
*   **Flujo:** El estudiante tiene acceso a todas sus herramientas de aprendizaje.

### Módulos Clave:

*   **Aula Virtual (`/alumnos/aula-virtual`)**
    *   **Flujo:** El alumno ve el temario de su curso. En lugar de descargar archivos, hace clic en "Leer Material" para acceder al libro virtual.
    *   **Tablas Relacionadas:** `Cursos` (para ver el temario). `Materiales` (para obtener el contenido).

*   **Libro Virtual (`/alumnos/aula-virtual/material/[slug]`)**
    *   **Flujo:** El alumno lee el contenido de la lección. Si encuentra una palabra difícil, la selecciona con el mouse. Aparece un botón "Definir". Al hacer clic, la IA le muestra la definición y un ejemplo de uso.
    *   **Proceso de IA:** `defineWord` (no es una tabla, es un flujo que procesa la palabra y devuelve un resultado).

*   **Calendario de Estudio (`/alumnos/calendario-estudio`)**
    *   **Flujo:** El alumno ve su calendario con las clases fijas del instituto (martes y jueves). Puede añadir sus propias sesiones de estudio, que se marcan de un color diferente.
    *   **Tabla Principal:** `Eventos_Personales` (guardaría las sesiones de estudio del alumno, vinculado a su ID).

*   **Mis Pagos (`/alumnos/pagos`)**
    *   **Flujo:** El alumno puede ver su historial de pagos y tiene un botón para contactar a administración por WhatsApp para realizar un nuevo pago.
    *   **Tabla Principal:** `Pagos` (filtrada por el ID del alumno).
