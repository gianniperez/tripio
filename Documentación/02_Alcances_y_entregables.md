# Alcances y Entregables

## Alcance del Proyecto

En su Primera Etapa (MVP), el proyecto abarcará el desarrollo de una Aplicación Web Progresiva (PWA) Mobile-First con soporte responsive para Desktop vía navegador.

### Funcionalidades Core (MVP)

1. **Gestión de Viajes y Usuarios**
   - Creación de nuevos viajes como contenedores autónomos.
   - Sistema de invitación de participantes mediante Magic Links.
   - Roles: Admin (creador, extensible a otros) y Member.

2. **Propuestas Distribuidas (Actividades, Alojamiento, Transporte, Inventario)**
   - Cada módulo gestiona sus propias ideas y decisiones con pestañas "Pendientes" y "Confirmadas".
   - Centralización vía **Decision Hub** en el Dashboard para seguimiento grupal.
   - Ciclo de vida: `Pending` → `Confirmed` / `Rejected`.
   - Las propuestas confirmadas se integran automáticamente al Timeline o sección logística.

3. **Gestión Económica Avanzada**
   - **Gastos Directos:** Pagados por un usuario (ej: un souvenir personal).
   - **Gastos Compartidos (Shared):** Tickets grupales con **Split Variable** (montos distintos por persona).
   - **Presupuesto Diario Sugerido:** Cálculo dinámico basado en el remanente del Límite Personal y los días restantes.
   - **Simplificación de Deudas:** Algoritmo opcional (Splitwise-style) para consolidar pagos entre participantes.
   - Vínculo bidireccional entre Gastos y Entidades (Actividades, Logística, etc).
   - Budget Limit personal con alertas de exceso de presupuesto.

4. **Logística y Transporte**
   - Registro de medios de transporte disponibles (quién lleva auto).
   - Asignación de pasajeros a cada vehículo (con validación de capacidad).
   - Inventario grupal de objetos/equipaje y asignación de responsables.
   - Vínculo automático Inventario → Tareas al asignar responsable.

5. **Timeline e Itinerario**
   - Vista Timeline secuencial (narrativa visual).
   - Vista Calendario clásico (grilla mensual/semanal).
   - Eventos con RSVP y tarjetas dinámicas.

## Entregables Principales

- **Documento de Requerimientos de Software (SRD):** Documentación técnica detallada (Arquitectura, Modelo de Datos, RBAC, Operaciones, Seguridad).
- **MVP Funcional:** Aplicación web PWA desplegada y accesible, respetando el stack tecnológico base (Next.js, Tailwind, React Query, Zustand, Firebase).
- **Documentación del Proyecto:** Carpeta organizativa estandarizada con objetivos, responsables, cronograma y reportes.

## Fuera de Alcance Inicial

- Aplicaciones Desktop nativas (Electron/Tauri).
- Sistema de reservas de vuelos/hoteles integrado con agencias externas.
- Pasarelas de pago internas (los pagos/transferencias se acuerdan fuera de la app).
- Push Notifications (se usan Email para MVP).
- Soporte Offline / Service Workers.
