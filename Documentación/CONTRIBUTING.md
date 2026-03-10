# Guía de Contribución - Tripio 🚀

¡Bienvenido al equipo de Tripio! Para mantener el código ordenado y evitar "pisarnos" el trabajo entre compañeros, seguimos este flujo de trabajo basado en ramas (Git Flow simplificado).

## 🌳 Estrategia de Ramas

1. **Main**: La rama principal siempre debe tener código estable y funcional. **Nunca trabajes directamente sobre `main`**.
2. **Ramas de Funcionalidad (`feature/`)**: Cada nueva tarea o mejora debe tener su propia rama.
   - Ejemplo: `feature/login-google`, `feature/rediseño-sidebar`.
3. **Ramas de Corrección (`bugfix/`)**: Para arreglar errores específicos.
   - Ejemplo: `bugfix/error-registro-fecha`.

---

## 🛠️ Flujo de Trabajo Diario

1. **Actualiza tu local**: Antes de empezar, asegúrate de tener lo último de `main`.

   ```bash
   git checkout main
   git pull origin main
   ```

2. **Crea tu rama**:

   ```bash
   git checkout -b feature/nombre-de-tu-tarea
   ```

3. **Haz tus cambios y commits**: Realiza commits pequeños y descriptivos.
4. **Sube tu rama**:

   ```bash
   git push origin feature/nombre-de-tu-tarea
   ```

5. **Crea un Pull Request (PR)**: En GitHub, solicita unir tu rama a `main`. Tu compañero debe revisar el código antes del merge.

---

## ⚔️ Cómo resolver conflictos (Cuando se "pisa" el mismo archivo)

Si tú y tu compañero editan las mismas líneas del mismo archivo, Git no sabrá cuál elegir. Sigue estos pasos para solucionarlo:

### 1. Trae los cambios de Main a tu rama

Mientras estás en tu rama de trabajo:

```bash
git fetch origin
git merge origin/main
```

_Si hay conflictos, Git te avisará qué archivos están afectados._

### 2. Identifica y resuelve manualmente

Abre los archivos marcados con conflictos en VS Code. Verás etiquetas como estas:

```text
const color = "verde"; (Cambios en Main / de tu compañero)
```

- **Acepta el cambio entrante**, **Acepta el cambio actual** o **Combina ambos** manualmente borrando las etiquetas de Git.

### 3. Finaliza la resolución

Una vez corregido el archivo:

```bash
git add .
git commit -m "chore: resuelve conflictos con main"
git push origin feature/tu-rama
```

---

## ✅ Checklist antes de un PR

- [ ] ¿El código compila sin errores? (`npm run dev`)
- [ ] ¿Pasaste el linter para que el código esté limpio? (`npm run lint`)
- [ ] ¿Eliminaste `console.log` o variables no usadas?
- [ ] ¿El diseño es responsivo (Mobile y Desktop)?

---

"Si quieres ir rápido, camina solo. Si quieres llegar lejos, ve acompañado." ✈️
