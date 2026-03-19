# Documento de Requerimientos del Sistema (DRS) - Proyecto Tripio

> **Versión:** 4
> **Estado:** Draft  
> **Última actualización:** 17 de Marzo, 2026  
> **Basado en:** Lineamientos de Antigravity DRS

---

## 1. Resumen Ejecutivo

Este documento sintetiza el plan para **Tripio**, un organizador integral de viajes grupales. El producto es un **contenedor de viajes colaborativos**, donde cada experiencia funciona como un ecosistema autónomo con su propio destino, timeline, gestión económica y logística.

**Puntos Clave del MVP (Scope):**

- **PWA (Mobile First):** Diseño optimizado para móvil, con soporte responsive para Desktop vía navegador.
- **Autenticación:** Firebase Auth (Google y Email).
- **Base de Datos:** Firebase Firestore (subcolecciones por viaje).
- **Gestión Económica:** Manejo de gastos, presupuestos y deudas (personales y grupales).
- **Logística:** Gestión de Medios de Transporte, Alojamientos, Actividades e ítems de Inventario.
- **Decision Hub (Centralizado):** Todas las decisiones, votaciones y propuestas se unifican en un centro de control dedicado (`/proposals`), manteniendo los módulos de Actividades y Logística limpios y enfocados en el plan confirmado.

---

## 2. Definición Detallada de Componentes

### 2.1 El Viaje como Contenedor Autónomo (Core)

El viaje es el núcleo del ecosistema. Almacena la historia completa, preservando el contexto para el futuro.

**Ciclo de Vida:**

1. **`Planning` (Planificación Activa):** Estado inicial de alta mutabilidad.
2. **`Active` (Viaje en Curso):** Se activa automáticamente en la `startDate`. La UI prioriza la información del día.
3. **`Archived` (Cierre/Archivo):** La UI muestra un resumen del viaje.

#### Dashboard "Overview" (Resumen Ejecutivo / Home)

Tanto en estado `Planning` como `Active`, el Dashboard principal ofrece un resumen de alto nivel y actúa como centro gerencial del viaje:

- **Nombre y Fechas:** Identificación clara del viaje. Al crear el viaje, las fechas no son obligatorias, pero al fijarse organizan el Timeline.
- **Centro de Decisiones:** Muestra un resumen de las propuestas en estado "Pendiente" de todos los módulos.
- **Logística:** Muestra un resumen de los alojamientos y transportes con un indicador de estado.
- **Finanzas:** Visualización del gasto total vs. Budget Limit personal, además del presupuesto sugerido por día. El presupuesto diario y el límite total no son obligatorios al crear el viaje.
- **Próximas Actividades:** Extracto directo del Timeline con los eventos más inmediatos.

### 2.2 Actividades

- **TabBar:** Vista Timeline y Vista Calendario para actividades confirmadas.
- **Backlog:** Sección visual para **Actividades Confirmadas SIN Fecha**, que esperan ser ubicadas en el Timeline.

#### Vista Timeline Secuencial (Narrativo)

- **Enfoque en Fechas del Viaje:** El timeline abarca estrictamente el rango de fechas definidas para el viaje (`startDate` a `endDate`), adaptando su vista a esa ventana temporal real de forma dinámica.
- **Contenido Confirmado:** Solo muestra eventos y actividades que hayan sido formalmente **confirmados** y en los que esté el usuario. También muestra fechas de check in y check out de alojamientos y fechas de inicio y de fin de viajes en transportes.
- **Vista Visual de Progreso:** Los elementos que ya pasaron o se completaron aparecen con opacidad reducida.
- **Estética:** Línea vertical con conectores visuales que narran el flujo del viaje.
- **Tarjetas Dinámicas:** Actividades y Logística (Check-in/out, Fechas de viajes en transportes).

#### Vista Calendario Clásico (Grid)

- **Elementos:** Cuadrícula mensual.
- **Identificadores Rápidos:** Iconos sobre cada día indicando volumen de planes y presupuesto.
- **Acceso Directo:** Click en un día abre el modal de "Detalle del Día".
- **Contenido Confirmado:** Solo muestra eventos y actividades que hayan sido formalmente **confirmados** y en los que esté el usuario. También muestra fechas de check in y check out de alojamientos y fechas de inicio y de fin de viajes en transportes.

