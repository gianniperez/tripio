# Documento de Requerimientos del Sistema (DRS) - Proyecto Tripio

> **Versión:** 3.0  
> **Estado:** Draft  
> **Última actualización:** 4 de Marzo, 2026  
> **Basado en:** Lineamientos de Antigravity DRS

---

## 1. Resumen Ejecutivo

Este documento sintetiza el plan para **Tripio**, un organizador integral de viajes grupales. El producto es un **contenedor de viaje colaborativo**, donde cada experiencia funciona como un ecosistema autónomo con su propio destino, timeline, presupuesto estructurado y logística.

**Puntos Clave del MVP:**

- **PWA (Mobile First):** Diseño optimizado para móvil, con soporte responsive para Desktop vía navegador.
- **Autenticación:** Firebase Auth (Google y Email).
- **Base de Datos:** Firebase Firestore (subcolecciones por viaje).
- **Gestión Económica:** Fijos, Proyectados y Diarios.
- **Logística & Tareas:** Timeline interactivo y asignación de recursos vinculada.
- **Propuestas Unificadas:** Módulo único que cubre ideas ricas y encuestas simples.

---

## 2. Definición Detallada de Componentes

### 2.1 El Viaje como Contenedor Autónomo (Core)

El viaje es el núcleo del ecosistema. Almacena la historia completa, preservando el contexto para el futuro.

**Ciclo de Vida:**

1. **`Planning` (Planificación Activa):** Estado inicial de alta mutabilidad.
2. **`Active` (Viaje en Curso):** Se activa automáticamente en la `startDate`. La UI prioriza la información del día.
3. **`Archived` (Cierre/Archivo):** Solo lectura tras la finalización.

#### Dashboard "Overview" (Resumen Ejecutivo / Home)

Tanto en estado `Planning` como `Active`, el Dashboard principal ofrece un resumen de alto nivel y actúa como centro gerencial del viaje:

- **Nombre y Fechas:** Identificación clara del viaje. Al crear el viaje, las fechas no son obligatorias, pero al fijarse organizan el Timeline.
- **Alojamiento:** Indicador de estado (ej: "2/3 noches definidas" o "Pendiente").
- **Presupuestos:** Visualización del gasto total vs. Budget Limit. El presupuesto diario y el límite total no son obligatorios al crear el viaje.
- **Próximas Actividades:** Extracto directo del Timeline con los eventos más inmediatos.
- **Alertas / Avisos:** Indicadores de estado de tareas pendientes o propuestas en "Ideas" requeridas para decisión.

#### Vista Timeline Secuencial (Narrativo)

- **Enfoque en Fechas del Viaje:** El timeline abarca estrictamente el rango de fechas definidas para el viaje (`startDate` a `endDate`), adaptando su vista a esa ventana temporal real de forma dinámica.
- **Contenido Confirmado:** Solo muestra eventos y actividades que hayan sido formalmente **confirmados**.
- **Vista Visual de Progreso:** Los elementos que ya pasaron o se completaron aparecen tachados o con opacidad reducida.
- **Estética:** Línea vertical con conectores visuales que narran el flujo del viaje.
- **Tarjetas Dinámicas:** Actividades, Tareas (con responsable), y Logística (Check-in/out).

#### Vista Calendario Clásico (Grid)

- **Elementos:** Cuadrícula mensual/semanal.
- **Identificadores Rápidos:** Iconos sobre cada día indicando volumen de planes y presupuesto.
- **Acceso Directo:** Click en un día abre el modal de "Detalle del Día" o permite agregar una propuesta directamente.

### 2.2 Gestión Económica (Total Cost)

Previsión financiera dividida en tres capas de control:

1. **Costos Fijos:** Gastos ya comprometidos (Ej: Alojamiento).
2. **Costos Proyectados:** Estimaciones para variables grupales (Ej: Combustible).
3. **Presupuesto Diario:** Monto fijo por día (ej. $50 USD) que escala según la duración. No se cargan tickets individuales.

El **Total Cost** individual es la suma de su parte proporcional de fijos, proyectados y su total de diarios.

> **No-Goal:** Prohibida la carga de gastos hormiga/tickets. Se asumen cubiertos por el "Presupuesto Diario". Tripio es una herramienta de **presupuestación**, no de gestión de deuda interna.

### 2.3 Destino y Actividades

Repositorio de qué hacer, con confirmación de asistencia (**RSVP**) para dimensionar la logística.

### 2.4 Logística (Alojamientos, Transporte e Inventario)

La vista de **Logística** es el espacio oficial que aloja las decisiones confirmadas sobre "Dónde nos quedamos" y "Cómo vamos".

#### Alojamientos

- Definición de lugares donde pernoctar, requiriendo **Fecha de Inicio** y **Fecha de Fin**.
- Los alojamientos no se pisan, sino que se complementan (ej. 5 días en Logia A, 5 días en Logia B).
- **Entrada Directa:** Solo los **Admins** pueden crear una entrada directa de alojamiento. Los Members deben proponerlo en "Ideas" primero.

#### Medios de Transporte

En lugar de gestionar activos físicos complejos, el sistema registra:

- **Medio:** (Auto Pedro, Avión, Micro).
- **Capacidad y Auto-Asignación:** Los usuarios deben poder **asignarse a sí mismos** a un transporte libre (ej: "Sumarme a este Auto") hasta llenar la capacidad.

#### Inventario Grupal (Shared Items)

Repositorio de ítems necesarios (Carpa, Parlante).

- **Opcionalidad:** Siempre debe estar la opción de indicar quién lo lleva, pero no es obligatorio para el MVP que todos los ítems tengan dueño.
- **Vínculo con Tareas:** Si se asigna un responsable a un ítem, automáticamente se genera una **Tarea** asociada.

### 2.5 Sistema de Tareas Inteligentes

Las tareas son el motor de acción del grupo.

- **Vínculo con Calendario:** Una tarea puede nacer de un evento (ej. "Comprar carbón" para el evento "Parrillada").
- **Vínculo con Inventario:** Una tarea puede nacer de un ítem (ej. "Conseguir Carpa").
- **Visualización:** Aparecen en el Módulo de Tareas y también dentro del detalle del Evento o Ítem relacionado.

