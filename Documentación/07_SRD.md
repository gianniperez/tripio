# Documento de Requerimientos del Sistema (DRS) - Proyecto Tripio

> **Versión:** 2.0  
> **Estado:** Draft  
> **Basado en:** Lineamientos de Antigravity DRS

---

## 1. Resumen Ejecutivo

Este documento sintetiza el plan para **Tripio**, un organizador integral de viajes grupales. El producto es un **contenedor de viaje colaborativo**, donde cada experiencia funciona como un ecosistema autónomo con su propio destino, timeline, presupuesto estructurado y logística.

**Puntos Clave del MVP:**

- **PWA (Mobile First):** Enfocado 100% en dispositivos móviles.
- **Autenticación:** Firebase Auth (Google y Email).
- **Base de Datos:** Firebase Firestore.
- **Gestión Económica:** Fijos, Proyectados y Diarios.
- **Logística & Tareas:** Timeline interactivo y asignación de recursos vinculada.

---

## 2. Definición Detallada de Componentes

### 2.1 El Viaje como Contenedor Autónomo (Core)

El viaje es el núcleo del ecosistema. Almacena la historia completa, preservando el contexto para el futuro.

**Ciclo de Vida:**

1. **`Planning` (Planificación Activa):** Estado inicial de alta mutabilidad.
2. **`Active` (Viaje en Curso):** Se activa automáticamente en la `startDate`. La UI prioriza la información del día.
3. **`Archived` (Cierre/Archivo):** Solo lectura tras la finalización.

### 2.2 Timeline y Vista Dual (Calendario Hub)

El sistema ofrece dos formas de visualizar la secuencia temporal del viaje.

#### Vista Calendario Clásico (Grid)

- **Elementos:** Cuadrícula mensual/semanal.
- **Visualización:** Iconos rápidos sobre cada día indicando cantidad de actividades, tareas pendientes y presupuesto proyectado del día.
- **Interacción:** Click en un día abre el modal de "Detalle del Día".

#### Vista Timeline Secuencial (Narrativo)

- **Elementos:** Lista vertical cronológica.
- **Detalle:** Muestra tarjetas extendidas de Actividades (con RSVP), Tareas (con responsable), y Notas del Feed.
- **Visualización:** Línea de tiempo que conecta visualmente los hitos (ej. "Transfer -> Check-in -> Cena").

#### Dashboard "Active" (En Curso)

Cuando el estado es `Active`, el Dashboard principal resalta:

- **Próximos Pasos:** La actividad inmediata y la logística de transporte asociada.
- **Tareas del Día:** Links directos para marcar como "Completado".
- **Gasto Diario:** Recordatorio del monto proyectado disponible.

### 2.3 Gestión Económica (Total Cost)

Previsión financiera dividida en tres capas de control:

1. **Costos Fijos:** Gastos ya comprometidos (Ej: Alojamiento).
2. **Costos Proyectados:** Estimaciones para variables grupales (Ej: Combustible).
3. **Presupuesto Diario:** Monto fijo por día (ej. $50 USD) que escala según la duración. No se cargan tickets individuales.

El **Total Cost** individual es la suma de su parte proporcional de fijos, proyectados y su total de diarios.

### 2.4 Destino y Actividades

Repositorio de qué hacer, con confirmación de asistencia (**RSVP**) para dimensionar la logística.

### 2.5 Logística Integrada (Transporte e Inventario)

#### Medios de Transporte

En lugar de gestionar activos físicos complejos, el sistema registra:

- **Medio:** (Auto Pedro, Avión, Micro).
- **Capacidad:** Cuántos entran.
- **Pasajeros:** Quién viaja con quién para rastrear al grupo.

#### Inventario Grupal (Shared Items)

Repositorio de ítems necesarios (Carpa, Parlante).

- **Opcionalidad:** Siempre debe estar la opción de indicar quién lo lleva, pero no es obligatorio para el MVP que todos los ítems tengan dueño.
- **Vínculo con Tareas:** Si se asigna un responsable a un ítem, automáticamente se genera una **Tarea** asociada.

### 2.6 Sistema de Tareas Inteligentes

Las tareas son el motor de acción del grupo.

- **Vínculo con Calendario:** Una tarea puede nacer de un evento (ej. "Comprar carbón" para el evento "Parrillada").
- **Vínculo con Inventario:** Una tarea puede nacer de un ítem (ej. "Conseguir Carpa").
- **Visualización:** Aparecen en el Módulo de Tareas y también dentro del detalle del Evento o Ítem relacionado.

---

## 3. Arquitectura y UX/UI