### 2.3 Logística (Alojamientos, Transporte e Inventario)

- **TabBar:** Vista Alojamientos, Transportes, Inventario.

#### Alojamientos

- Definición de lugares donde pernoctar, requiriendo **Fecha de Inicio** y **Fecha de Fin**.
- Los alojamientos no se pisan, sino que se complementan (ej. 5 días en Logia A, 5 días en Logia B).
- **Entrada Directa:** Solo los **Admins** pueden crear una entrada directa de alojamiento. Los Members deben proponerlo primero.

#### Medios de Transporte

En lugar de gestionar activos físicos complejos, el sistema registra:

- **Medio:** (Auto Pedro, Avión, Micro).
- **Capacidad y Auto-Asignación:** Los usuarios deben poder **asignarse a sí mismos** a un transporte libre (ej: "Sumarme a este Auto") hasta llenar la capacidad.

#### Inventario Grupal (Shared Items)

Repositorio de ítems necesarios (Carpa, Parlante).

- **Opcionalidad:** Siempre debe estar la opción de indicar quién lo lleva, pero no es obligatorio que todos los ítems tengan dueño.

### 2.4 Gestión Económica - Finanzas (Total Cost)

Previsión y registro financiero con soporte para gastos compartidos complejos:

- **TabBar:** Hay una TabBar que permite cambiar entre "Gastos" y "Totales". En Gastos, se muestran el budget limit del usario y los gastos. En Totales, se muestra el gasto total del grupo y el gasto total del usuario, indicado en moneda y en porcentaje.

- **Budget Limit:** Se muestra una barra de progreso que indica el porcentaje del presupuesto personal que se ha gastado hasta el momento vs el presupuesto limite ingresado por el usuario. En esta card se muestran los números y porcentajes del presupuesto limite ingresado por el usuario y el total gastado hasta el momento. Más abajo, también se muestra el presupuesto diario sugerido. Esta card tiene un cta de edición, en donde el usuario puede modifcar su presupuesto limite ingresado.

- **Presupuesto Diario:** El cálculo es: (presupuesto limite ingresado por el usuario - gastos realizados hasta el momento) / cantidad de días restantes del viaje.

- **Gastos Compartidos (Split):** Gastos vinculados a múltiples participantes.
  - **Split Variable:** Se permite cargar montos específicos por persona dentro de un mismo gasto.
  - **Simplificación (Splitwise style):** Opción para consolidar deudas y reducir transacciones entre participantes.

- **Vínculo con Entidades:** Los gastos pueden asociarse a Actividades, Alojamientos, Transportes o Ítems.

**Cálculo del Total Cost Personal:**
`Suma(participacion_en_gastos_compartidos)`

#### Mapeo de Campos Condicionales por Tipo

Cada módulo tiene su propio formulario de propuesta, que se adapta a su tipo.

#### Estados de la Propuesta

No necesariamente tiene que pasar por todos los estados.

1. **`Pending`:** Interacción grupal activa (RSVP y/o Votación de opciones).
2. **`Confirmed`:** Se convierte en un hito oficial (Timeline / Logística).
3. **`Rejected`:** Descartada por el grupo.

---

## 3. Arquitectura y UX/UI

### 3.1 Navegación y Jerarquía (PWA Focus)

```text
Login (Firebase Auth) -> Mis Viajes (/trips)
│
└── Viaje [ID] (Sticky Bottom NavBar — 4 botones)
    ├── 🏠 Inicio (Dashboard)
    ├── 💡 Actividades (Timeline/Calendario)
    ├── ✅ Logística (Alojamiento, Transporte, Inventario)
    └── 💰 Finanzas (Gastos/Totales)
```

#### Vista: 🏠 Inicio (Dashboard)

El Home actúa como el centro de control del viaje. Contiene:

