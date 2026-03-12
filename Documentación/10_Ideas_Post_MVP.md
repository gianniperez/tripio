# Ideas Post-MVP - Tripio 🚀

Este documento centraliza las ideas, sugerencias y features propuestas para el desarrollo de Tripio una vez que el MVP (Minimum Viable Product) esté consolidado.

## 🗺️ Geo-Localización y Mapas

### 1. Integración con Google Maps API

- **Autocompletado de Destinos:** Implementar `Google Places Autocomplete` en el formulario de creación de viajes y propuestas.
- **Vista de Mapa Grupal:** Un mapa interactivo que muestre todos los puntos confirmados del itinerario y las propuestas activas.
- **Cálculo de Rutas:** Integración con `Directions API` para estimar tiempos de viaje entre puntos del itinerario (especialmente útil para la logística de transporte).

### 2. "Cerca de mí" (Exploración Local)

- Sugerencias dinámicas de actividades o puntos de interés (POIs) basados en la ubicación actual del grupo durante el viaje.

---

## 📅 Sincronización y Notificaciones

### 3. Sincronización con Calendarios Externos

- Exportación de eventos confirmados a Google Calendar, Apple Calendar e iCal.
- Suscripción vía URL para que los cambios en Tripio se reflejen automáticamente en el calendario personal del usuario.

### 4. Notificaciones Push (Web Push API)

- Alertas en tiempo real para:
  - Nuevas propuestas o encuestas creadas.
  - Resultados finales de una votación.
  - Recordatorios de tareas asignadas (deadlines).
  - Alertas de proximidad de eventos en el Timeline.

---

## 📶 Conectividad y Performance

### Integración e Infraestructura

- **Firebase Storage:** Implementar la subida de imágenes locales y archivos adjuntos (como fotos de portada grupales o tickets) configurando un Storage seguro en Firebase con reglas de CORS y autenticación.
- **Google Maps:** Mejorar la UX conectando la ubicación de las propuestas con la API de Google Maps (Geocoding / Places) para ubicar rápidamente destinos y alojamientos.
- **Service Workers (Offline Support):** Implementación de lectura cacheada para permitir acceder a los itinerarios y datos vitales del viaje sin conexión a internet.
- **Notificaciones Push:** Transición del sistema actual de notificaciones por email estructurado a notificaciones push nativas en el dispositivo.
- **Cola de sincronización:** Permitir cargar gastos o checks de tareas offline que se sincronicen al recuperar conexión.

### 6. Exportación a PDF / Imprimible

- Generador de "Libreta de Viaje" en PDF con el resumen de alojamientos, transportes y el timeline completo para llevar en formato físico.

---

## 👥 Colaboración y Social

### 7. Chat de Viaje Integrado

- Un hilo de chat por viaje para centralizar la comunicación y evitar depender de grupos externos (WhatsApp/Telegram).
- Posibilidad de "anclar" mensajes importantes desde el chat directamente al Timeline o Logística.

### 8. Gestión de Fotos Grupal

- Un feed de fotos compartido para el viaje, donde todos puedan subir sus mejores capturas, organizadas por día del itinerario.

---

## 💰 Finanzas Avanzadas

### 9. Split de Gastos (División de Deudas)

- Módulo para registrar quién pagó qué y calcular automáticamente quién le debe a quién (estilo Splitwise integrado).
- Conversión de moneda multi-divisa con tipos de cambio actualizados.

### 10. Dashboard Grupal de Finanzas (Insights)

- Vista global para entender en qué está gastando más dinero el grupo como entidad (alojamiento, comida, etc).
- Gráficos y analíticas grupales post-viaje.

---

## 🏗️ Refactorings e Ideas Arquitectónicas (11/03/2026)

- [ ] **Módulo de Finanzas (Carga manual):** Rehabilitar la capacidad de sumar gastos directamente desde la pestaña de Finanzas (actualmente restringido a propuestas automáticas).
- [ ] **Revisión de Arquitectura de Destinos:** Evaluar si tiene sentido dejar el "Destino" simplemente como un campo adicional dentro de la propuesta de "Alojamiento", eliminando la entidad independiente o el tipo de propuesta "Destino".

---

## 🎮 Gamificación

### 11. Mascota y Logros del Grupo

- Un guía lúdico (mascota de Tripio) que celebre hitos (ej: "¡Logística completa!", "¡El primer gasto registrado!").
- Badges por roles (ej: "El Rey del RSVP", "El Conductor Designado", "El Optimizer del Budget").