### 3.1 Navegación y Jerarquía (PWA Focus)

```text
Login (Firebase Auth) -> Mis Viajes
│
└── Viaje Dashboard [ID] (Mobile NavBar)
    ├── 🏠 Home (Overview: Estado actual, Total Cost personal, Próxima Actividad)
    ├── 📅 Planner (Switch Dual: Calendario Grid / Timeline Vertical)
    │   └── Detalle de Día (Actividades, Tareas, Feed relacionado)
    ├── 💰 Economy (Costos Fijos, Proyectados, Límite de Presupuesto)
    └── 🎒 Logistics (Transporte, Inventario Grupal e Individual, Tareas)
```

### 3.2 Stack Tecnológico

- **Frontend:** Next.js / TypeScript.
- **Backend/DB:** Firebase (Firestore, Auth).
- **Deployment:** Vercel o Firebase Hosting.
- **Offline (Post-MVP):** Service Workers para lectura cacheada.

---

## 4. UX/UI General

### 4.1 Principios de Diseño

- **Mobile-First PWA:** Diseñado para pulgar, botones grandes, feedback táctil.
- **Gamificación Proactiva:**
  - **Hitos de Grupo:** Barras de progreso por categorías (Logística completa, Finanzas cerradas).
  - **Badges:** Iconos lúdicos por completar tareas o ser el primero en hacer RSVP.
  - **Mascota (Future Scope):** Un guía lúdico que celebra hitos (no incluido en MVP).

---

## 5. Fases de Implementación (Firebase Focus)

- **Fase 0:** Setup de proyecto (Next.js + Firebase Auth/Firestore).
- **Fase 1:** El Viaje y Timeline (Vista Dual básica).
- **Fase 2:** Economía (3 niveles + Límite de Presupuesto + Notificaciones Mail).
- **Fase 3:** Logística e Inventario vinculado a Tareas.

---

## 6. Notificaciones e Interacciones

| Trigger | Condición | Acción |
| :--- | :--- | :--- |
| **Nuevo Participante** | Unión vía link. | Mail al Admin / Toast en App. |
| **Gasto/Update** | Cambio en costos. | Recálculo de "Total Cost" y alerta si supera el **Budget Limit**. |
| **Tarea Asignada** | Creación o asignación. | Mail al responsable. |

---

## 7. Límites Técnicos

- **Máximo Participantes:** 20 usuarios.
- **Plataforma:** PWA (Navegador móvil). No Desktop.
- **Offline:** No disponible para MVP.
- **Notificaciones:** Email para MVP (Push post-MVP).

---

## 8. Reglas Canónicas (Single Source of Truth)

1. **Centralización Temporal:** Todo elemento (Tarea, Gasto, Ítem) debe poder vincularse a un punto en el tiempo (Día/Evento) o al contenedor general del viaje.
2. **Jerarquía Presupuestaria:** El **Total Cost** se calcula como `Fijos/n + Proyectados/n + (Diarios * días)`.
3. **No-Goal (Gastos Diarios):** Prohibida la carga de gastos hormiga/tickets. Se asumen cubiertos por el "Presupuesto Diario".
4. **Validación de Capacidad:** El transporte no puede ser sobre-asignado (Error 409).
5. **Prioridad de Alerta:** El exceso de `Budget Limit` es una notificación crítica de alta visibilidad.
6. **Interactividad de Tareas:** Una tarea marcada como "Done" en el Módulo de Tareas debe actualizar automáticamente el status del Ítem o Evento vinculado.

---

## 9. Decisiones Técnicas Decididas

- **Database:** Firebase Firestore (NoSQL).
- **Auth:** Firebase Auth (SSO Google + Email/Password).
- **UI:** Tailwind CSS (si aplica) o Vanilla CSS Premium.
- **PWA:** PWA nativa sin soporte Desktop dedicado.

---

## 10. Glosario de Definiciones

- **Viaje (Travel Container):** La entidad raíz que agrupa todo el ecosistema.
- **Economía Temporal (Temporal Economy):** Integración del presupuesto con la línea de tiempo.
- **Total Cost:** Costo estimado final para un usuario (Fijos + Proyectados + Diarios).
- **Daily Projected Cost:** Monto diario fijo escalable por la duración del viaje.
- **Budget Limit:** Monto máximo auto-impuesto por el usuario.
- **RSVP:** Confirmación binaria de asistencia a una actividad.
- **Vista Dual:** Capacidad de alternar entre una grilla de Calendario y una lista de Timeline.
- **Ítem Grupal:** Recurso compartido que puede disparar Tareas de transporte/compra.