- **Resumen del Viaje:** Nombre y rango de fechas.
- **Dashboard Cards:** Conteo de Alojamientos, Vehículos e Ideas Pendientes (clickeables para navegar a la vista correspondiente).
- **Presupuesto:** Gasto acumulado vs. límite personal, con la moneda del viaje.
- **Botón ⚙️ Editar Viaje:** Abre un modal para editar nombre, fechas, moneda, presupuesto y eliminar el viaje.

#### Vista: 🗳️ Propuestas (Decision Hub)

Centro de toma de decisiones del viaje.

- **Concepto:** Actúa como la "Bandeja de Entrada" de ideas grupales.
- **Elementos:** Carrousel o lista de tarjetas de propuestas (Actividades, Alojamientos, etc.) en estado "Pending".
- **Interacción:** Aquí los usuarios votan o hacen RSVP. Los Admins pueden "Confirmar" una idea para moverla al itinerario.

#### Vista: 💡 Actividades (Timeline/Calendario)

El Itinerario real. Solo contiene información confirmada.

- **Toggle Pill:** Alterna entre Timeline (Lista ordenada) y Calendario (Grilla).
- **Backlog Integrado:** Área (panel o bandeja) para alojar "Actividades Confirmadas pero Sin Fecha".
- **FAB:** Permite "Sugerir Nueva Actividad" (la idea viaja al Hub) o "Añadir Directo" (si se es Admin).

#### Vista: ✅ Logística

Repositorio de áreas operativas (solo información confirmada).

- **Sección Alojamientos:**
  - Lista de alojamientos confirmados y reservados.
- **Sección Transportes:**
  - Lista de vehículos oficiales. Cada usuario puede sumar pasajeros si hay capacidad disponible.
- **Sección Inventario:**
  - Checklist de ítems necesarios. Los usuarios pueden auto-asignarse para ser responsables de llevarlos o comprarlos.

#### Vista: 💰 Finanzas (Gastos/Totales)

- **Sección Gastos:**
- **FAB (Floating Action Button):** El botón "+" para agregar un gasto, vive fijado en la esquina inferior derecha.
- **BudgetLimit:** Muestra el límite personal del usuario y el gasto acumulado, sumado con el presupuesto diario sugerido.
- **ListExpenseCard:** Una lista de todos los gastos agregados hasta el momento, cada una abre un modal con los detalles del gasto y los participantes asociados.
- **DebtCTA:** Un botón que permite al usuario liquidar sus deudas y créditos con los demás participantes.

- **Sección Totales:** Muestra el gasto total del grupo y el gasto total del usuario, indicado en moneda y en porcentaje.

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

- **Estructura FSD (Feature-Sliced Design):**
  - `src/app/`: Exclusivamente Rutas, Páginas (Next.js App Router) y Layouts.
  - `src/components/`: **Solo** UI genérica, agnóstica al negocio (Botones, Modales Base, Inputs).
  - `src/features/`: **El corazón del dominio**. Aquí viven funciones complejas aisladas (ej: `auth`, `viajes`, `propuestas`). Cada feature tiene sus propios `components/`, `types/`, `stores/` y `api/`.
  - `src/providers/`: Contextos globales (Zustand, TanStack Query, Tema).
  - `src/utils/` y `src/hooks/`: Lógica compartida, global y pura.
- **Generación Automatizada (Plop.js):** Está **estrictamente prohibido** crear componentes o features a mano. Toda nueva pieza de UI debe inicializarse usando `npm run generate` / `npx plop` para garantizar la estructura base (Component, Types e Index de exportación).
- **Exportaciones de Barril (Barrel Files):** Las importaciones a una feature o componente interno siempre deben realizarse apuntando a su puerta principal (el `index.ts`), nunca buceando profundamente en archivos anidados.
- **Manejo de Estado (Boundaries):**
  - **TanStack Query:** Único responsable de la interacción con Firebase Firestore (Server State, Caching, Mutations).
  - **Zustand:** Único responsable del estado efímero de la UI (Client State) como "menús abiertos", "modo oscuro", e interconexión de componentes hermanos.