### 2.6 Módulo de Ideas / Propuestas

Espacio asíncrono y no bloqueante para la co-creación del viaje antes de formalizar el timeline y la logística. Aquí se toman las decisiones grupales.

- **Filtrado y Orden:** Permite categorizar y ordenar ideas (por categoría, más votadas, fechas, etc.).
- **Visualización Completada:** Las ideas resueltas se muestran visualmente tachadas.
- **Flujo de Decisión:**
  - **Alojamientos:** Se proponen con fechas estimadas. Si se confirman, pasan automáticamente a la sección **Logística**.
  - **Actividades:** Si se confirman, se agendan como eventos oficiales en el **Timeline**.

#### Estructura de Votación Dual

Para maximizar la flexibilidad, las propuestas admiten dos capas de votación simultáneas e independientes:

1. **RSVP (Interés General):** Votación obligatoria de nivel superior sobre si el usuario "Se suma" o no al plan.
   - Opciones fijas: "Sí, me interesa", "No me interesa", "No me sumo".
2. **Opciones (Votación Específica):** Votación sobre alternativas dentro de la propuesta (ej. "¿A qué hora?", "¿Qué menú?").
   - Opciones dinámicas definidas por el creador.

#### Mapeo de Campos Condicionales por Tipo

El formulario de propuesta adapta su estructura de datos según el `type` seleccionado para evitar ruidos visuales:

| Tipo                | Campos Relevantes                                       | Acción al Confirmar                      |
| :------------------ | :------------------------------------------------------ | :--------------------------------------- |
| **`activity`**      | Título, Descripción, Ubicación, Costo Estimado, Fechas  | Crea Evento en Timeline                  |
| **`accommodation`** | Título, Descripción, Dirección (Ubicación), Costo Total | Crea Registro en Logística (Alojamiento) |
| **`transport`**     | Título, Descripción, Ruta (Ubicación), Costo            | Crea Registro en Logística (Transporte)  |
| **`inventory`**     | Título, Descripción (Cantidad/Nota)                     | Crea Registro en Inventario              |
| **`other`**         | Título, Descripción                                     | Crea Evento genérico o Tarea             |

#### Ciclo de Vida de la Propuesta

1. **`Draft`:** Solo texto e idea base.
2. **`Voted`:** Interacción grupal activa (RSVP y/o Votación de opciones).
3. **`Confirmed`:** Se convierte en un hito oficial (Timeline / Logística).
4. **`Rejected`:** Descartada por el grupo.

---

## 3. Arquitectura y UX/UI

### 3.1 Navegación y Jerarquía (PWA Focus)

```text
Login (Firebase Auth) -> Mis Viajes (/trips)
│
└── Viaje [ID] (Sticky Bottom NavBar — 4 botones)
    ├── 🏠 Inicio
    ├── 💡 Propuestas
    ├── ✅ Logística
    └── 👥 Participantes
```

_La Bottom NavBar contiene exactamente 4 íconos. No existe un botón flotante global de "+" en la barra._

#### Vista: 🏠 Inicio (Home + Timeline unificado)

El Home actúa como el centro de control del viaje. Contiene:

- **Resumen del Viaje:** Nombre, rango de fechas, moneda configurada.
- **Dashboard Cards:** Conteo de Alojamientos, Vehículos e Ideas Pendientes (clickeables para navegar a la vista correspondiente).
- **Presupuesto:** Gasto acumulado vs. límite personal, con la moneda del viaje.
- **Timeline Inline:** Debajo del dashboard se despliega el Timeline completo con las actividades confirmadas (ordenadas cronológicamente). Incluye un **toggle pill (Timeline / Calendario)** para alternar entre la vista de lista cronológica y la grilla de calendario mensual, todo dentro del Home sin cambiar de pantalla. Si no hay actividades confirmadas, se muestra un estado vacío con CTA para ir a Ideas o configurar fechas.
- **Botón ⚙️ Editar Viaje:** Abre un modal para editar nombre, fechas, moneda, presupuesto y eliminar el viaje.

#### Vista: 💡 Propuestas

Espacio asíncrono de brainstorming y toma de decisiones grupales.

- **Filtros:** Todas, Alojamientos, Actividades, Transporte.
- **FAB (Floating Action Button):** El botón "+" para proponer una nueva idea vive fijado en la esquina inferior derecha **únicamente dentro de esta vista**.
- **Tarjetas de Ideas:** Muestran tipo, título, costo, fecha, y estado con un botón de voto a la derecha.
- **Ideas Confirmadas:** Al confirmarse, el badge cambia a "CONFIRMADO ✅", el título se tacha, y el botón de voto es reemplazado por un indicador visual estático (✅ + conteo de votos). No se puede seguir votando.
- **Formulario de Nueva Idea:** Al publicar, el modal se cierra automáticamente. La fecha sugerida toma como `min` y `value` predeterminado la fecha de inicio del viaje (si existe).

#### Vista: ✅ Logística (Decidido)

Fuente de verdad para alojamientos y transporte confirmados.

- **Sección Alojamientos:**
  - Solo los **Admins** ven el botón (+) para añadir alojamiento directo (bypass de Ideas).
  - El calendario de ingreso/salida inicia en la fecha de inicio del viaje si está definida.
  - Los alojamientos pueden complementarse (Ej: Días 1-5 Hostel A, Días 5-10 Hotel B).
- **Sección Transportes:**
  - Cualquier usuario puede añadir un transporte.
  - **"Detalles Extras" es opcional** en el formulario.
  - Se debe seleccionar el **Tipo de Transporte**: `Ida`, `Vuelta`, o `Interno`.
  - Los usuarios pueden **auto-asignarse** ("Sumarme") y **des-inscribirse** ("Salir") de un transporte.

#### Vista: 👥 Participantes

Espacio dedicado a la gestión de las personas que conforman el viaje.

- **Listado de Participantes:** Muestra el rol de cada usuario y detalles como "Propietario" o "Permisos especiales".
- **Gestión de Roles y Permisos:** Los Admins y el Owner pueden modificar los roles y definir overrides de permisos granulares por cada participante directamente desde esta vista.
- **Invitaciones:** Formulario simple para invitar nuevos miembros proporcionando su correo electrónico y rol inicial asignado.

