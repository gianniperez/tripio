# Registro de Cambios e Iteraciones - Tripio

Este documento registra cronológicamente las modificaciones técnicas, arquitectónicas y de documentación realizadas durante la jornada.

## 📅 8 de Marzo, 2026

### 📝 Documentación y Roadmap

- **Validación de Estado Real:** Se sincronizó `08_Pendientes_MVP.md` con el código actual.
  - Se marcó `README.md` como completado.
  - Se marcó `BottomBar`, `Sidebar` y `TopBar` como completados.
  - Se identificó la falta de `.env.example` y se marcó como pendiente.
- **Actualización de SRD (v3.1 - Navegación):**
  - Se modificó el flujo principal: al loguearse el usuario entra a `Mis Viajes` (`/trips`).
  - Al entrar a un viaje específico, la `Bottom NavBar` ahora tiene 4 botones: `Inicio`, `Propuestas`, `Logística` y `Participantes`.
  - Se renombró la vista de `Ideas` a `Propuestas`.
  - Se oficializó que la gestión de usuarios (anteriormente en pruebas en un Dashboard genérico) vivirá dentro de la vista `Participantes` propia del viaje.

- **Refactorización de Rutas (Next.js App Router):**
  - Se eliminó el layout genérico `/(dashboard)`.
  - Se creó la ruta base dinámica `/trips/[tripId]` y subrutas para `proposals`, `logistics` y `participants`.
  - El componente interactivo BottomBar ahora lee dinámicamente la ID del trip utilizando `usePathname()`.
  - Las funciones de inicio de sesión (`LoginForm`) redirigen al usuario directamente hacia `/trips`.
- **Actualización de SRD (v3.1):**
  - Se reestructuró la **Sección 9 (Roles y Permisos)** para implementar el **Modelo Híbrido de RBAC**.
  - Se definieron los roles técnicos: `owner`, `admin`, `collaborator`, `viewer`.
  - Se especificaron los permisos granulares: `edit_itinerary`, `create_proposal`, `vote_proposal`, `manage_logistics`, `view_finances`, `manage_participants`.
  - Se documentó la lógica de resolución de permisos (Rol Base + Overwrites).
  - Se corrigió el formato de las tablas de datos para mayor legibilidad.

### ⚙️ Configuración y Setup

- **[NUEVO]** [`.env.example`](file:///c:/Users/Maza/Documents/Programacion%20IA/Proyectos/Tripio/.env.example): Se creó la plantilla de variables de entorno para Firebase necesarias para el desarrollo.

### 🏗️ Arquitectura de Datos (Tipos)

- **[NUEVO]** [`src/features/auth/utils/permissions.ts`](file:///c:/Users/Maza/Documents/Programacion%20IA/Proyectos/Tripio/src/features/auth/utils/permissions.ts):
  - Se implementó la lógica `hasPermission` que valida el acceso basado en la jerarquía de roles (`owner`, `admin`, `collaborator`, `viewer`) y permite overrides manuales mediante `customPermissions`.
  - Se agregaron helpers `hasAllPermissions` y `hasAnyPermission` para verificaciones múltiples.

- [MODIFICADO] [`src/types/tripio.ts`](file:///c:/Users/Maza/Documents/Programacion%20IA/Proyectos/Tripio/src/types/tripio.ts):
  - Se agregó el tipo `TripPermission` con los flags granulares.
  - Se actualizó la interfaz `Participant` para incluir `customPermissions` (Partial Record de permisos).
  - Se ajustaron los tipos de Roles en `TripRole` para incluir `owner`, `collaborator` y `viewer`.

### 🔐 Autenticación y Flujos de Usuario

- **[MODIFICADO]** [`src/providers/AuthProvider.tsx`](file:///c:/Users/Maza/Documents/Programacion%20IA/Proyectos/Tripio/src/providers/AuthProvider.tsx):
  - Se activó el `autoCreate: true` en la sincronización del perfil, asegurando que los usuarios se registren en Firestore al primer login con Google u otros proveedores.
- **[MODIFICADO]** `src/features/auth/components/LoginForm/LoginForm.tsx`:
  - Se eliminó la validación manual que bloqueaba a usuarios sin documento previo en Firestore, delegando la creación al `AuthProvider`.
  - Limpieza de código: eliminación de funciones no utilizadas (`checkUserExists`, `logout`) y duplicación de lógica.

### 🛡️ Roles y Permisos Híbridos (RBAC)

- **[NUEVO]** `src/features/participants`: Implementación de Features basadas en FSD generadas usando `plop`.
  - Interfaces base para gestionar participantes: `ParticipantsManager`, `ParticipantCard`, `InviteParticipant`.
  - Integración con elementos del Design System UI (Neumorphism UI Components).
- **[MODIFICADO]** `firestore.rules`:
  - Reglas complejas adaptadas para aceptar validación híbrida (Rol base + `customPermissions`).
  - Uso de checkeo `hasPermission` y funciones utilitarias en Rules (getOverrides).

## 📅 9 de Marzo, 2026

### 🐛 Corrección de Errores (Persistencia de Viajes)

- **[FIX]** **Persistencia y Visualización de Viajes:**
  - Se detectó que la consulta `collectionGroup` en Firestore fallaba al intentar filtrar por `__name__` usando solo el UID (debido a que requiere la ruta completa).
  - **Cambios realizados:**
    - Se agregó el campo `uid` explícito a la interfaz `Participant` en `src/types/tripio.ts`.
    - Se actualizó `createTrip.ts` para guardar el `uid` del usuario en el documento del participante al crear un viaje.
    - Se modificó `getTrips.ts` para que la consulta `collectionGroup("participants")` filtre por el campo `uid` en lugar de `__name__`.
  - **Importante:** Esto resuelve el problema donde el usuario creaba un viaje pero este no aparecía en la lista de "Mis Viajes" al recargar.

## 📅 11 de Marzo, 2026

### 📝 Workflows y Automatización

- **[MODIFICADO]** [`.agent/workflows/nuevo-proyecto.md`](file:///c:/Users/Maza/Documents/Programacion%20IA/Proyectos/Tripio/.agent/workflows/nuevo-proyecto.md):
  - Se eliminó la integración con Taskmaster y el comando `git init` automático.
  - Se implementó la creación condicional de un documento de "Próximos Pasos" si falta información clave.
  - Se estableció que el uso de Git sea opcional y quede a discreción del usuario.
  - Se actualizaron las instrucciones para alinearse con la política de documentación obligatoria del DT.
