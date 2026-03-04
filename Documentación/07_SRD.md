# Documento de Requerimientos del Sistema (DRS) - Proyecto Tripio

> **Versión:** 1.0  
> **Estado:** Draft  
> **Basado en:** Lineamientos de Antigravity DRS

---

## 1. Resumen Ejecutivo

Este documento sintetiza el plan para **Tripio**, un organizador integral de viajes grupales. El producto no es una app fragmentada (solo finanzas o solo encuestas), sino un **contenedor de viaje colaborativo**, donde cada experiencia funciona como un ecosistema autónomo con su propio destino, timeline, presupuesto estructurado y logística de inventario/transporte. Incorpora:

- **Autenticación Simplificada** mediante Google (SSO) y Email.
- **Toma de Decisiones Democrática** (encuestas de impacto real para decisiones sin fricción externa).
- **Gestión Económica de 3 Niveles** (Costos fijos, proyectados y presupuestos individuales).
- **Logística Operativa** para la asignación de transporte e inventarios (separando responsabilidades personales de elementos grupales).
- **Timeline Narrativo y Calendario Hub** (Visualización dual tipo calendario y secuencial, agrupando todas las tareas y eventos).
- **Feed Colaborativo y Sistema de Tareas** (Muro de recursos y delegación accionable).
- **Overview Global y Resguardo Histórico** (Trazabilidad completa pasada y presente y modo "Viaje en Curso" en tiempo real).

---

## 2. Definición Detallada de Componentes

### 2.1 El Viaje como Contenedor Autónomo (Core)

**Definición:** El viaje es el núcleo del ecosistema organizativo. Almacena la historia completa (destino, grupo, economía temporal y logística) preservando contexto a futuro de viajes cerrados/pasados.
**Alcance:** Es el contenedor raíz del cual heredan todos los submódulos.

**Flujo principal:**

1. Usuario crea o accede al histórico para visualizar Viajes Activos/Pasados.
2. Todo módulo navegado dentro de este viaje es contextual, incluyendo un panel de **Overview Global** (A dónde, con quién, cómo, cuándo, costo y recursos).

**Manejo de Participantes:**

- Admite invitación asíncrona (Link) o directa (Email), permitiendo armar el grupo en paralelo a la planificación misma.
- La mentalidad es colaborativa; todos ven el Overview Global y el Timeline.

### 2.2 Timeline y Calendario como Eje del Sistema

**Definición:** El viaje tiene una secuencia narrativa temporal. El Calendario no es solo para visualizar, es el **eje organizador madre**. A cada día se le pueden vincular: Actividades, Costos derivados, Encuestas, Tareas, Recordatorios y Recursos compartidos.
**Flujos principales:**

- Soportar viajes simples e itinerantes (Múltiples estadías).
- **Vista Dual de Lectura:** El usuario puede alternar entre "Vista Calendario Clásico" y "Vista Timeline Secuencial Narrativo".
- **Modo "Viaje en Curso":** Una vez que el `startDate` del viaje coincide con el hoy, la UI del Viaje muta. Deja de ser una herramienta de "Planificación Futura" y pasa a enfocarse en "Modo Acompañamiento": Destaca el cronograma de hoy, el clima actual y la próxima actividad inminente.

### 2.3 Gestión Económica Multinivel

**Definición:** Herramienta de previsión de caja compartida e individual.
**Alcance:** Modelado en tres capas de control financiero y trazabilidad de aportes.

**Granularidad:**

1. **Costos Fijos:** Dinero duro/comprometido (Ej: Pasajes de avión, Reserva de cabaña, Excursiones pactadas).
2. **Costos Proyectados (Flexibles):** Techos o estimados dinámicos (Ej: Comida diaria estimada por día x personas, Fondo para gasolina).
3. **Presupuesto Individual:** Pantalla resumen de cada persona mostrando su TCO (Total Cost of Ownership) del viaje. Muestra "Su cuota parte de Fijos + Su proyección personal".

> **Aclaración sobre MVP:** La gestión de deuda cruzada interna (ej. "Juan le debe a María por el supermercado") queda totalmente excluida del diseño inicial y los cálculos. El sistema es puramente de *previsión y declaración de costos*, no un motor de liquidación de gastos divisibles entre participantes.

**Errores y edge cases:**

- *Eliminación de Costo Fijo:* Cuando un costo fijo grupal se elimina, debe impactar de recálculo directo al TCO de todo el grupo.

### 2.4 Destino y Encuestas de Impacto Real