#### Validaciones de Formulario de Viaje (Crear / Editar)

- Si se carga Fecha Inicio, se exige Fecha Fin (y viceversa). Ambas vacías es válido.
- Fecha Fin nunca puede ser anterior a Fecha Inicio.
- Moneda del viaje seleccionable: USD, EUR, ARS, BRL.
- Presupuesto Diario y Límite Personal son **opcionales**.

#### Comportamiento Global de la UI Móvil (Header y Bottom NavBar)

- **Header:** El Header (con el Nombre del viaje y contexto) permanece fijo (Sticky) en la parte superior en todo momento.
- **Bottom NavBar:** Por temas de inmersión y aprovechar la pantalla vertical, la barra de navegación inferior deberá ocultarse gradualmente al hacer **Scroll hacia abajo (scroll down)** y reaparecer instantáneamente al hacer **Scroll hacia arriba (scroll up)** o llegar al final de la página.

### 3.2 Stack Tecnológico

- **Frontend:** Next.js (App Router) / TypeScript.
- **Backend/DB:** Firebase (Firestore, Auth).
- **State Management:** Zustand (UI local) + TanStack Query (server state).
- **Forms & Validation:** React Hook Form + Zod.
- **Utilities:** `date-fns` (manejo de fechas), `lucide-react` (iconografía).
- **UI:** Tailwind CSS v4.
- **Deployment:** Vercel o Firebase Hosting.
- **Offline (Post-MVP):** Service Workers para lectura cacheada.

### 3.3 Arquitectura y Convenciones (FSD & Tooling)

El proyecto hereda las estrictas normativas del boilerplate fundacional (`next-seed`), garantizando un crecimiento escalable y libre de deuda técnica:

1. **Estructura FSD (Feature-Sliced Design):**
   - `src/app/`: Exclusivamente Rutas, Páginas (Next.js App Router) y Layouts.
   - `src/components/`: **Solo** UI genérica, agnóstica al negocio (Botones, Modales Base, Inputs).
   - `src/features/`: **El corazón del dominio**. Aquí viven funciones complejas aisladas (ej: `auth`, `viajes`, `propuestas`). Cada feature tiene sus propios `components/`, `types/`, `stores/` y `api/`.
   - `src/providers/`: Contextos globales (Zustand, TanStack Query, Tema).
   - `src/utils/` y `src/hooks/`: Lógica compartida, global y pura.
2. **Generación Automatizada (Plop.js):** Está **estrictamente prohibido** crear componentes o features a mano. Toda nueva pieza de UI debe inicializarse usando `npm run generate` / `npx plop` para garantizar la estructura base (Component, Types e Index de exportación).
3. **Exportaciones de Barril (Barrel Files):** Las importaciones a una feature o componente interno siempre deben realizarse apuntando a su puerta principal (el `index.ts`), nunca buceando profundamente en archivos anidados.
4. **Manejo de Estado (Boundaries):**
   - **TanStack Query:** Único responsable de la interacción con Firebase Firestore (Server State, Caching, Mutations).
   - **Zustand:** Único responsable del estado efímero de la UI (Client State) como "menús abiertos", "modo oscuro", e interconexión de componentes hermanos.
5. **Calidad Asistida (Husky & Lint-staged):** El código debe pasar por Prettier, ESLint y Vitest (si aplica) antes de cada commit. Errores de tipado bloquearán el push.

---

## 4. UX/UI General

### 4.1 Principios de Diseño

- **Mobile-First PWA:** Diseñado para pulgar, botones grandes, feedback táctil. Responsive para Desktop.
- **Gamificación Proactiva:**
  - **Hitos de Grupo:** Barras de progreso por categorías (Logística completa, Finanzas cerradas).
  - **Badges:** Iconos lúdicos por completar tareas o ser el primero en hacer RSVP.
  - **Mascota (Future Scope):** Un guía lúdico que celebra hitos (no incluido en MVP).

### 4.2 Sistema de Diseño (Design Tokens - Neumorfismo Lúdico)

Las variables globales de diseño (Tokens) se definirán en la configuración de Tailwind CSS (`globals.css` / `tailwind config`) para asegurar la consistencia del efecto neumórfico.

#### 1. Tipografía (Fonts)

- **Primary Font (Headings & UI):** Nunito (San-serif redondeada, amigable y con mucha personalidad para títulos y botones).
- **Secondary Font (Body/Lectura):** Inter (Diseñada específicamente para pantallas, máxima legibilidad y neutralidad para lectura densa).

#### 2. Paleta de Colores (Theme)

Tripio debe transmitir emoción por viajar, organización y calma.

- **Primary (Brand):** Tono vibrantes: Naranja (`#F46A1F`), Turquesa (`#1A8C8C`), Azul oscuro (`#075056`).
- **Secondary (Accents):** Colores complementarios para destacar estados (ej: verde para "Decidido", rojo para "Alertas de Budget").
- **Backgrounds (Surface):** Fondo limpio (`#FFFAF5`) para evitar fatiga visual ante tanto contenido.
- **Text & Borders:** Escala de grises semánticos (`slate` o `gray` de Tailwind) y/o azules oscuros (`#001523`).

#### 3. Forma y Profundidad (Neumorfismo Lúdico)

El diseño abandona las tarjetas planas tradicionales a favor de un **Neumorfismo Suave**.

- **Efecto Neumórfico:** Uso de sombras dobles (una sombra clara arriba a la izquierda y una sombra oscura suave abajo a la derecha) sobre elementos que comparten el mismo color de fondo del lienzo, creando la ilusión de que los elementos están "extruidos" del fondo.
- **Border Radius:** `Rounded-2xl` o `Rounded-xl` exagerados (16px a 24px) para mantener el tono amable, lúdico y "App-like".
- **Interacciones Táctiles:** Al presionar un botón o tarjeta interactiva, el efecto de sombra cambia a `inset` (hundido), dando un feedback físico y tridimensional excelente.
- **Bordes:** Se evita usar bordes duros (`border-solid`), el volumen se da exclusivamente con las luces y sombras.

#### 4. Spacing (Whitespace)

- Se priorizará un margen holgado (padding generoso como `p-4` o `p-6` en containers) para evitar agrupamiento en pantallas chicas, haciendo la app 100% "Tap-friendly".