- **Calidad Asistida (Husky & Lint-staged):** El código debe pasar por Prettier, ESLint y Vitest (si aplica) antes de cada commit. Errores de tipado bloquearán el push.

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
- **Fase 2:** Economía (Gastos compartidos + Split Variable + Límite de Presupuesto + Notificaciones Mail).
- **Fase 3:** Propuestas Distribuidas, Logística e Inventario.

---

## 6. Notificaciones e Interacciones

| Trigger                  | Condición                          | Acción                                                            |
| :----------------------- | :--------------------------------- | :---------------------------------------------------------------- |
| **Nuevo Participante**   | Unión vía link.                    | Mail al Admin / Toast en App.                                     |
| **Gasto/Update**         | Cambio en gastos.                  | Recálculo de "Total Cost" y alerta si supera el **Budget Limit**. |
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
  └── /costs/{costId}                    ← Subcolección (Finanzas)
  └── /activities_proposals/{id}         ← Propuestas de actividades
  └── /activities_confirmed/{id}         ← Actividades confirmadas (Timeline)
  └── /accommodation_proposals/{id}      ← Propuestas de alojamiento
  └── /accommodation_confirmed/{id}      ← Alojamientos confirmados
  └── /transport_proposals/{id}          ← Propuestas de transporte
  └── /transport_confirmed/{id}          ← Transportes confirmados
  └── /inventory_proposals/{id}          ← Propuestas de inventario
  └── /inventory_confirmed/{id}          ← Items confirmados
  └── /tasks/{taskId}                    ← Subcolección
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
| `costImpact`       | `number \| null`       | ❌        | `null`    | gasto estimado del evento                                                   |
| `rsvp`             | `map<userId, boolean>` | ✅        | `{}`      | Confirmaciones de asistencia                                                |
| `linkedProposalId` | `string \| null`       | ❌        | `null`    | Propuesta de origen                                                         |
| `createdBy`        | `string`               | ✅        | —         | UID del creador                                                             |
| `createdAt`        | `timestamp`            | ✅        | —         | Fecha de creación                                                           |

### 8.6 Estructura de Módulos (Subcolecciones Unificadas)

Para simplificar la gestión de estados "Pendiente" y "Confirmado", cada módulo utiliza una única subcolección donde los documentos transicionan de estado.

#### 8.6.1 Subcolección: `activities`

Contiene tanto las propuestas de actividades como las actividades confirmadas (itinerario).

- **Path:** `trips/{tripId}/activities`
- **Estados:** `pending` (propuesta), `confirmed` (en timeline), `rejected`.

#### 8.6.2 Subcolección: `logistics`

Unifica Alojamiento, Transporte e Inventario.

- **Path:** `trips/{tripId}/logistics`
- **Campo `subType`:** `'accommodation' | 'transport' | 'inventory'`
- **Estados:** `pending` | `confirmed` | `rejected`

| Campo           | Tipo                  | Requerido |   Default   | Descripción                                         |
| :-------------- | :-------------------- | :-------: | :---------: | :-------------------------------------------------- |
| `type`          | `string`              |    ✅     |      —      | `'activity' \| 'logistics'`                         |
| `subType`       | `string \| null`      |    ❌     |   `null`    | `'accommodation' \| 'transport' \| 'inventory'`     |
| `title`         | `string`              |    ✅     |      —      | Título del ítem                                     |
| `status`        | `string`              |    ✅     | `'pending'` | `'pending' \| 'confirmed' \| 'rejected'`            |
| `estimatedCost` | `number \| null`      |    ❌     |   `null`    | Costo estimado para el Decision Hub y presupuestos. |
| `votes`         | `map<userId, string>` |    ✅     |    `{}`     | Votos/RSVP                                          |
| `createdBy`     | `string`              |    ✅     |      —      | UID del creador                                     |

> [!NOTE]
> Al confirmar un ítem en `logistics`, simplemente se cambia su `status`. No es necesario mover el documento entre colecciones.

### 8.7 Subcolección: `costs`