**Definición:** Herramienta de toma de decisiones que ejecuta mutaciones directas sobre el Viaje.
**Flujo principal:**

- Permite la asignación unilateral directa o apertura de Encuestas.
- **Ejecución Automática / Activities Hub:** Si una encuesta "Destino del Martes" gana la opción "Kayak al lago", al momento del Deadline, el sistema inyecta en el *Calendario Hub* del Martes la Actividad "Kayak al lago". **Pasado el Deadline, los votos son congelados (Locked) y no se pueden modificar.**
- **Asistencia (RSVP) a Actividades:** Una vez creada la actividad (ya sea por encuesta ganadora o por imposición directa del Admin), todos los usuarios deben poder marcar proactivamente su status: *"Voy / No asisto"*. Esto permite dimensionar la logística particular de ese evento (ej: cuántos kayaks rentar emparejado a la actividad de calendario).

### 2.5 Logística Integrada (Transporte e Inventario)

**Definición:** Coordinador del "Cómo vamos" y "Qué llevamos".
**Alcance:** Totalmente dependiente de la temporalidad del viaje. En viajes itinerantes aplican recalculos base.

**Módulo de Transporte:**

- Registra medios físicos (Autos propios, colectivos, aviones).
- Asigna individuos (asientos) a vehículos agrupándolos visualmente en el Overview para rastrear al grupo en ruta.
- Soporte visual de "4 en este Auto A y 2 viajan por Avión B".

**Módulo Inventario a Dos Capas:**

1. **Inventario Personal:** Checklist autogestionado (Abrigo, cepillo). Individual y no publicable/votable por el resto, salvo como sugerencia global.
2. **Inventario Grupal:** Repositorio crítico (Carpa, Hielo, Parlante). Funcionan bajo el ciclo de vida: `Propuesta -> Asignación de Responsabilidad (Quien lo lleva)` para erradicar el vacío logístico.

**Reglas Canónicas:**

- Límite de capacidad real para impedir la autoasignación en vehículos excedidos.

### 2.6 Sistema de Tareas Asignables y Feed Colaborativo

**Definición:** Herramientas de activación social y delegación para estructurar el ecosistema del viaje sin depender de un chat desorganizado.
**Módulo Feed (El Muro):**

- Muro de novedades no estructuradas y links. No pretende ser mensajería instántanea estilo WhatsApp, sino un repositorio de propuestas ricas (Links de Instagram de cabañas, PDFs tarifarios).
**Módulo Tareas:**
- Creación de tareas atómicas (`Reservar Combis`, `Comprar hielo`) asignables a usuarios responsables.
- Se vinculan al Timeline/Día específico. Disparan Recordatorios Notificables a sus designados próximos al vencimiento.

### 2.7 Notificaciones Inteligentes

**Definición:** Sistema asíncrono de alertas push/email.
**Comportamiento esperado:** Alertas exclusivas de valor. "Deadline de Encuesta se acerca", "Se te ha asignado una Tarea Nueva", o "El Modo Viaje en Curso sugiere salir hacia el Aeropuerto".

---

## 3. Arquitectura

### 3.1 Navegación y Jerarquía

```text
App / PWA
├── Autenticación (Login / Register)
│
├── Mis Viajes (Históricos y Activos)
│   └── ⚙️ Perfil / Configuración global
│
└── 🛫 Viaje [ID_Viaje] (Dashboard)
    ├── 🌟 Overview Global (Dash consolidado) / ⚡ Modo "Viaje En Curso"
    ├── 🗺️ El Viaje (Calendario/Timeline Hub, Tareas, Muro/Feed)
    ├── 📊 Tribuna (Encuestas Executables)
    ├── 💰 Tesorería (Gastos Fijos, Techos Proyectados, Mi Saldo)
    └── 📦 Logística & Transportes (Inventario Grupal, Mi Mochila y Vehículos)
```

### 3.2 Modelo de Datos (PostgreSQL Core)

*Esquema Lógico Principal (simplificado)*:

