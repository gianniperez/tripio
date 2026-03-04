# Roadmap de Implementación MVP - Tripio

Este documento centraliza el paso a paso técnico para llevar Tripio de un boilerplate a un MVP funcional, basado en el **SRD v3.0**.

---

## 🚀 Fase 0: Setup & Branding (Sprint 0)

*Objetivo: Preparar el terreno y conectar la infraestructura base.*

- [ ] **Alineación de Identidad:**
  - [ ] Renombrar proyecto en `package.json` ("next-app-template" → "tripio").
  - [ ] Actualizar Metadata en `src/app/layout.tsx` (título, descripción, OG tags).
  - [ ] Limpiar referencias a otros proyectos en comments (ej. `onCloseEvents.ts`).
  - [ ] Actualizar `README.md` con la descripción real de Tripio.

- [ ] **Infraestructura Firebase:**
  - [ ] Instalar SDK de Firebase (`npm install firebase`).
  - [ ] Crear archivo de configuración `src/lib/firebase.ts`.
  - [ ] Crear `.env.example` con las keys necesarias (ApiKey, AuthDomain, etc.).

- [ ] **Configuración PWA:**
  - [ ] Generar e incluir `manifest.json`.
  - [ ] Configurar soporte básico para instalación en mobile.

---

## 🏗️ Fase 1: El Viaje y Timeline (Core)

*Objetivo: La "unidad atómica" de la app funcionando con persistencia real.*

- [ ] **Seguridad y Modelado:**
  - [ ] Implementar Firestore Security Rules detalladas en el SRD v3.0.
  - [ ] Crear tipos TypeScript para todas las colecciones anidadas.

- [ ] **Autenticación:**
  - [ ] Configurar Firebase Auth (Google + Email/Password).
  - [ ] Guardar perfil de usuario en colección `users` al primer login.

- [ ] **Gestor de Viajes:**
  - [ ] CRUD de Viajes (Crear, Editar, Listar).
  - [ ] Generación de "Magic Links" de invitación.
  - [ ] Lógica de membresía (unirse a viaje vía link).

- [ ] **Layout & Navegación:**
  - [ ] Header con contexto de viaje (Nombre + Fecha).
  - [ ] Sticky Bottom NavBar (Home, Timeline, Propuestas, Decidido).

- [ ] **Visualización del Itinerario:**
  - [ ] Vista Timeline (lista vertical secuencial).
  - [ ] Vista Calendario (grid mensual/semanal).
  - [ ] Switch de alternancia entre vistas.

---

## 💰 Fase 2: Economía Temporal

*Objetivo: Control financiero proyectado según duración del viaje.*

- [ ] **Motor Económico:**
  - [ ] Configuración de Presupuesto Diario y Budget Limit en el viaje.
  - [ ] CRUD de Gastos Fijos y Proyectados.
  - [ ] Lógica de cálculo del "Total Cost" (Fijos/n + Proyectados/n + Diarios*días).

- [ ] **Alertas de Presupuesto:**
  - [ ] Watcher de gastos que dispara banner de advertencia si se excede el límite personal.

---

## 💡 Fase 3: Propuestas y Logística

*Objetivo: Colaboración activa y organización de recursos.*

- [ ] **Módulo de Propuestas Unificado:**
  - [ ] Creación de Propuestas Ricas (costo, ubicación, links).
  - [ ] Creación de Encuestas Simples (opciones votables).
  - [ ] RSVP/Votación y cierre automático de propuestas.
  - [ ] Lógica de "Confirmar Propuesta" → Auto-crear evento en Timeline.

- [ ] **Logística de Transporte:**
  - [ ] Registro de vehículos y capacidad.
  - [ ] Asignación de pasajeros (con validación de límite).

- [ ] **Inventario e ítems:**
  - [ ] Checklist de ítems necesarios.
  - [ ] Vínculo Ítem → Tarea automática al asignar responsable.

---

## 📢 Fase 4: Notificaciones y Pulido

*Objetivo: Comunicación y calidad final.*

- [ ] **Módulo de Mails:**
  - [ ] Notificación por nueva invitación.
  - [ ] Notificación por tarea asignada o deadline de encuesta.
- [ ] **Branding Final:**
  - [ ] Sistema de diseño (colores y tipografía definitiva).
  - [ ] Logo y Favicon oficial.