---

## 5. Fases de Implementación (Firebase Focus)

- **Fase 0:** Setup de proyecto (Next.js + Firebase Auth/Firestore).
- **Fase 1:** El Viaje y Timeline (Vista Dual básica).
- **Fase 2:** Economía (3 niveles + Límite de Presupuesto + Notificaciones Mail).
- **Fase 3:** Logística e Inventario vinculado a Tareas.

---

## 6. Notificaciones e Interacciones

| Trigger                  | Condición                          | Acción                                                            |
| :----------------------- | :--------------------------------- | :---------------------------------------------------------------- |
| **Nuevo Participante**   | Unión vía link.                    | Mail al Admin / Toast en App.                                     |
| **Gasto/Update**         | Cambio en costos.                  | Recálculo de "Total Cost" y alerta si supera el **Budget Limit**. |
| **Tarea Asignada**       | Creación o asignación.             | Mail al responsable.                                              |
| **Propuesta Confirmada** | Propuesta pasa a `Confirmed`.      | Se crea Event en Timeline + notificación al grupo.                |
| **Deadline de Encuesta** | Se cumple el deadline de votación. | Notificación recordatorio a quienes no votaron.                   |

---

## 7. Límites Técnicos

- **Máximo Participantes:** 20 usuarios por viaje.
- **Plataforma:** PWA Mobile-First + Web responsive para Desktop.
- **Offline:** No disponible para MVP.
- **Notificaciones (Mail Engine):** Firebase Extension "Trigger Email" (integrado vía SMTP con Resend o SendGrid). Envío estructurado generando un documento en una colección raíz `mail`. No aplica push notifications para el MVP.

---

## 8. Modelo de Datos (Firestore Schema)

### 8.1 Estructura General

Los datos se organizan usando **subcolecciones anidadas dentro de cada viaje**. Esto garantiza seguridad natural, queries eficientes y aislamiento de datos entre viajes.

> **Nota Arquitectónica (Sobre los IDs):**  
> Para todas las colecciones y subcolecciones listadas en esta sección, se asume implícitamente que cada documento posee una propiedad **`id` obligatoria** (tipo `string`) al nivel de la aplicación, que corresponde directamente al **Document ID** asignado por Firestore. Esta no se guarda como campo interno en la BD, sino que el cliente la extrae del metadato del Snapshot.

```text
/users/{userId}                          ← Colección raíz
/trips/{tripId}                          ← Colección raíz
  └── /participants/{participantId}      ← Subcolección
  └── /events/{eventId}                  ← Subcolección
  └── /proposals/{proposalId}            ← Subcolección
  └── /costs/{costId}                    ← Subcolección
  └── /inventory/{itemId}               ← Subcolección
  └── /tasks/{taskId}                    ← Subcolección
  └── /transport/{transportId}           ← Subcolección
```

### 8.2 Colección: `users`

Perfil básico sincronizado con Firebase Auth.

| Campo         | Tipo             | Requerido | Descripción                       |
| ------------- | ---------------- | --------- | --------------------------------- |
| `uid`         | `string`         | ✅        | Firebase Auth UID (= document ID) |
| `displayName` | `string`         | ✅        | Nombre visible                    |
| `email`       | `string`         | ✅        | Email del usuario                 |
| `photoURL`    | `string \| null` | ❌        | Avatar                            |
| `createdAt`   | `timestamp`      | ✅        | Fecha de registro                 |

### 8.3 Colección: `trips`

El contenedor raíz de cada viaje.

| Campo         | Tipo             | Requerido | Default      | Descripción                                |
| ------------- | ---------------- | --------- | ------------ | ------------------------------------------ |
| `name`        | `string`         | ✅        | —            | Nombre del viaje                           |
| `destination` | `string`         | ✅        | —            | Destino principal                          |
| `description` | `string \| null` | ❌        | `null`       | Descripción opcional                       |
| `startDate`   | `timestamp`      | ✅        | —            | Fecha de inicio                            |
| `endDate`     | `timestamp`      | ✅        | —            | Fecha de fin                               |
| `status`      | `string`         | ✅        | `'planning'` | `'planning'` \| `'active'` \| `'archived'` |
| `dailyBudget` | `number \| null` | ❌        | `null`       | Monto diario por persona                   |
| `currency`    | `string`         | ✅        | `'USD'`      | Moneda del viaje                           |
| `coverImage`  | `string \| null` | ❌        | `null`       | URL de imagen de portada                   |
| `createdBy`   | `string`         | ✅        | —            | UID del creador                            |
| `createdAt`   | `timestamp`      | ✅        | —            | Fecha de creación                          |
| `updatedAt`   | `timestamp`      | ✅        | —            | Última modificación                        |

### 8.4 Subcolección: `participants`

Membresía del viaje. El `participantId` (Document ID) equivale al UID del usuario.

| Campo               | Tipo             | Requerido | Default          | Descripción                                              |
| ------------------- | ---------------- | --------- | ---------------- | -------------------------------------------------------- |
| `role`              | `string`         | ✅        | `'collaborator'` | `'owner'` \| `'admin'` \| `'collaborator'` \| `'viewer'` |
| `budgetLimit`       | `number \| null` | ❌        | `null`           | Budget Limit personal                                    |
| `joinedAt`          | `timestamp`      | ✅        | —                | Fecha en que se unió                                     |
| `invitedBy`         | `string`         | ✅        | —                | UID de quien invitó                                      |
| `customPermissions` | `map`            | ❌        | `{}`             | Overrides (permiso -> boolean)                           |

### 8.5 Subcolección: `events`

Actividades del timeline vinculadas a un día específico.

