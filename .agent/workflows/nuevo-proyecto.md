---
description: Inicializar un nuevo proyecto con DT, Taskmaster y estándar Antigravity
---

# Nuevo Proyecto

## Nuevo Proyecto (DT-Seed Template)

Este workflow automatiza la creación de un nuevo proyecto utilizando `DT-Seed` como plantilla base, asegurando que se cumplan los estándares técnicos y la política organizativa de documentación.

1. **Definición del Proyecto**:
   - Preguntar el **Nombre del proyecto** y la **Ruta donde se creará**.
   - Validar que el directorio no exista o esté vacío.

2. **Creación de Estructura Base**:
   - Crear el directorio raíz del proyecto.
   - Copiar las carpetas `.agent/` y `.antigravity/` desde `c:\Users\Maza\Documents\Programacion IA\DT-Seed` a la raíz del nuevo proyecto.

3. **Aplicación de Política Organizativa (RULE[user_global])**:
   - Copiar la carpeta `Documentación/` completa desde `DT-Seed`.

4. **Archivos de Soporte**:
   - Copiar `.gitignore`, `README.md` (plantilla) y la carpeta `docs/` (con `IDE-SETUP.md`) desde `DT-Seed`.
   - Personalizar el `README.md` con el nombre del nuevo proyecto.

5. **Documento de Próximos Pasos (Condicional)**:
   - Si el usuario **no proporcionó toda la información necesaria** durante la creación (ej. faltan objetivos claros, fechas o responsables):
     - Crear un archivo temporal `Proximos_Pasos.md` en la raíz con el siguiente contenido:

       ```markdown
       # Próximos Pasos - [Nombre del Proyecto]

       Este documento enumera las tareas iniciales necesarias para completar la configuración. **Una vez completadas todas las tareas, elimina este archivo.**

       ## 📋 Documentación Obligatoria (Política DT)

       - [ ] **Objetivos**: Completar `Documentación/Objetivos del proyecto.md`.
       - [ ] **Alcance**: Definir `Documentación/Alcances y entregables.md`.
       - [ ] **Cronograma**: Establecer hitos en `Documentación/Cronograma y fechas clave.md`.

       ## 🛠️ Configuración Técnica

       - [ ] **IDE Setup**: Seguir instrucciones en `docs/IDE-SETUP.md`.
       - [ ] **Git (Opcional)**: Ejecutar `git init` si se planea usar control de versiones.
       ```

   - Si el usuario **proporcionó toda la información**, NO crear este archivo.

6. **Finalización**:
   - Confirmar al usuario que el proyecto ha sido inicializado.
   - Recordar que el uso de Git es opcional y queda a criterio del usuario inicializarlo cuando lo desee.
