# Automatic Design Validation Hook

Este archivo actúa como una **Directiva Crítica** para Antigravity. Se debe ejecutar automáticamente al detectar cualquier tarea relacionada con UI, CSS, Componentes o Diseño Frontend.

## Disparadores (Triggers)

- Modificación de archivos `.css`, `.scss`, `.tailwind`.
- Creación o edición de componentes UI (React, Vue, HTML).
- Tareas descritas con palabras clave: "estilo", "diseño", "layout", "interfaz", "colores".

## Reglas de Ejecución

1. **Validación de Fuente de Verdad**: Antes de proponer o escribir código, leer obligatoriamente `Documentación/12_Estilo_y_Componentes.md`.
2. **Consistencia**: Comparar la propuesta contra los estilos definidos.
3. **Prioridad de Reutilización**: Si existe un componente similar documentado, usar ese en lugar de crear uno nuevo.
4. **Reporte de Desviación**: Si la tarea requiere romper los estilos establecidos, se DEBE notificar al usuario en el `implementation_plan.md` justificando el motivo.

> [!IMPORTANT]
> El incumplimiento de esta directiva resultará en un fallo del "Hook de Diseño".
