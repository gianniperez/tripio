# Guía de Estilos y Componentes - Concepto "Vibrant Explorer" ✈️

Este documento es la **Fuente de Verdad** para la interfaz de Tripio. Antigravity y cualquier colaborador debe consultar este archivo antes de realizar cambios en la UI para asegurar coherencia visual.

---

## 🎨 Paleta de Colores (Variables CSS)

La paleta se gestiona a través de variables en `globals.css`. **Siempre usar las variables de Tailwind/CSS** en lugar de valores hexadecimales manuales.

### 1. Colores de Marca (Core)

- **`--color-primary` (Vibrante):** Color principal para acciones, botones destacados y estados activos.
- **`--color-secondary` (Estructura):** Color para la arquitectura de navegación (Teals). Posee variantes como `light`, `dark` y `deep`.
- **`--color-background` (Lienzo):** Fondo base de la aplicación.
- **`--color-main` (Contraste):** Color para el texto principal y lectura.

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

---

## 🧱 Componentes Reutilizables

| Componente             | Regla de Estilo                                                                                                    |
| :--------------------- | :----------------------------------------------------------------------------------------------------------------- |
| **`NeumorphicButton`** | Padding generoso (`px-6 py-3`), esquinas `2xl`, sombra neumórfica. Texto siempre en `Nunito Bold`.                 |
| **`NeumorphicCard`**   | Fondo igual al background (`var(--color-background)`), sombra neumórfica exterior. Padding interno estándar `p-6`. |
| **`NeumorphicInput`**  | Estilo `inset` suave con bordes `2xl`. Texto `Inter`.                                                              |

---

## 📏 Espaciado y Layout

- **Padding Global:** Las vistas deben mantener un margen mínimo de `p-4` (Mobile) y hasta `p-8` (Desktop).
- **Consistencia:** No usar valores de espaciado ad-hoc. Seguir la escala de Tailwind (`-4`, `-6`, `-8`).

> [!IMPORTANT]
> **No inventar nuevos estilos.** Si un componente no encaja en estas reglas, debe proponerse un ajuste a esta guía antes de implementarse. La reutilización es prioridad absoluta.

---

## 🛑 Política de Componentización Restrictiva (Anexo)

Para mantener un código limpio, con escala predecible y evitar deuda técnica UI, rige la siguiente política organizativa de estricto cumplimiento:

**1. Prohibición de HTML Crudo para UI Interactiva**
Queda estrictamente prohibido el uso directo de elementos HTML interactivos básicos (como `<button>`, `<input>`, `<select>`, o contenedores con clases crudas de sombra y bordes) directamente dentro del código funcional o vistas de la aplicación (`src/features` o `src/app`).

**2. Uso de la Suite Neumórfica**
Toda interacción debe realizarse utilizando los componentes encapsulados de nuestro Design System (ej. `NeumorphicButton`, `NeumorphicInput`, `NeumorphicCard`), ubicados en `src/components/neumorphic`.

**3. Auditoría de Coherencia Visual (Completada - Fase 4)**
Se realizó una revisión de la suite neumórfica para asegurar que todos los componentes utilicen los tokens CSS globales en lugar de valores fijos (hardcodeados).

- **`bg-background` vs `bg-white`**: Componentes como `NeumorphicCard` y las vistas principales deben utilizar el token CSS `--color-background` (`bg-background` en Tailwind) en lugar del valor puro `bg-white` para respetar el tono *cream* base (#FFFAF5).
- **Componentes base**: Se estandarizó el uso de `<NeumorphicButton>`, `<NeumorphicInput>` y `<NeumorphicCard>` en vistas como `ParticipantsPanel` y `LogisticsClient`, eliminando elementos HTML crudos.

**4. Extensibilidad ante Carencias**
Si un diseño o funcionalidad requiere un comportamiento no contemplado por los componentes del Design System preexistentes:

- **No** se debe abandonar el componente a favor de un elemento HTML con clases ad-hoc.
- **Se debe** iterar y refactorizar el componente Neumórfico base para permitir su extensión (por ejemplo, asegurando que exponga de manera limpia todas sus _props* nativas).

**4. Validación en CI**
Las integraciones continuas y auditorías automáticas marcarán como error sintáctico la presencia de botones, inputs y tarjetas que no deriven de nuestra librería base.