| Campo              | Tipo                   | Requerido | Default   | Descripción                                                                 |
| ------------------ | ---------------------- | --------- | --------- | --------------------------------------------------------------------------- |
| `title`            | `string`               | ✅        | —         | Nombre del evento                                                           |
| `description`      | `string \| null`       | ❌        | `null`    | Detalles                                                                    |
| `date`             | `timestamp`            | ✅        | —         | Día del evento                                                              |
| `startTime`        | `timestamp \| null`    | ❌        | `null`    | Hora inicio (opcional)                                                      |
| `endTime`          | `timestamp \| null`    | ❌        | `null`    | Hora fin (opcional)                                                         |
| `location`         | `string \| null`       | ❌        | `null`    | Ubicación (texto)                                                           |
| `locationUrl`      | `string \| null`       | ❌        | `null`    | Google Maps o link                                                          |
| `category`         | `string`               | ✅        | `'other'` | `'accommodation'` \| `'transport'` \| `'food'` \| `'activity'` \| `'other'` |
| `costImpact`       | `number \| null`       | ❌        | `null`    | Costo estimado del evento                                                   |
| `rsvp`             | `map<userId, boolean>` | ✅        | `{}`      | Confirmaciones de asistencia                                                |
| `linkedProposalId` | `string \| null`       | ❌        | `null`    | Propuesta de origen                                                         |
| `createdBy`        | `string`               | ✅        | —         | UID del creador                                                             |
| `createdAt`        | `timestamp`            | ✅        | —         | Fecha de creación                                                           |

### 8.6 Subcolección: `proposals`

Ideas y encuestas del grupo.

| Campo           | Tipo                    | Requerido | Default   | Descripción                                                                      |
| --------------- | ----------------------- | --------- | --------- | -------------------------------------------------------------------------------- |
| `title`         | `string`                | ✅        | —         | Título de la propuesta                                                           |
| `description`   | `string \| null`        | ❌        | `null`    | Contexto                                                                         |
| `type`          | `string`                | ✅        | —         | `'accommodation'` \| `'transport'` \| `'inventory'` \| `'activity'` \| `'other'` |
| `status`        | `string`                | ✅        | `'draft'` | `'draft'` \| `'voted'` \| `'confirmed'` \| `'rejected'`                          |
| `location`      | `string \| null`        | ❌        | `null`    | Ubicación / Dirección                                                            |
| `locationUrl`   | `string \| null`        | ❌        | `null`    | Google Maps link                                                                 |
| `startDate`     | `timestamp \| null`     | ❌        | `null`    | Fecha/hora inicio                                                                |
| `endDate`       | `timestamp \| null`     | ❌        | `null`    | Fecha/hora fin                                                                   |
| `estimatedCost` | `number \| null`        | ❌        | `null`    | Impacto económico                                                                |
| `accessible`    | `boolean`               | ✅        | `false`   | Plan 100% accesible                                                              |
| `referenceUrl`  | `string \| null`        | ❌        | `null`    | Link externo                                                                     |
| `votes`         | `map<userId, string>`   | ✅        | `{}`      | **RSVP (V4)**: Almacena la etiqueta elegida ("sí", "no", "meh") por usuario.     |
| `options`       | `string[] \| null`      | ❌        | `null`    | Opciones personalizadas adicionales.                                             |
| `optionVotes`   | `map<string, string[]>` | ✅        | `{}`      | **Votos por Opción**: (Etiqueta de opción → array de userIds).                   |
| `deadline`      | `timestamp \| null`     | ❌        | `null`    | Deadline de votación                                                             |
| `linkedEventId` | `string \| null`        | ❌        | `null`    | Event creado al confirmar                                                        |
| `createdBy`     | `string`                | ✅        | —         | UID del creador                                                                  |
| `createdAt`     | `timestamp`             | ✅        | —         | Fecha de creación                                                                |

### 8.7 Subcolección: `costs`

Gastos fijos y proyectados (el presupuesto diario se define en el Trip).

| Campo           | Tipo             | Requerido | Default   | Descripción                                                                 |
| --------------- | ---------------- | --------- | --------- | --------------------------------------------------------------------------- |
| `description`   | `string`         | ✅        | —         | Descripción del gasto                                                       |
| `amount`        | `number`         | ✅        | —         | Monto                                                                       |
| `type`          | `string`         | ✅        | —         | `'fixed'` \| `'projected'`                                                  |
| `category`      | `string`         | ✅        | `'other'` | `'accommodation'` \| `'transport'` \| `'food'` \| `'activity'` \| `'other'` |
| `linkedEventId` | `string \| null` | ❌        | `null`    | Evento asociado                                                             |
| `createdBy`     | `string`         | ✅        | —         | UID del creador                                                             |
| `createdAt`     | `timestamp`      | ✅        | —         | Fecha de creación                                                           |

### 8.8 Subcolección: `inventory`

Ítems grupales compartidos.

| Campo          | Tipo             | Requerido | Default    | Descripción                                 |
| -------------- | ---------------- | --------- | ---------- | ------------------------------------------- |
| `name`         | `string`         | ✅        | —          | Nombre del ítem                             |
| `description`  | `string \| null` | ❌        | `null`     | Detalles                                    |
| `assignedTo`   | `string \| null` | ❌        | `null`     | UID del responsable                         |
| `status`       | `string`         | ✅        | `'needed'` | `'needed'` \| `'assigned'` \| `'confirmed'` |
| `linkedTaskId` | `string \| null` | ❌        | `null`     | Tarea auto-generada                         |
| `createdBy`    | `string`         | ✅        | —          | UID del creador                             |
| `createdAt`    | `timestamp`      | ✅        | —          | Fecha de creación                           |

### 8.9 Subcolección: `tasks`

Tareas del grupo con vínculos a eventos o inventario.

| Campo          | Tipo                | Requerido | Default     | Descripción                                |
| -------------- | ------------------- | --------- | ----------- | ------------------------------------------ |
| `title`        | `string`            | ✅        | —           | Nombre de la tarea                         |
| `description`  | `string \| null`    | ❌        | `null`      | Detalles                                   |
| `assignee`     | `string \| null`    | ❌        | `null`      | UID del responsable                        |
| `status`       | `string`            | ✅        | `'pending'` | `'pending'` \| `'in-progress'` \| `'done'` |
| `dueDate`      | `timestamp \| null` | ❌        | `null`      | Fecha límite                               |
| `linkedToType` | `string \| null`    | ❌        | `null`      | `'event'` \| `'inventory'`                 |
| `linkedToId`   | `string \| null`    | ❌        | `null`      | ID del evento o ítem                       |
| `createdBy`    | `string`            | ✅        | —           | UID del creador                            |
| `createdAt`    | `timestamp`         | ✅        | —           | Fecha de creación                          |

### 8.10 Subcolección: `transport`