... (sin cambios)
... (sin cambios)
pType`|`string`| ✅        |`'ida'`|`'ida'`\|`'vuelta'`\|`'interno'`|
|`capacity`|`number`| ✅        | —       | Capacidad máxima de pasajeros                |
|`passengers`|`string[]`| ✅        |`[]`| UIDs de pasajeros asignados                  |
|`owner`|`string \| null`| ❌        |`null`| UID del dueño (si aplica)                    |
|`createdBy`|`string`| ✅        | —       | UID del creador                              |
|`createdAt`|`timestamp` | ✅ | — | Fecha de creación |

---

## 9. Roles y Permisos (RBAC)

### 9.1 Modelo Híbrido de Permisos

Tripio utiliza un sistema de **Roles Base** con capacidad de **Overrides Granulares**. Esto permite asignar un perfil predefinido y, si es necesario, otorgar o quitar capacidades específicas a un participante puntual.

#### Roles Base

- **`owner` (Creador):** Control absoluto, irrevocable. Único con permiso para transferir propiedad o archivar el viaje.
  - **Permisos Base:** Todos los disponibles (`*`).
- **`admin` (Administrador):** Gestión total de contenido y personas. Puede elevar otros miembros y confirmar propuestas.
  - **Permisos Base:** `edit_itinerary`, `create_proposal`, `vote_proposal`, `manage_logistics`, `view_finances`, `manage_participants`.
- **`collaborator` (Colaborador - Default):** Participación activa: crea propuestas, vota, suma gastos y se asigna transporte/ítems.
  - **Permisos Base:** `create_proposal`, `vote_proposal`, `manage_logistics`, `view_finances`.
- **`viewer` (Observador):** Solo lectura. Puede ver el itinerario, logística y finanzas, pero no puede interactuar.
  - **Permisos Base:** `view_finances`.

#### Permisos Granulares (Flags)

Cualquier rol (excepto `owner`) puede ser modificado mediante los siguientes flags en `customPermissions`:

- `edit_itinerary`: Crear/Editar eventos confirmados.
- `create_proposal`: Publicar nuevas ideas o encuestas.
- `vote_proposal`: Participar en votaciones de ideas.
- `manage_logistics`: Crear transportes o cambiar asignaciones.
- `view_finances`: Acceder al desglose de gastos grupales.
- `manage_participants`: Invitar o remover personas (reservado para Admin/Owner por defecto).

### 9.2 Matriz de Capacidades por Defecto

| Operación                                 | Owner | Admin | Collaborator | Viewer |
| :---------------------------------------- | :---: | :---: | :----------: | :----: |
| **Viaje & Configuración**                 |       |       |              |        |
| Editar Info Viaje (Nombre, Fechas)        |  ✅   |  ✅   |      ❌      |   ❌   |
| Archivar / Eliminar Viaje                 |  ✅   |  ❌   |      ❌      |   ❌   |
| Editar Presupuesto Propio                 |  ✅   |  ✅   |      ✅      |   ✅   |
| **Participantes**                         |       |       |              |        |
| Invitar Participantes                     |  ✅   |  ✅   |      ❌      |   ❌   |
| Cambiar Roles / Overrides                 |  ✅   |  ✅   |      ❌      |   ❌   |
| Remover Miembros                          |  ✅   |  ✅   |      ❌      |   ❌   |
| **Itinerario & Propuestas**               |       |       |              |        |
| Crear/Editar Eventos Directos             |  ✅   |  ✅   |      ✅      |   ❌   |
| Crear Propuestas / Ideas                  |  ✅   |  ✅   |      ✅      |   ❌   |
| Votar Propuestas                          |  ✅   |  ✅   |      ✅      |   ❌   |
| Confirmar Propuesta (Mover a Confirmadas) |  ✅   |  ✅   |      ❌      |   ❌   |
| **Economía & Logística**                  |       |       |              |        |
| Ver gastos Grupales                       |  ✅   |  ✅   |      ✅      |   ✅   |
| Crear/Editar Gastos                       |  ✅   |  ✅   |      ✅      |   ❌   |
| Añadir Alojamiento Directo                |  ✅   |  ✅   |      ❌      |   ❌   |
| Gestionar Transporte (Crear/Asignar)      |  ✅   |  ✅   |      ✅      |   ❌   |

### 9.3 Lógica de Resolución de Permisos

Un usuario puede realizar una acción si:

1. Su **Rol Base** tiene el permiso habilitado Y no hay un override en `false`.
2. O su **Rol Base** no lo tiene, pero existe un override en `true` para ese permiso específico.

> **Regla de Oro:** El `owner` siempre tiene todos los permisos en `true`. Los overrides de `owner` son ignorados.

---

## 10. Operaciones del Sistema

### 10.1 Módulo: Viaje

| Operación      | Input                    | Output                    | Quién        | Side Effects                        |
| :------------- | :----------------------- | :------------------------ | :----------- | :---------------------------------- |
| Crear viaje    | name, destination, dates | Trip + Participant(owner) | Usuario Auth | Creador se agrega como `owner`.     |
| Editar viaje   | tripId, campos editables | Trip actualizado          | Owner, Admin | `updatedAt` se actualiza.           |
| Archivar viaje | tripId                   | Trip(status='archived')   | Owner        | El viaje se vuelve de solo lectura. |

### 10.2 Módulo: Participantes

| Operación            | Input               | Output                    | Quién          | Side Effects                                         |
| :------------------- | :------------------ | :------------------------ | :------------- | :--------------------------------------------------- |
| Invitar (Magic Link) | tripId, email, role | URL `/invite/[token]`     | Admin          | Se genera JWT o token en DB con caducidad (72hs).    |
| Unirse al viaje      | `token` param       | Participant creado        | Usuario (Auth) | Si no auth, URL redirige a Login y conserva token.   |
| Remover participante | tripId, userId      | —                         | Admin          | Recálculo gastos, desasignar tareas/ítems/transporte |
| Elevar a Admin       | tripId, userId      | Participant(role='admin') | Admin          | —                                                    |

### 10.3 Módulo: Timeline & Eventos

| Operación       | Input              | Output            | Quién         | Side Effects                                    |
| :-------------- | :----------------- | :---------------- | :------------ | :---------------------------------------------- |
| Crear evento    | tripId, event data | Event creado      | Admin, Member | Aparece en Timeline                             |
| Editar evento   | eventId, campos    | Event actualizado | Admin, Member | —                                               |
| Eliminar evento | eventId            | —                 | Admin, Member | Tareas vinculadas se desvinculan (no se borran) |
| RSVP            | eventId, attending | RSVP actualizado  | Admin, Member | —                                               |

### 10.4 Módulo: Propuestas

| Operación                | Input                 | Output              | Quién         | Side Effects                    |
| :----------------------- | :-------------------- | :------------------ | :------------ | :------------------------------ |
| Crear propuesta/encuesta | tripId, proposal data | Proposal(draft)     | Admin, Member | —                               |
| Votar                    | proposalId, vote      | Votes actualizados  | Admin, Member | Status permanece en `pending`.  |
| Confirmar propuesta      | proposalId            | Proposal(confirmed) | Admin, Member | Se crea un Event en el Timeline |
| Rechazar propuesta       | proposalId            | Proposal(rejected)  | Admin, Member | —                               |

### 10.5 Módulo: Economía

| Operación        | Input                         | Output                  | Quién          | Side Effects                                                                                                   |
| :--------------- | :---------------------------- | :---------------------- | :------------- | :------------------------------------------------------------------------------------------------------------- |
| Agregar gasto    | tripId, cost data, variable_p | Cost creado             | Admin, Member  | El formulario se pre-carga si nace desde una entidad (ID y EstimatedCost). Recálculo Total Cost.               |
| Editar gasto     | costId, campos                | Cost actualizado        | Admin, Member  | Recálculo Total Cost.                                                                                          |
| Eliminar gasto   | costId                        | —                       | Admin, Member  | Recálculo Total Cost.                                                                                          |
| Set Daily Budget | tripId, amount                | Trip actualizado        | Admin          | Afecta al cálculo de "Presupuesto Diario" en el Total Cost.                                                    |
| Set Budget Limit | tripId, userId, amount        | Participant actualizado | Propio usuario | Alerta mediante un **Observer** (ej: Zustand) global que confronta `Suma(gastos_incluido) + Diarios` vs Limit. |

### 10.6 Módulo: Logística

| Operación               | Input                  | Output                 | Quién         | Side Effects                        |
| :---------------------- | :--------------------- | :--------------------- | :------------ | :---------------------------------- |
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
               (Confirmar)
┌─────────┐ ──────────────→ ┌───────────┐
│ Pending │                 │ Confirmed │
└─────────┘                 └───────────┘
     │                           │
     │         (Rechazar)        │
     └──────────────────────→ ┌──────────┐
                              │ Rejected │
                              └──────────┘
```

