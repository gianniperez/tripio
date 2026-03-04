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

#### Dashboard "Overview" (Resumen Ejecutivo)

Tanto en estado `Planning` como `Active`, el Dashboard principal ofrece un resumen de alto nivel:

- **Nombre y Fecha:** Identificación clara del viaje y cuenta regresiva.
- **Alojamiento:** Indicador de estado (ej: "2/3 noches definidas" o "Pendiente").
- **Budget Hub:** Visualización del gasto total vs. Budget Limit.
- **Próxima Acción:** Acceso directo a la actividad inmediata o tarea crítica.

#### Vista Timeline Secuencial (Narrativo)

- **Estética:** Línea vertical con conectores visuales que narran el flujo del viaje.
- **Tarjetas Dinámicas:** Actividades (con RSVP), Tareas (con responsable), y Logística (Check-in/out).
- **Interacción:** Scroll fluido para ver el pasado y futuro del itinerario.

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

### 2.4 Logística Integrada (Transporte e Inventario)

#### Medios de Transporte

En lugar de gestionar activos físicos complejos, el sistema registra:

- **Medio:** (Auto Pedro, Avión, Micro).
- **Capacidad:** Cuántos entran.
- **Pasajeros:** Quién viaja con quién para rastrear al grupo.

#### Inventario Grupal (Shared Items)

Repositorio de ítems necesarios (Carpa, Parlante).

- **Opcionalidad:** Siempre debe estar la opción de indicar quién lo lleva, pero no es obligatorio para el MVP que todos los ítems tengan dueño.
- **Vínculo con Tareas:** Si se asigna un responsable a un ítem, automáticamente se genera una **Tarea** asociada.

### 2.5 Sistema de Tareas Inteligentes

Las tareas son el motor de acción del grupo.

- **Vínculo con Calendario:** Una tarea puede nacer de un evento (ej. "Comprar carbón" para el evento "Parrillada").
- **Vínculo con Inventario:** Una tarea puede nacer de un ítem (ej. "Conseguir Carpa").
- **Visualización:** Aparecen en el Módulo de Tareas y también dentro del detalle del Evento o Ítem relacionado.

### 2.6 Módulo de Propuestas (Ideas + Encuestas Unificadas)

Espacio para la co-creación del viaje antes de formalizar el timeline. Este módulo unifica dos mecánicas:

- **Propuesta Rica:** Idea completa con ubicación, costo, fecha, link de referencia.
- **Encuesta Simple (Poll):** Pregunta con opciones y deadline opcional (ej. "¿Bariloche o Mendoza?").

#### Formulario de Propuesta

- **Tipo:** Alojamiento, Transporte, Comida, Actividad, Encuesta, Otros.
- **Título y Descripción:** Contexto de la idea.
- **Ubicación:** Google Maps Link o texto (opcional para Encuestas).
- **Temporalidad:** Fecha/Hora inicio y fin (opcionales).
- **Impacto Económico:** Costo estimado (opcional para Encuestas).
- **Accesibilidad:** Switch para indicar si el plan es 100% accesible.
- **Link de Referencia:** Web, PDF o reserva.
- **Opciones (solo Encuesta):** Lista de alternativas votables.
- **Deadline (opcional):** Fecha límite para votar.

#### Ciclo de Vida de la Propuesta

1. **`Draft`:** Solo texto e idea base.
2. **`Voted`:** Interacción grupal activa (RSVP para propuestas ricas, votación para encuestas).
3. **`Confirmed`:** Se convierte en un hito del Timeline (crea un Event).
4. **`Rejected`:** Descartada por el grupo.

---

## 3. Arquitectura y UX/UI

### 3.1 Navegación y Jerarquía (PWA Focus)

```text
Login (Firebase Auth) -> Mis Viajes
│
└── Viaje Dashboard [ID] (Sticky Bottom NavBar)
    ├── 🏠 Home (Resumen Ejecutivo, Próximos Pasos, Budget Glance)
    ├── 🗺️ Timeline (Flujo secuencial narrativo + Vista Calendario Dual)
    ├── 💡 Propuestas (Pool de ideas categorizadas + Encuestas)
    │   └── ➕ Acción: FAB (Floating Action Button) de "Proponer Idea"
    └── ✅ Decidido (Logística confirmada: Alojamiento, Transporte, Ítems)
```

_Nota: La gestión detallada de Economía y Logística se integra dentro de 'Home' (Resumen) y 'Decidido' (Detalles confirmados)._

#### Comportamiento Global de la UI Móvil (Header y Bottom NavBar)