```text
users
  - id, email, name, avatarUrl

trips
  - id, title, defaultCurrency, status (Planning|Active|Archived)

trip_participations
  - tripId, userId, role

locations_and_stages (Itinerarios/Estadías)
  - id, tripId, name (ej: Cabaña Bariloche), address
  - startDate, endDate
  - orderIndex // Clave para los saltos organizacionales del viaje

trip_events (Timeline / Actividades)
  - id, tripId, stageId (Opcional, a dónde pertenece)
  - title, dateTime, duracionEstimada

event_attendees (RSVP)
  - eventId, userId, isAttending (boolean)

polls & poll_options & votes (Tablas de Encuestas, sin cambios)
  - id...

expenses // Costos Fijos e Historial
  - id, tripId, isProjected (Boolean: Si es 'true' es un techo de presupuesto)
  - title, amount, paidByUserId, stageId (Si el costo es propio de una itinerancia)

expense_splits // Atribución económica
  - expenseId, userId, owedAmount

logistics_vehicles
  - id, tripId, name, type (Car/Plane), capacityProviderUserId

vehicle_passengers
  - vehicleId, userId

inventory_items
  - id, tripId, name, type (PersonalChecklist|GrupalShared)
  - ownerUserId, assignedToUserId (En caso compartido, el voluntario)

trip_tasks
  - id, tripId, eventId (Vinculación opcional al Calendario)
  - description, assignedToUserId, status (Todo|Done)
  - deadlineAt

trip_feed_posts
  - id, tripId, authorUserId, content
  - linkUrl, linkMetadata (Para previsualizar embeds externos)
  - createdAt
```

---

## 4. Fases de Implementación

### Fase 0: Estructura e Identidad

- Setup Supabase, Autenticación y Layout General.
- Creación de colecciones de Viajes, Usuarios y el **Feed Colaborativo** base.

### Fase 1: El Timeline como Corazón

- CRUD de Viajes Múltiples y Participantes.
- Creación de Vista Dual (Calendario + Timeline).
- Lógica generadora del **"Modo Viaje en Curso"** interceptando fechas actuales.

### Fase 2: Tribuna, Encuestas de Impacto y Tareas

- Módulo Encuestas.
- Workers/Hooks para que las encuestas ganadoras alteren la base de datos de Eventos del Timeline.
- CRUD de Tareas atadas al calendario y responsables.

### Fase 3: Módulo Financiero a 3 Niveles

- Componente de Costos Fijos vs Proyectados.
- UI de TCO Individual de Presupuesto.

### Fase 4: Logística (Transporte e Inventarios Separados)

- Altas de Vehículos y asignaciones de asientos.
- Tableros privados de Inventario vs "Lo que el grupo necesita".

---

## 5. Lo que NO Cambia

*(Por el momento no hay decisiones arquitectónicas inamovibles, a la espera de confirmación del equipo).*

---

## 6. Caso de Uso End-to-End

**Escenario:** "Roadtrip al Valle" para 10 personas. Una estadía única pero compleja.

**Problema Inicial:** Juan organiza, tiene 10 confirmados. Hay 2 autos y no se tiene control visible del presupuesto real personal, o de los elementos que faltan.

**Flujo en App Tripio:**

1. **Creación y Unión:** Juan nombra el proyecto "Roadtrip al Valle". Comparte el link en WhatsApp. El resto entra al Dash, donde el *Overview Global* domina la pantalla principal de todos, marcando `Estado: Planificación`.
2. **Timeline y Fijos:** Juan marca fecha y sube el "Costo de Reserva Cabaña" (\$200,000 en total) en el módulo de Economía. El sistema divide los \$20,000 de Base a cada uno.
3. **Previsiones y Personalización:** El sistema proyecta la "Comida" (\$15,000 por persona por día). María abre *"Mi Presupuesto"* y el sistema le responde en pantalla: "María, tu TCO (Total Esperado) para este fin de semana es \$45,000".
4. **Inventario, Transporte y Tareas:** En el apartado logístico se registran los dos Autos. En **Inventario Grupal**, Juan sube ficha vacía pidiendo *"Parrilla y Carbón"*, el sistema insta a voluntarios y Pedro hace "Take responsibility". Además, Juan asigna una *Tarea* a María: "Averiguar pasajes extras".
5. **Decisiones (Encuesta) y Timeline Automático:** Juan crea encuesta "¿A dónde vamos el viernes?" con cierre Miércoles. El miércoles gana *Kayak*, automáticamente en la Vista Timeline del Viernes aparece el Evento `Kayak`.

**Resultado esperado:**  
En la vista central del día viernes (estando ya en **Modo Viaje En Curso**), todos abren la app celular en el auto, miran a qué hora inicia el Kayak y comprueban en el Inventario que Pedro trajo la parrilla, sabiendo que económicamente están dentro del TCO pautado.

---

## 7. Definiciones Canónicas y Reglas Estrictas