- `Pending`: Interacción grupal activa (RSVP y/o Votación de opciones).
- `Pending → Confirmed`: Decisión manual de Admin o Creador. La entidad se mueve a la colección `_confirmed` del módulo.
- `Pending → Rejected`: Decisión manual.
- `Confirmed`: Activa automáticamente su impacto en Timeline (si es actividad) o Logística.

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
| :----------------------------------------- | :------------------------------------------------------------------------------------------- |
| **Admin creador intenta abandonar**        | ❌ No permitido. Debe archivar el viaje.                                                     |
| **Último Admin elevado abandona**          | ✅ Permitido. El creador siempre permanece como Admin.                                       |
| **Evento eliminado con tareas vinculadas** | Las tareas se preservan y se desvinculan (`linkedToId` = `null`).                            |
| **Participante removido**                  | Recálculo automático de Total Cost. Desasignación de tareas, ítems y asientos de transporte. |
| **Budget Limit excedido**                  | Notificación de alta visibilidad (banner + mail). No se bloquea la carga de gastos.          |
| **Transporte sobre-asignado**              | Error 409. La operación no se ejecuta si `passengers.length >= capacity`.                    |
| **Escritura en viaje archivado**           | Error 403. Firestore Rules impiden cualquier mutación en viajes `archived`.                  |
| **Propuesta confirmada dos veces**         | No-op. Si `status = confirmed`, la operación se ignora.                                      |
| **Voto después de deadline**               | Error 400. No se registran votos si `now > deadline`.                                        |

