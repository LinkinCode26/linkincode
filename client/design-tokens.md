# Design Tokens — LinkinCode

Extraídos directamente del `:root` y `[data-theme="light"]` del CSS del boceto (`styles.css`). Estos son los valores oficiales que todo el equipo debe usar al maquetar, sin volver a inventarlos ni aproximarlos.

## Modo oscuro (default)

| Variable        | RGB            | Hex       | Uso                                                                    |
|-----------------|----------------|-----------|------------------------------------------------------------------------|
| `--bg`          | `10 14 23`     | `#0A0E17` | Fondo general de la página                                             |
| `--surface`     | `17 24 39`     | `#111827` | Fondo de cards, secciones y superficies elevadas                       |
| `--brand`       | `59 130 246`   | `#3B82F6` | Color primario (botones, links activos, acentos azules)                |
| `--accent`      | `6 182 212`    | `#06B6D4` | Color secundario/acento (badges, íconos, degradados)                   |
| `--ink`         | `241 245 249`  | `#F1F5F9` | Texto principal                                                        |
| `--mute`        | `148 163 184`  | `#94A3B8` | Texto secundario / descripciones                                       |
| `--line`        | `30 41 59`     | `#1E293B` | Bordes y separadores sutiles                                           |
| `--line-strong` | `100 116 139`  | `#64748B` | Borde de controles interactivos (inputs, botones outline, chips, tabs) |

## Modo claro

| Variable        | RGB            | Hex       | Uso                                                                    |
|-----------------|----------------|-----------|------------------------------------------------------------------------|
| `--bg`          | `248 250 252`  | `#F8FAFC` | Fondo general de la página                                             |
| `--surface`     | `239 246 255`  | `#EFF6FF` | Fondo de cards, secciones y superficies elevadas                       |
| `--brand`       | `37 99 235`    | `#2563EB` | Color primario                                                         |
| `--accent`      | `8 145 178`    | `#0891B2` | Color secundario/acento                                                |
| `--ink`         | `15 23 42`     | `#0F172A` | Texto principal                                                        |
| `--mute`        | `71 85 105`    | `#475569` | Texto secundario / descripciones                                       |
| `--line`        | `226 232 240`  | `#E2E8F0` | Bordes y separadores sutiles                                           |
| `--line-strong` | `100 116 139`  | `#64748B` | Borde de controles interactivos (inputs, botones outline, chips, tabs) |

## Tokens adicionales (usados en navbar y marquee de tecnologías)

| Variable      | Oscuro (RGB / Hex)       | Claro (RGB / Hex)         | Uso                                      |
|---------------|--------------------------|---------------------------|------------------------------------------|
| `--nav-bg`    | `4 6 12` / `#04060C`     | `255 255 255` / `#FFFFFF` | Fondo del navbar fijo                    |
| `--nav-line`  | `59 130 246` / `#3B82F6` | `37 99 235` / `#2563EB`   | Borde del navbar                         |
| `--pill-bg`   | `10 14 23` / `#0A0E17`   | `255 255 255` / `#FFFFFF` | Fondo de los "pills" del marquee de tech |
| `--pill-glow` | `56 189 248` / `#38BDF8` | `37 99 235` / `#2563EB`   | Resplandor/glow de los pills             |

## Bordes: `--line` vs `--line-strong`

`--line` es decorativo (separadores, cards, paneles, badges, bloques de código). Contra el fondo da ~1.2:1 en ambos temas, a propósito: separa sin pesar.

`--line-strong` es para todo control que el usuario manipula (inputs, selects, textareas, botones outline o de ícono, chips y tabs inactivos, swatches). WCAG 1.4.11 pide 3:1 para el borde de un componente de UI, y este valor lo cumple en los dos temas:

| Tema   | vs `--bg` | vs `--surface` |
|--------|-----------|----------------|
| Claro  | 4.55:1    | 4.37:1         |
| Oscuro | 4.06:1    | 3.73:1         |

Clase de Tailwind: `border-line-strong`.

No bajarle la opacidad a un borde interactivo: con `opacity-70` cae a ~2.6:1 y deja de cumplir. Hasta `opacity-90` (~3.7:1) se mantiene.



## Controles de estado y foco

### Chips y selects de estado (`LeadsPanel`)

El borde de un select de estado no usa un color con opacidad baja (`border-brand/30`):
sobre `--surface` clara da ~1.5:1 y no cumple WCAG 1.4.11 (3:1). Tampoco alcanza con
subir la opacidad: `amber-500` y `emerald-500` puros dan ~2–2.5:1 sobre fondo claro
aun al 100%.

Regla: el borde usa el color del texto con `border-current`. Esos colores dan entre
4.8:1 y 10.6:1 contra `--surface`, así que el borde queda por encima de 3:1 sin
definir un tono nuevo por estado.

| Estado       | Texto oscuro  | Texto claro                     |
|--------------|---------------|---------------------------------|
| `nuevo`      | `brand`       | `brand-text` (no `brand`)       |
| `contactado` | `amber-400`   | `amber-800`                     |
| `ganado`     | `emerald-400` | `emerald-800`                   |
| `perdido`    | `red-400`     | `red-700`                       |

El relleno tintado (`bg-*/15`) sigue siendo decorativo: nunca debe ser la única pista
de que el elemento es interactivo.

### Indicador de foco

El anillo de foco es un componente de UI y también debe cumplir 3:1 contra el fondo.
Un `ring-brand/30` da ~1.5:1 y no es visible para quien navega con teclado.

- Usar `focus-visible:ring-2 focus-visible:ring-brand` (opacidad completa).
- En estado de error: `focus-visible:ring-red-500`.
- Prohibido bajarle la opacidad al anillo de foco (`ring-*/30`, `/50`, etc.).
- Aplica a inputs y selects con `outline-none`: si se quita el outline nativo, el anillo
  es obligatorio.

Excepción: los estados decorativos que no son foco (ej: el `ring-brand/50` del botón
Contacto activo en la navbar) pueden usar opacidad.

## Sombra de cards: `--shadow-card`

Las cards de primer nivel (las que se apoyan directo sobre el fondo de la página) usan
`shadow-card`. En modo claro `--surface` casi no se distingue de `--bg` (1.04:1) y el
borde `--line` tampoco alcanza, así que la separación la da la sombra. En modo oscuro
el token vale `none`.

Regla: `shadow-card` solo en cards de primer nivel. Los paneles anidados dentro de otra
card (KPIs, filas de lista, resultados de un simulador) no llevan sombra, porque una
sombra sobre otra se ve pesada.

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