Medios de transporte registrados para el viaje.

| Campo        | Tipo             | Requerido | Default | Descripción                                  |
| ------------ | ---------------- | --------- | ------- | -------------------------------------------- |
| `name`       | `string`         | ✅        | —       | Nombre (ej. "Auto Pedro")                    |
| `type`       | `string`         | ✅        | `'car'` | `'car'` \| `'bus'` \| `'plane'` \| `'other'` |
| `tripType`   | `string`         | ✅        | `'ida'` | `'ida'` \| `'vuelta'` \| `'interno'`         |
| `capacity`   | `number`         | ✅        | —       | Capacidad máxima de pasajeros                |
| `passengers` | `string[]`       | ✅        | `[]`    | UIDs de pasajeros asignados                  |
| `owner`      | `string \| null` | ❌        | `null`  | UID del dueño (si aplica)                    |
| `createdBy`  | `string`         | ✅        | —       | UID del creador                              |
| `createdAt`  | `timestamp`      | ✅        | —       | Fecha de creación                            |

---

## 9. Roles y Permisos (RBAC)

### 9.1 Modelo Híbrido de Permisos

Tripio utiliza un sistema de **Roles Base** con capacidad de **Overrides Granulares**. Esto permite asignar un perfil predefinido y, si es necesario, otorgar o quitar capacidades específicas a un participante puntual.

#### Roles Base

- **`owner` (Creador):** Control absoluto, irrevocable. Único con permiso para transferir propiedad o archivar el viaje.
  - **Permisos Base:** Todos los disponibles (`*`).
- **`admin` (Administrador):** Gestión total de contenido y personas. Puede elevar otros miembros y cerrar votaciones.
  - **Permisos Base:** `edit_itinerary`, `create_proposal`, `vote_proposal`, `manage_logistics`, `view_finances`, `manage_participants`.
- **`collaborator` (Colaborador - Default):** Participación activa: crea propuestas, vota, asigna transporte e ítems.
  - **Permisos Base:** `create_proposal`, `vote_proposal`, `manage_logistics`, `view_finances`.
- **`viewer` (Observador):** Solo lectura. Puede ver el itinerario, logística y presupuesto, pero no puede interactuar.
  - **Permisos Base:** `view_finances`.

#### Permisos Granulares (Flags)

Cualquier rol (excepto `owner`) puede ser modificado mediante los siguientes flags en `customPermissions`:

- `edit_itinerary`: Crear/Editar eventos confirmados.
- `create_proposal`: Publicar nuevas ideas o encuestas.
- `vote_proposal`: Participar en votaciones de ideas.
- `manage_logistics`: Crear transportes o cambiar asignaciones.
- `view_finances`: Acceder al desglose de costos grupales.
- `manage_participants`: Invitar o remover personas (reservado para Admin/Owner por defecto).

### 9.2 Matriz de Capacidades por Defecto

| Operación                              | Owner | Admin | Collaborator | Viewer |
| -------------------------------------- | :---: | :---: | :----------: | :----: |
| **Viaje & Configuración**              |       |       |              |        |
| Editar Info Viaje (Nombre, Fechas)     |  ✅   |  ✅   |      ❌      |   ❌   |
| Archivar / Eliminar Viaje              |  ✅   |  ❌   |      ❌      |   ❌   |
| Editar Presupuesto Propio              |  ✅   |  ✅   |      ✅      |   ✅   |
| **Participantes**                      |       |       |              |        |
| Invitar Participantes                  |  ✅   |  ✅   |      ❌      |   ❌   |
| Cambiar Roles / Overrides              |  ✅   |  ✅   |      ❌      |   ❌   |
| Remover Miembros                       |  ✅   |  ✅   |      ❌      |   ❌   |
| **Contenido & Itinerario**             |       |       |              |        |
| Crear/Editar Eventos Directos          |  ✅   |  ✅   |      ✅      |   ❌   |
| Crear Propuestas / Ideas               |  ✅   |  ✅   |      ✅      |   ❌   |
| Votar Propuestas                       |  ✅   |  ✅   |      ✅      |   ❌   |
| Confirmar Propuesta (Mover a Timeline) |  ✅   |  ✅   |      ❌      |   ❌   |
| **Economía & Logística**               |       |       |              |        |
| Ver Costos Grupales                    |  ✅   |  ✅   |      ✅      |   ✅   |
| Crear/Editar Gastos Fijos/Proyectados  |  ✅   |  ✅   |      ✅      |   ❌   |
| Añadir Alojamiento Directo             |  ✅   |  ✅   |      ❌      |   ❌   |
| Gestionar Transporte (Crear/Asignar)   |  ✅   |  ✅   |      ✅      |   ❌   |

### 9.3 Lógica de Resolución de Permisos

Un usuario puede realizar una acción si:

1. Su **Rol Base** tiene el permiso habilitado Y no hay un override en `false`.
2. O su **Rol Base** no lo tiene, pero existe un override en `true` para ese permiso específico.

> **Regla de Oro:** El `owner` siempre tiene todos los permisos en `true`. Los overrides de `owner` son ignorados.

---

## 10. Operaciones del Sistema

### 10.1 Módulo: Viaje

| Operación      | Input                    | Output                    | Quién        | Side Effects                        |
| -------------- | ------------------------ | ------------------------- | ------------ | ----------------------------------- |
| Crear viaje    | name, destination, dates | Trip + Participant(owner) | Usuario Auth | Creador se agrega como `owner`.     |
| Editar viaje   | tripId, campos editables | Trip actualizado          | Owner, Admin | `updatedAt` se actualiza.           |
| Archivar viaje | tripId                   | Trip(status='archived')   | Owner        | El viaje se vuelve de solo lectura. |

### 10.2 Módulo: Participantes

| Operación            | Input               | Output                    | Quién          | Side Effects                                         |
| -------------------- | ------------------- | ------------------------- | -------------- | ---------------------------------------------------- |
| Invitar (Magic Link) | tripId, email, role | URL `/invite/[token]`     | Admin          | Se genera JWT o token en DB con caducidad (72hs).    |
| Unirse al viaje      | `token` param       | Participant creado        | Usuario (Auth) | Si no auth, URL redirige a Login y conserva token.   |
| Remover participante | tripId, userId      | —                         | Admin          | Recálculo costos, desasignar tareas/ítems/transporte |
| Elevar a Admin       | tripId, userId      | Participant(role='admin') | Admin          | —                                                    |