---

## 14. Reglas Canónicas (Single Source of Truth)

1. **Centralización Temporal:** Todo elemento (Tarea, Gasto, Ítem) debe poder vincularse a un punto en el tiempo (Día/Evento) o al contenedor general del viaje.
2. **Cálculo de Costo Personal:** Total = Directos (pagado por mí) + Shared (mi parte de gastos grupales) + Presupuesto Diario proyectado.
3. **No-Goal (Gastos Diarios):** Prohibida la carga de gastos hormiga/tickets. Se asumen cubiertos por el "Presupuesto Diario".
4. **Validación de Capacidad:** El transporte no puede ser sobre-asignado (Error 409).
5. **Prioridad de Alerta:** El exceso de `Budget Limit` es una notificación crítica de alta visibilidad.
6. **Interactividad de Tareas:** Una tarea marcada como "Done" en el Módulo de Tareas debe actualizar automáticamente el status del Ítem o Evento vinculado.
7. **Inmutabilidad de Archivo:** Un viaje archivado es de solo lectura. Ningún participante puede modificar datos.
8. **Centralización de Decisiones:** La creación de propuestas es contextual (desde cualquier módulo), pero la votación y seguimiento se centraliza siempre en `/proposals` (Decision Hub).

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

- **RSVP/Votación:** Mecánica para confirmar interés y pasar una propuesta a estado "Confirmado" (Logística/Timeline).
- **Vista Dual:** Capacidad de alternar entre una grilla de Calendario y una lista de Timeline.
- **Ítem Grupal:** Recurso compartido que puede disparar Tareas de transporte/compra.
- **Magic Link:** URL dinámica para invitar participantes a un viaje.
- **Admin (Creator):** Rol permanente e irrevocable del creador del viaje. Posee permisos exclusivos como la adición directa de Alojamientos.
- **Admin (Elevated):** Rol Admin otorgado a un miembro existente por un Admin.
