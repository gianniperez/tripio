# Guía de Estilos y Componentes - Concepto "Vibrant Explorer" ✈️

Este documento es la **Fuente de Verdad** para la interfaz de Tripio. Antigravity y cualquier colaborador debe consultar este archivo antes de realizar cambios en la UI para asegurar coherencia visual.

---

## 🎨 Paleta de Colores (Variables CSS)

La paleta se gestiona a través de variables en `globals.css`. **Siempre usar las variables de Tailwind/CSS** en lugar de valores hexadecimales manuales.

### 1. Colores de Marca (Core)

- **`--color-primary` (Vibrante):** Color principal para acciones, botones destacados y estados activos.
- **`--color-secondary` (Estructura):** Color para la arquitectura de navegación (Teals). Posee variantes como `light`, `dark` y `deep`.
- **`--color-background` (Lienzo):** Fondo base de la aplicación.
- **`--color-text-main` (Contraste):** Color para el texto principal y lectura.

### 2. Estados y Acentos

- **`--color-success`:** Para estados positivos y confirmaciones.
- **`--color-danger`:** Para errores, alertas críticas y eliminaciones.

---

## ✍️ Tipografía

- **Nunito (Headings & UI):** San-serif redondeada. Se usa para **Títulos, Botones y elementos lúdicos** para dar personalidad.
- **Inter (Body/Context):** Máxima legibilidad. Se usa para **Descripciones, Tablas y lectura densa**.

---

## ✨ Forma y Profundidad (Neumorfismo Lúdico)

Tripio utiliza un **Neumorfismo Suave** para dar volumen sin saturar.

- **Border Radius:** `Rounded-2xl` (1.5rem / 24px) es la norma para tarjetas y contenedores.
- **Efecto de Sombra:** Doble sombra (luz arriba-izquierda `#ffffff`, sombra suave abajo-derecha `#e4e4e7`).
- **Estados Táctiles:** Al presionar (`:active`), la sombra debe volverse `inset` (hundido) para feedback físico.
- **Glassmorphism:** En Headers y SideSticky se usa un fondo blanco/crema con opacidad al 80% y `backdrop-blur-md`.

---

## 🧱 Componentes Reutilizables

| Componente                | Regla de Estilo                                                                                                    |
| :------------------------ | :----------------------------------------------------------------------------------------------------------------- |
| **`NeumorphicButton`**    | Padding generoso (`px-6 py-3`), esquinas `2xl`, sombra neumórfica. Texto siempre en `Nunito Bold`.                 |
| **`NeumorphicCard`**      | Fondo igual al background (`var(--color-background)`), sombra neumórfica exterior. Padding interno estándar `p-6`. |
| **`NeumorphicInput`**     | Estilo `inset` suave con bordes `2xl`. Texto `Inter`.                                                              |
| **`Widget` (ej Finance)** | Gradientes sutiles (ej: Naranja -> Amarillo) para destacar secciones críticas.                                     |

---

## 📏 Espaciado y Layout

- **Padding Global:** Las vistas deben mantener un margen mínimo de `p-4` (Mobile) y hasta `p-8` (Desktop).
- **Consistencia:** No usar valores de espaciado ad-hoc. Seguir la escala de Tailwind (`-4`, `-6`, `-8`).

> [!IMPORTANT]
> **No inventar nuevos estilos.** Si un componente no encaja en estas reglas, debe proponerse un ajuste a esta guía antes de implementarse. La reutilización es prioridad absoluta.