1. **Jerarquía Presupuestaria de 3 Capas:** Gasto Fijo real vs Gasto Proyectado Estimativo vs TCO Individual. Nunca se deben pisar en pantalla; el usuario debe saber claramente qué dinero debe "depositar ya" vs "guardar en el bolsillo para mañana".
2. **Timeline Hub Infranqueable:** Todas las Tareas, Eventos Y Encuestas pivotan visualmente o contextualmente en torno a fechas de la Estadía. Si se cambia el día de una estadía, todo se desplaza contextualmente.
3. **Inventario Privado Mantenido:** Módulos como "Items Personales" (El traje de baño de Pedro) nunca se listan o resumen en la pantalla grupal general para reducir ruido visual, aislándose solo al dashboard de Pedro.
4. **Bloqueo Asimétrico Asientos:** La cantidad de *VehiclePassengers* vinculados no puede superar la declaración en `vehicles.capacity`. Retornará un error `HTTP 409 Conflict - Vehicle Full`.

### 7.1 Permisos por Rol

| Acción | Admin (Dueño) | Member (Participante) | Notas |
| :--- | :---: | :---: | :--- |
| **Editar Detalles del Viaje** | ✅ | ✅ | Todos pueden colaborar ajustando nombre, descripción y portada. |
| **Borrar Contenedor del Viaje** | ✅ | ❌ | Por seguridad, solo el creador original o Administradores. |
| **Invitar Nuevos Usuarios** | ✅ | ✅ | Cualquier participante puede generar enlaces o invitar por mail. |
| **Expulsar Usuarios** | ✅ | ❌ | La eliminación forzada de miembros se restringe a Admins. |
| **Crear Encuesta/Tarea/Evento** | ✅ | ✅ | Fomentando la colaboración sin fricción. |
| **Borrar Gasto Fijo/Proyectado**| ✅ | ✅ | *Excepción:* Solo el Admin, o el *Member que creó* ese gasto (Dueño del Gasto). |
| **Modificar Timeline Base** | ✅ | ✅ | Todos pueden ajustar fechas de estadías e inicio/fin bajo cultura de consenso. |

### 7.2 Mapa de Eventos y Notificaciones (Triggers)

| Tipo (Trigger) | Condición | Acción / Evento Disparado |
| :--- | :--- | :--- |
| **Encuesta Resuelta** | Llega el `deadlineAt` de la Votación. | Si gana una *Actividad/Destino*, inyecta Evento al Timeline de forma autómata. Dispara Notificación In-App *"Votación cerrada"*. |
| **Nuevo Participante** | Un usuario usa el "Magic Link" de la PWA. | Crea registro en `trip_participations`. Dispara Push general *"Juan se acaba de unir al viaje"*. |
| **Recordatorio Tarea** | 24hs antes de una `trip_task`. | Dispara Push Directa a `assignedToUserId`: *"Tarea por Vencer: Comprar Hielo"*. |
| **Nuevo Gasto** | Member crea un Gasto y divide a todos. | Actualiza en la UI del Viaje los montos `owedAmount`. Dispara Push si el nuevo monto adeudado del receptor supera > $0. |

### 7.3 Límites Técnicos del Sistema

- **Máximo Participantes por Viaje:** 100 usuarios activos.
- **Máximo de Opciones por Encuesta:** 15.
- **Máximo Tamaño de Archivo (Uploads del Feed):** 10 MB (Prioridad texto y links).
- **Duración Histórica del Viaje:** Los viajes cerrados/pasados cambian de `status` a "Archivado" y pasan a solo-lectura perpetua (ReadOnly) luego de 30 días de su fecha de finalización.

---

## 8. Pendientes de Definir

*(Decisiones técnicas pausadas a la espera de revisión y confirmación en conjunto)*

- **Estrategia PWA / Desktop:** Confirmar si el foco será 100% Mobile (PWA) u ofrecer una experiencia Desktop más robusta.
- **Base de Datos y Autenticación:** Evaluar si se utilizará Supabase (BaaS) u otra alternativa.
- **Formato Offline:** Debido a que en camping la gente pierde señal, deberíamos evaluar habilitar Service Workers de Next.js (`next-pwa`) para cachear al menos el "Estado de lectura".
- **Notificaciones Dinámicas (Emails? Push?):** Determinar en Fase 3 si para los "Deadlines de encuestas" y asignaciones de Tareas usaremos Cronjobs Serverless para enviar recordatorios periódicos.
- **V2: Algoritmo *Splitwise* (Simplificación de Deuda Interna) / MVP+1:** Actualmente excluido del core. En el radar para integrarse post-MVP, permitiendo dividir tickets de gastos entre miembros específicos y simplificar trayectos de deuda viva.
