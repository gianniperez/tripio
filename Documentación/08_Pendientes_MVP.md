# Pendientes para el Lanzamiento del MVP - Tripio

Este documento centraliza las tareas técnicas, de diseño y de producto necesarias para iniciar la fase de desarrollo del MVP, basándose en el **SRD v2.0**.

---

## 1. Infraestructura y Setup Técnico

- [ ] **Configuración de Proyecto Next.js:**
  - Inicializar el repositorio con la última versión de Next.js (App Router).
  - Configurar ESLint y Prettier bajo estándares de Antigravity.
- [ ] **Configuración de Firebase:**
  - Crear proyecto en la Consola de Firebase.
  - Habilitar **Firebase Auth** (Google y Email/Password).
  - Habilitar **Cloud Firestore** en modo de prueba.
  - Habilitar **Firebase Hosting** para el despliegue de la PWA.
- [ ] **Arquitectura de Datos (Firestore Schema):**
  - Definir el esquema de documentos para las colecciones `trips`, `participations`, `events`, `inventory` y `tasks`.
  - Implementar las Reglas de Seguridad básicas de Firestore coincidiendo con los roles definidos.

---

## 2. Diseño de Interfaz (UX/UI)

- [ ] **Sistema de Diseño (Tokens):**
  - Definir paleta de colores (Soft Modern & Lúdico).
  - Configurar tipografía (Outfit o similar geométrica).
  - Crear librería de componentes base (Botones rounded-2xl, tarjetas con sombras difusas).
- [ ] **Mockups de Pantallas Clave:**
  - **Dashboard del Viaje:** Vista del "Total Cost" y estado actual.
  - **Planificador Dual:** Maquetación del switch entre Calendario y Timeline.
  - **Gestión de Gastos:** Pantalla de configuración de los 3 niveles económicos.
- [ ] **Identidad Visual MVP:**
  - Logo provisional y favicon lúdico.

---

## 3. Lógica de Negocio y Funcionalidades Core

- [ ] **Motor de Cálculo del "Total Cost":**
  - Función de servidor/cliente que compute `Fijos/n + Proyectados/n + (Diarios * días)`.
  - Implementar watcher para disparar la alerta de `Budget Limit`.
- [ ] **Módulo de Vínculos Inteligentes:**
  - Lógica que permita "spawnear" una tarea desde un ítem de inventario o un evento.
- [ ] **Flujo de Invitación:**
  - Generación de "Magic Links" dinámicos para unir participantes a un contenedor de viaje.

---

## 4. Definiciones de Producto Pendientes

- [ ] **Definir frecuencia de alertas:** ¿Las notificaciones por exceso de presupuesto son push inmediatas o se agrupan en un resumen diario por mail?
- [ ] **Confirmar Módulo de Encuestas:** Validar si el sistema de votación (para destino/fecha) entra en el primer sprint o se posterga para la Phase 2.
- [ ] **Validar pasarela de mails:** Elegir proveedor para las notificaciones del MVP (ej. Firebase Extension: Trigger Email o Resend).

---

## 5. Próximo Paso Sugerido (Sprint 0)

1. **Kick-off Técnico:** Creación del proyecto y conexión con Firebase.
2. **Modelado:** Escritura de los esquemas NoSQL finales.
3. **Layout General:** Header y NavBar de la PWA funcionando.
