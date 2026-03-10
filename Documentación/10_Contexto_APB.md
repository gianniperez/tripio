# 🎓 Antigravity Learn: Arquitectura Feature-Sliced y Sincronización Remota

## 🛠️ ¿Qué se analizó?

Se analizó el archivo `09_Contexto_del_sistema.md`, el cual funciona como el mapa técnico y arquitectónico oficial del proyecto **Tripio**. Este documento detalla cómo está estructurado el código base, qué tecnologías hacen que funcione, y cómo viaja la información desde la base de datos hasta lo que ve el usuario en pantalla. Recientemente lo actualizamos para reflejar que el proyecto dejó de ser una plantilla vacía y ahora tiene features reales de las Fases 1 y 2 del MVP.

## ⚙️ ¿Cómo funciona?

El proyecto Tripio se sostiene sobre dos pilares arquitectónicos principales:

1.  **A nivel de Carpetas (Feature-Sliced Design - FSD):** En lugar de agrupar todos los componentes visuales por un lado, y todas las funciones lógicas por otro, el código se divide por "pedazos del negocio" o *Features*. Por ejemplo, todo lo que respecta a "Finanzas" (sus vistas, sus componentes como el `AddExpenseModal`, su manipulación de base de datos) vive junto en la carpeta `src/features/finances`.
2.  **A nivel de Datos (Sincronización en Tiempo Real):** Tripio casi no tiene un "estado global" tradicional en la memoria del navegador. En cambio, usa Firebase Firestore conectado a **TanStack Query**. La aplicación "escucha" los cambios en la base de datos directamente y reacciona de forma automática, validando la caché local contra la nube para que todos los participantes del viaje vean los datos actualizados al mismo tiempo.

## 🧠 ¿Por qué es así?

*   **¿Por qué FSD?** A medida que Tripio crezca (sumando Itinerario, Finanzas, Propuestas, Inventario), estructurar por negocio evita que las carpetas genéricas se vuelvan un caos. Si hay un bug en Finanzas, sabremos exactamente a qué única carpeta del proyecto ir a buscar sin romper accidentalmente el código de Autenticación.
*   **¿Por qué Sincronización Remota Directa?** Administrar viajes es inherentemente colaborativo. Si un usuario sube un ticket de gasto, los demás deben verlo reflejado enseguida. Apoyarse en TanStack Query y Firebase OnSnapshot le delega el trabajo duro (mantener los datos estables, manejar errores de carga, refrescar en segundo plano) a la herramienta, permitiéndole a Tripio enfocarse estrictamente en dibujar la UI.

## 📖 Concepto clave: **Single Source of Truth (SSOT)**

SSOT o "Única Fuente de Verdad" es el concepto de que cada dato en tu sistema debe crearse o guardarse en **un solo lugar** autoritativo. En Tripio, la UI no intenta llevar su propia cuenta de matemáticas por separado. Si la UI dice que un usuario tiene "1500 pesos en gastos", es porque Firebase dice que tiene "1500 pesos en gastos". La interfaz de usuario actúa como un simple "espejo" de lo que dice la base de datos en tiempo real, minimizando severamente los bugs de desincronización (donde la pantalla dice "X" pero el sistema en realidad hizo "Y").

## ✅ Impacto en el proyecto

*   **Escalabilidad Estricta:** Nuevos programadores o agentes de IA podrán agregar módulos enteros (como Inventario o Chat) simplemente añadiendo una nueva subcarpeta en `features/`, sin riesgo de estropear módulos existentes.
*   **Experiencia Multipantalla fluida:** Gracias a la suscripción en tiempo real de Firebase y cache de React Query, la app se sentirá tan ágil como una app nativa instalada en el dispositivo.

## 📚 Definiciones

*   **FSD (Feature-Sliced Design):** Un patrón arquitectónico de Frontend que divide el código en capas según su responsabilidad de negocio.
*   **TanStack Query / React Query:** Una poderosa librería para "fetching" (buscar datos). En vez de que vos tengas que escribir toda la lógica temporal ("cargando", "error", "listo"), la librería lo maneja por vos y cachea (guarda en memoria brevemente) los datos para evitar pedirle lo mismo a la base de datos dos veces seguidas.
*   **onSnapshot (Firebase):** Una función nativa de Firestore que abre un "tubo" directo entre la base de datos y tu frontend. Cada vez que algo cambie remotamente allá, el tubo envía el dato nuevo automáticamente a la app.
*   **State Management (Manejo de Estado):** Forma técnica de decir "cómo y dónde guarda el sistema la memoria de lo que está pasando" (ej: 'El modal está abierto', 'El usuario Juan está logueado').
*   **PWA (Progressive Web App):** Una aplicación web que, mediante ciertas configuraciones estandarizadas (como un "Manifest" y un "Service Worker"), permite ser instalada en el teléfono celular comportándose casi igual a una app de las tiendas como Google Play o App Store.
