# Alcances y Entregables

## Alcance del Proyecto

En su Primera Etapa (MVP), el proyecto abarcará el desarrollo de una Aplicación Web Progresiva (PWA) Mobile-First con soporte responsive para Desktop vía navegador.

### Funcionalidades Core (MVP)

1. **Gestión de Viajes y Usuarios**
   - Creación de nuevos viajes como contenedores autónomos.
   - Sistema de invitación de participantes mediante Magic Links.
   - Roles: Admin (creador, extensible a otros) y Member.

2. **Propuestas Colaborativas (Ideas + Encuestas)**
   - Módulo unificado de propuestas ricas (con ubicación, costo, fechas) y encuestas simples (opciones votables con deadline).
   - RSVP y votación grupal para medir interés.
   - Ciclo de vida: Draft → Voted → Confirmed/Rejected.
   - Las propuestas confirmadas se convierten en eventos del Timeline.

3. **Gestión de Presupuesto (3 Niveles)**
   - **Costos Fijos:** Gastos comprometidos (alquiler, pasajes).
   - **Costos Proyectados:** Estimaciones para variables grupales (combustible, comida).
   - **Presupuesto Diario:** Monto fijo por día que escala por duración.
   - Total Cost individual = `Fijos/n + Proyectados/n + (Diarios * días)`.
   - Budget Limit personal con alertas al exceder.

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
- Gestión de deuda interna entre participantes (Tripio presupuesta, no gestiona deudas).
- Push Notifications (se usan Email para MVP).
- Soporte Offline / Service Workers.
