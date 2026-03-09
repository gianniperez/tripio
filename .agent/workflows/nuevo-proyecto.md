---
description: Inicializar un nuevo proyecto con DT y Taskmaster
---

# Nuevo Proyecto

Este workflow automatiza la creación e inicialización de un nuevo proyecto, instalándole la configuración del Director Técnico (DT) y preparando la base de datos de tareas de Taskmaster.

1. **Pedir el nombre del proyecto**: Si el usuario no especificó un nombre en su mensaje inicial, pregúntale cómo quiere llamar a su proyecto.

2. **Crear carpeta del proyecto**: Utiliza el comando de terminal para crear el directorio en la raíz de la zona de proyectos actual.

3. **Copiar configuración del DT**:
   - Copia recursivamente la carpeta `.agent` global hacia el nuevo proyecto.
   - Copia recursivamente la carpeta `.antigravity` global hacia el nuevo proyecto.

4. **Inicializar Taskmaster**:
   - Crea una carpeta `.taskmaster/tasks` dentro del nuevo proyecto.
   - Crea un archivo `tasks.json` con la estructura inicial:

   ```json
   {
     "tasks": [],
     "nextId": 1
   }
   ```

5. **Confirmar creación**: Informa al usuario que su proyecto está listo y que ahora puede entrar a la carpeta para empezar a trabajar con el DT y Taskmaster activos.
