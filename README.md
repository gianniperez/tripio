# Tripio

## Introducción

**Tripio** es una PWA (Progressive Web App) colaborativa diseñada para resolver el problema universal de organizar viajes grupales (amigos, familiares o parejas).

**¿Qué problema resuelve?**
Evita el caos de los grupos de WhatsApp, hojas de cálculo desactualizadas y deudas cruzadas. Tripio centraliza la logística de transporte, alojamiento, división de tareas (qué lleva quién) y el control estricto del presupuesto o "vaquita" de los participantes en tiempo real.

**¿Cómo está diseñado el código?**
A nivel técnico, Tripio está pensado para ser **altamente escalable y mantenible**. Utilizamos una arquitectura llamada **Feature-Sliced Design (FSD)**. En lugar de agrupar archivos por su "tipo", agrupamos las cosas por **Funcionalidad (Feature)**. Así, todo lo relacionado al "Módulo de Economía" vive en su propia burbuja y no contamina el módulo de "Logística" ni rompe el resto del sitio.

---

## Features & Stack Tecnológico

- **[Next.js 16 (App Router)](https://nextjs.org/)**: El motor principal de la web. Permite que nuestra página cargue rapidísimo y tenga un SEO perfecto.
- **[Tailwind CSS v4](https://tailwindcss.com/)**: El sistema de estilos utilitarios. Nos permite dar color y forma escribiendo clases directamente en el HTML en lugar de crear infinitos archivos `.css`.
- **[TanStack Query (React Query)](https://tanstack.com/query/latest)**: Nuestro conector con el back-end. Trae datos de Internet automáticamente, los guarda en memoria (caché) para no volver a pedirlos y muestra estados de "cargando" sin esfuerzo.
- **[Zustand](https://zustand-demo.pmnd.rs/)**: Nuestro "cerebro" para la interfaz. Si necesitas recordar que un menú está abierto o el usuario eligió el Modo Oscuro en múltiples páginas, Zustand lo guarda.
- **[Plop.js](https://plopjs.com/)**: Un generador de archivos mágicos. Para que no tengas que crear carpetas y archivos a mano, este bot lo hace por ti.
- **[Vitest & Testing Library](https://vitest.dev/)**: Sistema para escribir pruebas automáticas y asegurar que no rompimos nada con código nuevo.

---

## Arquitectura del Proyecto (FSD)

```text
src/
 ├── app/              # Las pantallas o Páginas Web (Rutas)
 ├── components/       # Componentes Genéricos (Botones base, Modales universales)
 ├── features/         # Funcionalidades del negocio (Ej. Login, Checkout)
 ├── hooks/            # Funciones reutilizables generales
 ├── providers/        # Configuraciones globales (React Query y Zustand)
 ├── types/            # Definiciones de TypeScript
 └── utils/            # Funciones matemáticas o formateadores de fechas genéricos
```

### Regla de oro: Features vs Components

- Si un botón dice "Comprar Ahora" y llama a un sistema de pagos, vive dentro de `src/features/pagos/`.
- Si un botón es solo un rectángulo azul que hace algo genérico cuando lo clickeas, vive en `src/components/Button/`.

---

## Instalación y Configuración Inicial

Para arrancar el proyecto en tu computadora, ejecuta:

```bash
# 1. Instalar todas las dependencias y librerías necesarias
npm install

# 2. Iniciar el servidor de desarrollo (Levantar la web)
npm run dev
```

Luego abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## Scripts Disponibles

El superpoder de este proyecto son los comandos automatizados. Ejecútalos desde la terminal:

### `npm run dev`

Inicia el entorno de desarrollo de la app.

### `npm run generate` (¡Importante!)

**Nunca crees componentes ni carpetas a mano.**
Al correr este comando, la consola te preguntará qué deseas crear (un Componente o una Feature) y autogenerará todos los archivos, importaciones y tests necesarios respetando las reglas de la arquitectura.
_Usa esto siempre que empieces una pieza nueva de UI._

### `npm run lint` / `npx prettier --write .`

Buscan errores escondidos en el código y formatean todo para que luzca bonito y estandarizado.

### `npm run test`

Corre el robot de pruebas automáticas para confirmar que la aplicación no tiene errores lógicos.

---

## Reglas de Calidad y Git Hooks (Husky)

Tenemos un guardián en el proyecto para asegurar que el código siempre esté limpio. Este proyecto usa **Husky** y **lint-staged**.

**¿Qué significa esto?**
Cuando intentes hacer un commit (`git commit -m "mi cambio"`), la computadora pausará unos segundos, revisará que tu código no tenga errores groseros y lo ordenará mágicamente.

🚨 **Si tu código está muy roto**, el guardián de Husky te dirá _"Commit Failed"_ y abortará el guardado. **No se rompió Git**, simplemente debes leer el error en la terminal, corregirlo en tu código, volver a hacer `git add` e intentar el commit de nuevo.

---

## ❌ Contra-Ejemplo de Convenciones de Código (Lo que NO debes hacer)

Para entender mejor cómo programar aquí, veamos un ejemplo de importaciones. Usamos algo llamado "Archivos Barril" (`index.ts`) generados por Plop para que todo se lea limpio.

🔴 **MAL (No lo hagas)**: Ir a bucear a las profundidades de la carpeta buscando el archivo exacto.

```tsx
import ComponenteRandom from "@/features/auth/components/ComponenteRandom/ComponenteRandom.tsx";
```

🟢 **BIEN (Usa esto)**: Importar desde la puerta principal de la feature o componente.

```tsx
import { ComponenteRandom } from "@/features/auth";
```

🔴 **MAL (No lo hagas)**: Poner estilos directos o usar CSS viejo.

```tsx
<div style={{ backgroundColor: "red", margin: "10px" }}>Hola</div>
```

🟢 **BIEN (Usa esto)**: Tailwind CSS utilitario.

```tsx
<div className="bg-red-500 m-[10px]">Hola</div>
```
