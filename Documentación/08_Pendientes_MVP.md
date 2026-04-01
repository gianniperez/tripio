# Roadmap de Implementación MVP - Tripio

Este documento centraliza el paso a paso técnico para llevar Tripio de un boilerplate a un MVP funcional, basado en el **SRD v4.0**.

---

## Fase 0: Setup & Branding (Sprint 0)

1. **Alineación de Identidad**
   - [x] Actualizar Metadata en `src/app/layout.tsx` (título, descripción, OG tags).
   - [x] Actualizar `README.md` (eliminar referencias innecesarias, destacar "Tripio", mantener FSD/Husky rules).

2. **Infraestructura Firebase**
   - [x] Instalar SDK (`firebase`).
   - [x] Crear `src/lib/firebase.ts` con config base (Firestore, Auth).
   - [x] Crear `.env.example` con keys.

3. **Configuración PWA**
   - [x] Generar `manifest.json`.
   - [x] Soporte básico next-pwa (iconos).

4. **Setup de Tooling**
   - [x] Instalar dependencias clave: `react-hook-form`, `@hookform/resolvers`, `zod`, `date-fns`.
   - [x] Configurar manejador de modales base (`Dialog`/`Sheet`). (o instalar UI primitives lib si se desea).

---

## 🏗️ Fase 1: El Viaje y Timeline (Core)

_Objetivo: La "unidad atómica" de la app funcionando con persistencia real._

- [x] **Seguridad y Modelado:**
  - [x] Implementar Firestore Security Rules detalladas en el SRD v3.0.
  - [x] Crear tipos TypeScript para todas las colecciones anidadas.

- [x] **Sistema de Roles y Permisos (RBAC):**
  - [x] Definir tipos de roles (`owner`, `admin`, `collaborator`, `viewer`) y permisos granulares.
  - [x] Implementar lógica de validación de permisos (Helper functions).
  - [x] Actualizar Firestore Rules con validación híbrida (Rol + Overrides).
  - [x] Crear Panel de Gestión de Participantes (UI).

- [x] **Autenticación:**
  - [x] Configurar Firebase Auth (Google + Email/Password).
  - [x] Crear Pantalla de Login (`/login`) con Auth Providers.
  - [x] Guardar perfil de usuario en colección `users` al primer login.

- [x] **Gestor de Viajes (Mis Viajes):**
  - [x] Crear la pantalla "Mis Viajes" (`/trips`) para listar los trips del usuario.
  - [x] Modal/Pantalla para "Crear Nuevo Viaje" (Formulario usando `zod`).
  - [x] Generación de "Magic Links" de invitación.
  - [x] Lógica para unirse a viaje vía link (`/invite/[token]`).

- [x] **Layout & Navegación:**
  - [x] Header con contexto de viaje (Nombre + Fecha).
  - [x] Sticky Bottom NavBar (Propuestas, Actividades, Inicio, Logística, Finanzas).
  - [x] Sidebar Desktop persistente para navegación fluida.

- [x] **Visualización del Itinerario:**
  - [x] Gestión de fechas del viaje (Ajustes).
  - [x] Vista Timeline (lista vertical secuencial).
  - [x] Vista Calendario (grid mensual/semanal).
  - [x] Switch de alternancia entre vistas.
  - [x] Manejo de estados vacíos (CTAs cuando no hay fechas).
  - [x] Backlog: actividades confirmadas sin fecha.

---

## 💰 Fase 2: Economía Temporal

_Objetivo: Control financiero proyectado según duración del viaje._

- [x] **Motor Económico Avanzado:**
  - [x] Configuración de Presupuesto Diario Disponible en el viaje.
  - [x] Configuración de Budget Limit personal.
  - [x] **Split Variable:** Implementar lógica para cargar montos específicos por persona en un gasto.
  - [x] **Simplificación de Deudas (Splitwise style):** Lógica para consolidar pagos entre participantes.
  - [ ] **Vínculo Bidireccional:** Asociación de gastos con Actividades, Alojamientos, Transportes o Ítems. _(Pospuesto temporalmente hasta finalizar el onboarding logístico)._
  - [x] Lógica de cálculo del "Total Cost" (incluyendo participación en gastos compartidos).

- [x] **Alertas de Presupuesto:**
  - [x] Watcher visual (BudgetProgressBar) que confronta `Gastos + Presupuesto Diario` vs `Budget Limit`.

---

## 💡 Fase 3: Propuestas Distribuidas y Logística

_Objetivo: Toma de decisiones en contexto y organización de recursos._

- [x] **Centralización de Propuestas (Decision Hub):**
  - [x] Estructura de subcolecciones espejo (`_proposals` / `_confirmed`) en DB.
  - [x] Nueva vista dedicada `/proposals` que agrupa y lista todas las propuestas pendientes (Actividades, Alojamientos, Transportes, etc.).
  - [x] Limpieza de las vistas `/activities` y `/logistics` para transformarlas en repositorios de "Solo Información Confirmada" con sus respectivos FABs de creación.
  - [x] Lógica de "Confirmar Propuesta" → Transición de datos a la colección `_confirmed` y aterrizaje automático en el Timeline/Itinerario.

- [x] **Logística de Transporte:**
  - [x] Registro de vehículos y capacidad máxima.
  - [x] Sistema de Auto-Asignación de pasajeros con validación de límite (Error 409).

- [x] **Inventario e ítems:**
  - [x] Checklist de ítems grupales compartidos.
  - [x] Módulo de inventario: Gestión de `status` y `assignedTo` en ítems grupales.

---

## 📢 Fase 4: Notificaciones y Pulido

_Objetivo: Comunicación y calidad final._

- [ ] **Módulo de Mails:**
  - [ ] Notificación por nueva invitación.
  - [ ] Notificación por responsable de ítem asignado o deadline de encuesta.
- [ ] **Branding Final:**
  - [ ] Sistema de diseño (colores y tipografía definitiva).
  - [ ] Logo y Favicon oficial.

---