### 10.3 Módulo: Timeline & Eventos

| Operación       | Input              | Output            | Quién         | Side Effects                                    |
| --------------- | ------------------ | ----------------- | ------------- | ----------------------------------------------- |
| Crear evento    | tripId, event data | Event creado      | Admin, Member | Aparece en Timeline                             |
| Editar evento   | eventId, campos    | Event actualizado | Admin, Member | —                                               |
| Eliminar evento | eventId            | —                 | Admin, Member | Tareas vinculadas se desvinculan (no se borran) |
| RSVP            | eventId, attending | RSVP actualizado  | Admin, Member | —                                               |

### 10.4 Módulo: Propuestas

| Operación                | Input                 | Output              | Quién         | Side Effects                           |
| ------------------------ | --------------------- | ------------------- | ------------- | -------------------------------------- |
| Crear propuesta/encuesta | tripId, proposal data | Proposal(draft)     | Admin, Member | —                                      |
| Votar                    | proposalId, vote      | Votes actualizados  | Admin, Member | Status cambia a `voted` en primer voto |
| Confirmar propuesta      | proposalId            | Proposal(confirmed) | Admin, Member | Se crea un Event en el Timeline        |
| Rechazar propuesta       | proposalId            | Proposal(rejected)  | Admin, Member | —                                      |

### 10.5 Módulo: Economía

| Operación        | Input                  | Output                  | Quién          | Side Effects                                                                            |
| ---------------- | ---------------------- | ----------------------- | -------------- | --------------------------------------------------------------------------------------- |
| Agregar costo    | tripId, cost data      | Cost creado             | Admin, Member  | Recálculo Total Cost vía Snapshot                                                       |
| Editar costo     | costId, campos         | Cost actualizado        | Admin, Member  | Recálculo Total Cost vía Snapshot                                                       |
| Eliminar costo   | costId                 | —                       | Admin, Member  | Recálculo Total Cost vía Snapshot                                                       |
| Set Daily Budget | tripId, amount         | Trip actualizado        | Admin          | Recálculo Total Cost vía Snapshot                                                       |
| Set Budget Limit | tripId, userId, amount | Participant actualizado | Propio usuario | Alerta mediante un **Observer** (ej: Zustand) global que confronta Total Cost vs Limit. |

### 10.6 Módulo: Logística

| Operación               | Input                  | Output                 | Quién         | Side Effects                        |
| ----------------------- | ---------------------- | ---------------------- | ------------- | ----------------------------------- |
| Agregar ítem inventario | tripId, item data      | Item(needed)           | Admin, Member | —                                   |
| Asignar ítem            | itemId, userId         | Item(assigned)         | Admin, Member | Auto-crea Task vinculada            |
| Desasignar ítem         | itemId                 | Item(needed)           | Admin, Member | Elimina Task vinculada              |
| Agregar transporte      | tripId, transport data | Transport creado       | Admin, Member | —                                   |
| Asignar pasajero        | transportId, userId    | Passengers actualizado | Admin, Member | **Error 409 si capacity alcanzada** |
| Desasignar pasajero     | transportId, userId    | Passengers actualizado | Admin, Member | —                                   |

---

## 11. Diagramas de Estado

### 11.1 Viaje (Trip)

```text
┌──────────┐   startDate    ┌──────────┐   endDate / Manual   ┌──────────┐
│ Planning │ ─────────────→ │  Active  │ ──────────────────→  │ Archived │
└──────────┘                └──────────┘                      └──────────┘
                                                                   │
                                                            (Solo lectura,
                                                             irreversible)
```

- `Planning → Active`: Automático al llegar `startDate`.
- `Active → Archived`: Automático al llegar `endDate`, o manualmente por Admin.
- `Archived`: Irreversible. El viaje queda como registro histórico.

### 11.2 Propuesta (Proposal)

```text
              primer voto
┌───────┐ ──────────────→ ┌────────┐
│ Draft │                 │ Voted  │
└───────┘                 └────────┘
                           │      │
                  confirmar│      │rechazar
                           ▼      ▼
                    ┌───────────┐ ┌──────────┐
                    │ Confirmed │ │ Rejected │
                    └───────────┘ └──────────┘
                         │
                   (Crea Event
                    en Timeline)
```

- `Draft → Voted`: Al recibir el primer voto o RSVP.
- `Voted → Confirmed`: Decisión manual de cualquier participante.
- `Voted → Rejected`: Decisión manual.
- `Confirmed`: Se genera un Event vinculado en el Timeline.

### 11.3 Tarea (Task)

```text
┌─────────┐         ┌─────────────┐         ┌──────┐
│ Pending │ ──────→ │ In-Progress │ ──────→ │ Done │
└─────────┘         └─────────────┘         └──────┘
     ▲                                         │
     └─────────────────────────────────────────┘
                    (Reapertura)
```

- Bidireccional: una tarea puede volver a `Pending` si se reabre.
- `Done`: Si está vinculada a un Ítem de inventario, el ítem pasa a `confirmed`.

### 11.4 Ítem de Inventario (Inventory)

```text
┌────────┐  asignar   ┌──────────┐  tarea done   ┌───────────┐
│ Needed │ ─────────→ │ Assigned │ ────────────→ │ Confirmed │
└────────┘            └──────────┘               └───────────┘
     ▲                     │
     └─────────────────────┘
         (Desasignar)
```

- `Needed → Assigned`: Cuando se asigna un responsable (auto-crea Task).
- `Assigned → Confirmed`: Cuando la Task vinculada se marca `Done`.
- `Assigned → Needed`: Si se desasigna al responsable.

---

## 12. Reglas de Seguridad Firestore

### 12.1 Principios

1. **Todo usuario autenticado** puede leer/escribir su propio documento en `/users`.
2. **Solo participantes del viaje** pueden leer cualquier dato del viaje y sus subcolecciones.
3. **Solo Admins** pueden modificar datos del Trip (nombre, fechas, status) e invitar/remover.
4. **Admins y Members** pueden escribir en subcolecciones de contenido (events, costs, proposals, inventory, tasks, transport).
5. **Viajes archivados** son inmutables (solo lectura en todas las subcolecciones).