- **Header:** El Header (con el Nombre del viaje y contexto) permanece fijo (Sticky) en la parte superior en todo momento.
- **Bottom NavBar:** Por temas de inmersión y aprovechar la pantalla vertical para el Timeline o el Calendario, la barra de navegación inferior deberá ocultarse gradualmente al hacer **Scroll hacia abajo (scroll down)** y reaparecer instantáneamente al hacer **Scroll hacia arriba (scroll up)** o llegar al final de la página.

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

### 4.2 Sistema de Diseño (Design Tokens)

Las variables globales de diseño (Tokens) se definirán en la configuración de Tailwind CSS (`globals.css` / `tailwind config`) para asegurar la consistencia.

#### 1. Tipografía (Fonts)

- **Primary Font (Headings & UI):** Nunito (San-serif redondeada, amigable y con mucha personalidad para títulos y botones).
- **Secondary Font (Body/Lectura):** Inter (Diseñada específicamente para pantallas, máxima legibilidad y neutralidad para lectura densa).

#### 2. Paleta de Colores (Theme)

Tripio debe transmitir emoción por viajar, organización y calma.

- **Primary (Brand):** Tono vibrantes: Naranja (`#F46A1F`), Turquesa (`#1A8C8C`), Azul oscuro (`#075056`).
- **Secondary (Accents):** Colores complementarios para destacar estados (ej: verde para "Decidido", rojo para "Alertas de Budget").
- **Backgrounds (Surface):** Fondo limpio (`#FFFAF5`) para evitar fatiga visual ante tanto contenido.
- **Text & Borders:** Escala de grises semánticos (`slate` o `gray` de Tailwind) y/o azules oscuros (`#001523`).

#### 3. Forma y Profundidad (Borders & Shadows)

- **Border Radius:** `Rounded-2xl` o `Rounded-xl` exagerados (16px a 24px) para dar una sensación "App-like" amigable, similar a iOS.
- **Elevación (Shadows):** Sombras difusas y suaves (`shadow-lg`, `shadow-soft`) para módulos flotantes (como el Bottom NavBar y las alertas).
- **Bordes:** Finos (`1px solid`) para dividir secciones en lugar de usar fondos oscuros.

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

| Campo         | Tipo             | Requerido | Default    | Descripción             |
| ------------- | ---------------- | --------- | ---------- | ----------------------- |
| `role`        | `string`         | ✅        | `'member'` | `'admin'` \| `'member'` |
| `budgetLimit` | `number \| null` | ❌        | `null`     | Budget Limit personal   |
| `joinedAt`    | `timestamp`      | ✅        | —          | Fecha en que se unió    |
| `invitedBy`   | `string`         | ✅        | —          | UID de quien invitó     |

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

| Campo           | Tipo                            | Requerido | Default   | Descripción                                                                             |
| --------------- | ------------------------------- | --------- | --------- | --------------------------------------------------------------------------------------- |
| `title`         | `string`                        | ✅        | —         | Título de la propuesta                                                                  |
| `description`   | `string \| null`                | ❌        | `null`    | Contexto                                                                                |
| `type`          | `string`                        | ✅        | —         | `'accommodation'` \| `'transport'` \| `'food'` \| `'activity'` \| `'poll'` \| `'other'` |
| `status`        | `string`                        | ✅        | `'draft'` | `'draft'` \| `'voted'` \| `'confirmed'` \| `'rejected'`                                 |
| `location`      | `string \| null`                | ❌        | `null`    | Ubicación                                                                               |
| `locationUrl`   | `string \| null`                | ❌        | `null`    | Google Maps link                                                                        |
| `startDate`     | `timestamp \| null`             | ❌        | `null`    | Fecha/hora inicio                                                                       |
| `endDate`       | `timestamp \| null`             | ❌        | `null`    | Fecha/hora fin                                                                          |
| `estimatedCost` | `number \| null`                | ❌        | `null`    | Impacto económico                                                                       |
| `accessible`    | `boolean`                       | ✅        | `false`   | Plan 100% accesible                                                                     |
| `referenceUrl`  | `string \| null`                | ❌        | `null`    | Link externo                                                                            |
| `votes`         | `map<userId, boolean>`          | ✅        | `{}`      | Interés/RSVP (propuestas ricas)                                                         |
| `options`       | `string[] \| null`              | ❌        | `null`    | Opciones (solo tipo `poll`)                                                             |
| `optionVotes`   | `map<string, string[]> \| null` | ❌        | `null`    | Votos por opción (índice → userIds)                                                     |
| `deadline`      | `timestamp \| null`             | ❌        | `null`    | Deadline de votación                                                                    |
| `linkedEventId` | `string \| null`                | ❌        | `null`    | Event creado al confirmar                                                               |
| `createdBy`     | `string`                        | ✅        | —         | UID del creador                                                                         |
| `createdAt`     | `timestamp`                     | ✅        | —         | Fecha de creación                                                                       |

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
| `capacity`   | `number`         | ✅        | —       | Capacidad máxima de pasajeros                |
| `passengers` | `string[]`       | ✅        | `[]`    | UIDs de pasajeros asignados                  |
| `owner`      | `string \| null` | ❌        | `null`  | UID del dueño (si aplica)                    |
| `createdBy`  | `string`         | ✅        | —       | UID del creador                              |
| `createdAt`  | `timestamp`      | ✅        | —       | Fecha de creación                            |

