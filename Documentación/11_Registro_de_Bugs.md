# Registro de Bugs y Problemas (Issues Tracker)

Este documento mantiene un registro de los bugs identificados en la aplicación, su estado actual y cualquier información relevante para su resolución.

## 🐛 Bugs Activos

_Ninguno por el momento._

---

## ✅ Bugs Resueltos

### 1. Los viajes recién creados no aparecen en la lista ("Mis Viajes" vacío)

- **Estado**: Resuelto.
- **Descripción**: Al crear un nuevo viaje, la mutación era exitosa, pero la vista de "Mis Viajes" se quedaba cargando o recargaba vacía.
- **Causa raíz**: Falta de un **Índice de Grupo de Colecciones (Collection Group Index)** en Firestore para el campo `uid` en la subcolección `participants`.
- **Solución técnica**:
  - Se actualizó el modelo `Participant` para incluir un campo `uid`.
  - Se modificó la query en `getTrips.ts` para filtrar por este nuevo campo.
  - Se creó manualmente el índice en la Consola de Firebase.
- **Resultado**: Los viajes ahora se guardan y se listan correctamente.