### 12.2 Pseudocódigo de Reglas

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // --- Users ---
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }

    // --- Trips ---
    match /trips/{tripId} {
      // Helper: ¿Es participante?
      function isParticipant() {
        return exists(/databases/$(database)/documents/trips/$(tripId)/participants/$(request.auth.uid));
      }
      // Helper: ¿Es admin?
      function isAdmin() {
        return get(/databases/$(database)/documents/trips/$(tripId)/participants/$(request.auth.uid)).data.role == 'admin';
      }
      // Helper: ¿Está archivado?
      function isArchived() {
        return resource.data.status == 'archived';
      }

      allow read: if isParticipant();
      allow create: if request.auth != null;
      allow update: if isAdmin() && !isArchived();
      allow delete: if false; // Los viajes no se eliminan, se archivan

      // --- Participants ---
      match /participants/{participantId} {
        allow read: if isParticipant();
        allow create: if isAdmin();
        allow update: if isAdmin() && !isArchived();
        allow delete: if isAdmin() && !isArchived();
      }

      // --- Content Subcollections (events, costs, proposals, inventory, tasks, transport) ---
      match /{subcollection}/{docId} {
        allow read: if isParticipant();
        allow create: if isParticipant() && !isArchived();
        allow update: if isParticipant() && !isArchived();
        allow delete: if isParticipant() && !isArchived();
      }
    }
  }
}
```

---

## 13. Edge Cases y Manejo de Errores

| Escenario                                  | Comportamiento                                                                               |
| ------------------------------------------ | -------------------------------------------------------------------------------------------- |
| **Admin creador intenta abandonar**        | ❌ No permitido. Debe archivar el viaje.                                                     |
| **Último Admin elevado abandona**          | ✅ Permitido. El creador siempre permanece como Admin.                                       |
| **Evento eliminado con tareas vinculadas** | Las tareas se preservan y se desvinculan (`linkedToId` = `null`).                            |
| **Participante removido**                  | Recálculo automático de Total Cost. Desasignación de tareas, ítems y asientos de transporte. |
| **Budget Limit excedido**                  | Notificación de alta visibilidad (banner + mail). No se bloquea la carga de costos.          |
| **Transporte sobre-asignado**              | Error 409. La operación no se ejecuta si `passengers.length >= capacity`.                    |
| **Escritura en viaje archivado**           | Error 403. Firestore Rules impiden cualquier mutación en viajes `archived`.                  |
| **Propuesta confirmada dos veces**         | No-op. Si `status = confirmed`, la operación se ignora.                                      |
| **Voto después de deadline**               | Error 400. No se registran votos si `now > deadline`.                                        |

---

## 14. Reglas Canónicas (Single Source of Truth)

1. **Centralización Temporal:** Todo elemento (Tarea, Gasto, Ítem) debe poder vincularse a un punto en el tiempo (Día/Evento) o al contenedor general del viaje.
2. **Jerarquía Presupuestaria:** El **Total Cost** se calcula como `Fijos/n + Proyectados/n + (Diarios * días)`.
3. **No-Goal (Gastos Diarios):** Prohibida la carga de gastos hormiga/tickets. Se asumen cubiertos por el "Presupuesto Diario".
4. **Validación de Capacidad:** El transporte no puede ser sobre-asignado (Error 409).
5. **Prioridad de Alerta:** El exceso de `Budget Limit` es una notificación crítica de alta visibilidad.
6. **Interactividad de Tareas:** Una tarea marcada como "Done" en el Módulo de Tareas debe actualizar automáticamente el status del Ítem o Evento vinculado.
7. **Inmutabilidad de Archivo:** Un viaje archivado es de solo lectura. Ningún participante puede modificar datos.
8. **Propuestas como único canal de decisión:** Toda idea o encuesta debe pasar por el módulo de Propuestas. No existen módulos separados de votación.

---

## 15. Decisiones Técnicas Decididas

- **Database:** Firebase Firestore (NoSQL, subcolecciones por viaje).
- **Auth:** Firebase Auth (SSO Google + Email/Password).
- **UI:** Tailwind CSS v4.
- **PWA:** PWA Mobile-First con soporte responsive Desktop.
- **State Management:** Zustand (UI) + TanStack Query (server state).
- **Data Architecture:** Subcolecciones dentro de cada Trip como unidad atómica.

---

## 16. Glosario de Definiciones

- **Viaje (Travel Container):** La entidad raíz que agrupa todo el ecosistema. Creación flexible (fechas y presupuestos opcionales).
- **Dashboard (Home):** Vista gerencial que resume la situación financiera, próximos pasos y alertas (ideas por votar).
- **Módulo de Ideas / Propuestas:** Espacio asíncrono para brainstorming y toma de decisiones grupales (encuestas, propuestas de alojamiento y actividades).
- **Logística:** Hub de decisiones confirmadas sobre dónde quedarse (alojamientos) y cómo moverse (transportes con auto-asignación).
- **Timeline:** Narrativa estrictamente delimitada a las fechas del viaje que muestra visualmente los eventos confirmados y tareas logradas (tachadas).
- **Economía Temporal:** Integración del presupuesto con la línea de tiempo.
- **Total Cost:** Costo estimado final para un usuario: `Fijos/n + Proyectados/n + (Diarios * días)`.
- **Daily Budget:** Monto diario fijo escalable por la duración del viaje (opcional).
- **Budget Limit:** Monto máximo auto-impuesto por cada usuario individual (opcional y editable personalmente).
- **RSVP/Votación:** Mecánica para confirmar interés y pasar una propuesta a estado "Confirmado" (Logística/Timeline).
- **Vista Dual:** Capacidad de alternar entre una grilla de Calendario y una lista de Timeline.
- **Ítem Grupal:** Recurso compartido que puede disparar Tareas de transporte/compra.
- **Magic Link:** URL dinámica para invitar participantes a un viaje.
- **Admin (Creator):** Rol permanente e irrevocable del creador del viaje. Posee permisos exclusivos como la adición directa de Alojamientos.
- **Admin (Elevated):** Rol Admin otorgado a un miembro existente por un Admin.