---

## 9. Roles y Permisos (RBAC)

### 9.1 Definición de Roles

- **Admin:** Creador del viaje o miembro elevado. Puede haber múltiples Admins por viaje. El creador es Admin permanente e irrevocable. Un Admin puede invitar nuevos miembros directamente con rol Admin.
- **Member:** Participante estándar con permisos de colaboración completa sobre el contenido del viaje.

### 9.2 Matriz de Permisos

| Operación                                   | Admin                       | Member                     |
| ------------------------------------------- | --------------------------- | -------------------------- |
| **Viaje**                                   |                             |                            |
| Crear viaje                                 | ✅ (se convierte en Admin)  | ✅ (se convierte en Admin) |
| Editar viaje (nombre, fechas, destino)      | ✅                          | ❌                         |
| Archivar viaje                              | ✅                          | ❌                         |
| Abandonar viaje                             | ❌ (creador) / ✅ (elevado) | ✅                         |
| **Participantes**                           |                             |                            |
| Invitar participantes                       | ✅                          | ❌                         |
| Remover participantes                       | ✅                          | ❌                         |
| Elevar miembro a Admin                      | ✅                          | ❌                         |
| **Contenido (Eventos, Costos, Propuestas)** |                             |                            |
| Crear / Editar / Eliminar eventos           | ✅                          | ✅                         |
| Crear / Editar / Eliminar costos            | ✅                          | ✅                         |
| Crear propuestas y encuestas                | ✅                          | ✅                         |
| Votar / RSVP                                | ✅                          | ✅                         |
| Confirmar / Rechazar propuesta              | ✅                          | ✅                         |
| **Logística**                               |                             |                            |
| Agregar / Editar ítems de inventario        | ✅                          | ✅                         |
| Asignarse a un ítem                         | ✅                          | ✅                         |
| Crear / Editar / Completar tareas           | ✅                          | ✅                         |
| Agregar / Editar transporte                 | ✅                          | ✅                         |
| Asignar pasajeros a transporte              | ✅                          | ✅                         |

### 9.3 Reglas Especiales

1. El **creador del viaje** no puede abandonar el viaje. Debe archivarlo.
2. Un Admin **elevado** (no creador) sí puede abandonar el viaje.
3. Un Admin no puede removerse a sí mismo si es el único Admin.
4. No existe degradación de Admin → Member para el MVP.

---

## 10. Operaciones del Sistema

### 10.1 Módulo: Viaje

| Operación      | Input                    | Output                    | Quién                  | Side Effects                 |
| -------------- | ------------------------ | ------------------------- | ---------------------- | ---------------------------- |
| Crear viaje    | name, destination, dates | Trip + Participant(admin) | Cualquier usuario auth | Creador se agrega como Admin |
| Editar viaje   | tripId, campos editables | Trip actualizado          | Admin                  | `updatedAt` se actualiza     |
| Archivar viaje | tripId                   | Trip(status='archived')   | Admin                  | Todo queda read-only         |

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

```
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

- **Viaje (Travel Container):** La entidad raíz que agrupa todo el ecosistema.
- **Economía Temporal (Temporal Economy):** Integración del presupuesto con la línea de tiempo.
- **Total Cost:** Costo estimado final para un usuario: `Fijos/n + Proyectados/n + (Diarios * días)`.
- **Daily Budget:** Monto diario fijo escalable por la duración del viaje.
- **Budget Limit:** Monto máximo auto-impuesto por cada usuario individual.
- **RSVP:** Confirmación binaria de asistencia a una actividad o propuesta.
- **Vista Dual:** Capacidad de alternar entre una grilla de Calendario y una lista de Timeline.
- **Ítem Grupal:** Recurso compartido que puede disparar Tareas de transporte/compra.
- **Propuesta Rica:** Idea completa con ubicación, costo, fecha y link de referencia.
- **Encuesta (Poll):** Propuesta simplificada con opciones votables y deadline opcional.
- **Magic Link:** URL dinámica para invitar participantes a un viaje.
- **Admin (Creator):** Rol permanente e irrevocable del creador del viaje.
- **Admin (Elevated):** Rol Admin otorgado a un miembro existente por un Admin.
