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

Las variables se declaran como tripleta RGB sin `rgb()` envolvente (ej: `--bg: 10 14 23;`), para poder aplicar opacidad con la sintaxis de Tailwind `rgb(var(--bg) / <alpha-value>)`. Por eso en el código se ven usos como `bg-surface/40` (surface al 40% de opacidad); el color resultante en pantalla se ve distinto al valor puro de la tabla porque está mezclado con lo que hay detrás.

## Nota sobre la validación

Estos valores fueron extraídos directamente del archivo `styles.css` del boceto (fuente de verdad), no aproximados visualmente. Coinciden con los valores que había pasado Ángel para `--bg`, `--brand`, `--accent`, `--ink` y `--mute`.

**Pendiente:** validar en equipo antes de empezar a maquetar (segundo criterio de aceptación de LC-006).