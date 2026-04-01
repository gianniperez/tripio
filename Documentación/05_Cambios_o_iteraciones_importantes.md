# Registro de Cambios e Iteraciones - Tripio

Este documento registra cronológicamente las modificaciones técnicas, arquitectónicas y de documentación realizadas durante la jornada.

## 22 de Marzo, 2026 - Restructuración de SRD y Simplificación de Data Model

Durante la lectura y auditoría del documento funcional, se aclararon los siguientes puntos vitales dictaminados por el Product Owner:

- **Colecciones Espejo Confirmadas:** Se decide abandonar la idea de una única colección mutable de propuestas, y se confirma la estructura de doble colección (`_proposals` y `_confirmed`) por cada módulo. Cuando una propuesta se aprueba, esta transiciona a la colección de confirmados de su respectivo módulo.
- **Eliminación del sistema de Tareas (Tasks):** Se suprime la complejidad innecesaria de generar "Tareas" vinculadas. En su lugar, el estado y responsabilidad se manejan directamente sobre los `inventory_items` u otros componentes usando campos como `assignedTo` y `status`.
- **Estructura de Gastos (Splitwise-style):** El documento `costs` de Firestore se modeló detallando un Map/Array para deudas exactas (`paidBy` y `splitTo`) habilitando el _split variable_ y permitiendo cuentas asimétricas en la PWA en lugar de divisiones equitativas obligatorias.
- **Transporte y Capacidad:** La limitación de capacidad (`Error 409`) se aplicará a un transporte directamente sobre la subcolección de Vehículos Confirmados (los usuarios hacen join).
