# Design Tokens — LinkinCode

Extraídos directamente del `:root` y `[data-theme="light"]` del CSS del boceto (`styles.css`). Estos son los valores oficiales que todo el equipo debe usar al maquetar, sin volver a inventarlos ni aproximarlos.

## Modo oscuro (default)

| Variable    | RGB              | Hex       | Uso                                                    |
|-------------|-------------------|-----------|---------------------------------------------------------|
| `--bg`      | `10 14 23`        | `#0A0E17` | Fondo general de la página                              |
| `--surface` | `17 24 39`        | `#111827` | Fondo de cards, secciones y superficies elevadas         |
| `--brand`   | `59 130 246`      | `#3B82F6` | Color primario (botones, links activos, acentos azules)  |
| `--accent`  | `6 182 212`       | `#06B6D4` | Color secundario/acento (badges, íconos, degradados)     |
| `--ink`     | `241 245 249`     | `#F1F5F9` | Texto principal                                          |
| `--mute`    | `148 163 184`     | `#94A3B8` | Texto secundario / descripciones                         |
| `--line`    | `30 41 59`        | `#1E293B` | Bordes y separadores sutiles                             |

## Modo claro

| Variable    | RGB              | Hex       | Uso                                                    |
|-------------|-------------------|-----------|---------------------------------------------------------|
| `--bg`      | `248 250 252`     | `#F8FAFC` | Fondo general de la página                              |
| `--surface` | `239 246 255`     | `#EFF6FF` | Fondo de cards, secciones y superficies elevadas         |
| `--brand`   | `37 99 235`       | `#2563EB` | Color primario                                           |
| `--accent`  | `8 145 178`       | `#0891B2` | Color secundario/acento                                  |
| `--ink`     | `15 23 42`        | `#0F172A` | Texto principal                                          |
| `--mute`    | `71 85 105`       | `#475569` | Texto secundario / descripciones                         |
| `--line`    | `226 232 240`     | `#E2E8F0` | Bordes y separadores sutiles                             |

## Tokens adicionales (usados en navbar y marquee de tecnologías)

| Variable      | Oscuro (RGB / Hex)              | Claro (RGB / Hex)                | Uso                                      |
|---------------|----------------------------------|-----------------------------------|-------------------------------------------|
| `--nav-bg`    | `4 6 12` / `#04060C`             | `255 255 255` / `#FFFFFF`         | Fondo del navbar fijo                     |
| `--nav-line`  | `59 130 246` / `#3B82F6`         | `37 99 235` / `#2563EB`           | Borde del navbar                          |
| `--pill-bg`   | `10 14 23` / `#0A0E17`           | `255 255 255` / `#FFFFFF`         | Fondo de los "pills" del marquee de tech  |
| `--pill-glow` | `56 189 248` / `#38BDF8`         | `37 99 235` / `#2563EB`           | Resplandor/glow de los pills              |

## Formato de uso

Las variables se declaran **ya envueltas en `rgb()`** (ej: `--bg: rgb(10 14 23);`), no como tripleta cruda.

Esto es compatible con las utilidades de opacidad de Tailwind (`bg-surface/40`, `shadow-brand/30`, etc.) sin ningún ajuste adicional: Tailwind v4 resuelve la opacidad internamente con `color-mix()` y no necesita que la variable venga "pelada".

**Importante:** si necesitás aplicar opacidad a una variable en CSS plano (fuera de una utilidad de Tailwind, por ejemplo en un `box-shadow` o `background` escrito a mano), **no uses el patrón viejo `rgb(var(--x) / 0.35)`** — con el formato actual de las variables eso genera `rgb(rgb(...) / 0.35)`, que es sintaxis inválida y falla en silencio (el navegador ignora la propiedad completa).

Usá en su lugar:
```css
color-mix(in srgb, var(--brand) 35%, transparent)
```

Ver `.browser-frame` en `index.css` como referencia (bug corregido en LC-011).

## Nota sobre la validación

Estos valores fueron extraídos directamente del archivo `styles.css` del boceto (fuente de verdad), no aproximados visualmente. Coinciden con los valores que había pasado Ángel para `--bg`, `--brand`, `--accent`, `--ink` y `--mute`.

**Pendiente:** validar en equipo antes de empezar a maquetar (segundo criterio de aceptación de LC-006).