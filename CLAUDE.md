# CLAUDE.md — Guía técnica del proyecto

Este archivo es la fuente de verdad para cualquier IA (o persona) que trabaje en este
repositorio. Si una instrucción puntual del usuario contradice este documento, la
instrucción puntual gana, pero debe actualizarse este archivo para reflejar el cambio.

## 1. Qué es este proyecto

Portafolio web personal de Dylan Andreu Fiallos Sanchez (desarrollador Full Stack
junior). Landing page con estética "Matrix" (terminal, monoespaciada, fondo negro con
verde, lluvia de código) que da acceso a 5 secciones:

1. `CV` — currículum estructurado, con descarga del PDF original.
2. `Carta de presentación`.
3. `Experiencias` — timeline de experiencia profesional.
4. `Opiniones` — testimonios de excompañeros (ficticios, redactados para este
   proyecto) + un guestbook donde cualquier visitante puede dejar su propia opinión.
5. `Contacto` — enlaces directos a redes/contacto (LinkedIn, GitHub, email,
   teléfono). **Dato pendiente del usuario**: antes de construir el PR
   `feat/section-contact` hay que pedirle a Dylan que confirme/complete esta
   información (ya se dispone de los datos del CV como base: email, teléfono,
   LinkedIn y GitHub, pero debe confirmarse si quiere añadir algo más o
   cambiarlos).

Público objetivo: reclutadores y responsables técnicos evaluando a Dylan para
puestos de desarrollador Full Stack junior / soporte IT. El sitio debe transmitir
cuidado técnico y originalidad, no verse como una plantilla genérica.

## 2. Reglas no negociables para la IA

- **La IA nunca ejecuta comandos de git ni de GitHub/GitLab** (`git init`, `git add`,
  `git commit`, `git push`, `git branch`, `gh pr create`, etc.). Esto lo hace siempre
  el humano ("el orquestador"), siguiendo el plan de ramas/PRs definido en la
  sección 9.
- El trabajo se entrega en incrementos que corresponden 1:1 con el plan de PRs. Al
  terminar un incremento, la IA se detiene y entrega: rama sugerida, comandos git
  exactos, mensaje de commit (Conventional Commits) y descripción de PR lista para
  pegar. No se continúa automáticamente al siguiente PR sin que el humano lo pida.
- No se añaden dependencias, frameworks o servicios externos nuevos sin que estén ya
  aprobados en este documento o sin preguntar antes.
- No se inventan datos biográficos reales. El CV, la carta de presentación y las
  experiencias deben reflejar fielmente el contenido de los PDF proporcionados. Los
  testimonios de "opiniones de compañeros" son explícitamente ficticios y deben
  quedar marcados como tal en el código/contenido (no presentarse como reales en
  ningún metadato).
- Todo contenido visible al usuario existe en los 3 idiomas soportados (ES/CA/EN)
  antes de dar un PR por terminado.
- Antes de cerrar cualquier PR: `npm run check`, `npm run lint` y `npm run build`
  deben pasar sin errores.

## 3. Stack tecnológico (versiones de referencia, ver `package.json` para exactas)

- **Astro 7** (`output: 'server'`, adapter `@astrojs/vercel`) — framework principal,
  islas de interactividad.
- **TypeScript** en modo `strict` (heredado de `astro/tsconfigs/strict`).
- **Tailwind CSS v4** vía `@tailwindcss/vite` (config CSS-first con `@theme`, sin
  `tailwind.config.js`).
- **React 19** (`@astrojs/react`) — solo para islas que requieren estado/interacción
  real (formulario del guestbook). Todo lo demás (toggle de tema, selector de idioma,
  canvas de lluvia de código) se implementa en TypeScript vanilla para minimizar JS
  enviado al cliente.
- **Astro View Transitions** (`<ClientRouter />`) — transiciones entre secciones/rutas.
- **Drizzle ORM** + **libSQL** (`@libsql/client`) — capa de datos. SQLite local
  (`file:local.db`) en desarrollo, **Turso** en producción, mismo esquema.
- **Astro i18n routing** nativo (`i18n` en `astro.config.mjs`) — ES (idioma por
  defecto, sin prefijo de URL), CA, EN.
- **ESLint 10 (flat config)** + **typescript-eslint** + **eslint-plugin-astro**.
- **Prettier** + `prettier-plugin-astro` + `prettier-plugin-tailwindcss`.
- Despliegue objetivo: **Vercel** (adapter ya configurado desde el PR 1).

No se introduce ningún otro framework de UI (Vue, Svelte, etc.), ni CSS-in-JS, ni
otro ORM, sin actualizar esta sección primero.

**`npm audit` conocido**: a fecha del PR 8 hay 7 avisos (3 "high", 4 "moderate")
en dependencias transitivas de `drizzle-kit` (esbuild, solo en su servidor de
desarrollo interno) y de `@astrojs/vercel` (`path-to-regexp`, solo usado en
tiempo de build para generar rutas, no sirve peticiones reales). Ninguno de los
dos procesa input de usuarios en producción. `npm audit fix --force` los
"arregla" degradando a versiones mucho mas antiguas de esos paquetes (peor que
el problema), así que se dejan documentados aquí en vez de forzar el downgrade.
Revisar de nuevo si `npm audit` reporta algo distinto en el futuro.

## 4. Estructura de carpetas

```
src/
  components/
    react/        -> islas React (ej. formulario de guestbook)
    ui/            -> componentes .astro reutilizables (nav, botones, cards)
      TerminalWindow.astro -> "cromado" de ventana de terminal (3 puntos +
        prompt) que envuelve el contenido de cada seccion; usarlo en vez de
        repetir el marcado del bloque de terminal
      BackLink.astro       -> enlace "volver al inicio" traducido; añadirlo
        al final de cada pagina de seccion (no de la home)
  layouts/         -> BaseLayout.astro y layouts específicos de sección
  pages/
    [locale]/      -> rutas por idioma cuando aplique (ver sección i18n)
  styles/
    global.css     -> única entrada de Tailwind (@import "tailwindcss"; + @theme)
  content/
    cv/            -> datos estructurados del CV por idioma (ts/json)
    experience/    -> datos del timeline de experiencia
    testimonials/  -> datos semilla de opiniones ficticias
    contact/       -> enlaces de contacto (email, telefono, LinkedIn, GitHub)
  i18n/
    es.ts, ca.ts, en.ts  -> diccionarios de UI (strings de interfaz, no contenido largo)
  lib/
    db/
      schema.ts    -> esquema Drizzle
      client.ts    -> conexión (local file vs Turso según env)
      seed.ts      -> script de semillas
  pages/api/       -> endpoints server-side (guestbook)
public/
  cv/              -> PDF original del CV y carta de presentación, descargables
```

## 5. Sistema de diseño ("Matrix terminal")

Paleta definida como tokens CSS en `src/styles/global.css` vía `@theme` de Tailwind
v4 (no usar colores hardcodeados fuera de los tokens):

| Token                | Valor (oscuro, por defecto) | Valor (claro) |
| -------------------- | --------------------------- | ------------- |
| `--color-bg`         | `#0a0e0a`                   | `#f2f5f1`     |
| `--color-surface`    | `#0f140f`                   | `#e4ebe3`     |
| `--color-fg`         | `#d7ffd9`                   | `#0a140a`     |
| `--color-accent`     | `#39ff6a`                   | `#1a7a33`     |
| `--color-accent-dim` | `#1f8f3d`                   | `#4f9a63`     |
| `--color-muted`      | `#6b8f74`                   | `#5c6b5f`     |

El tema claro/oscuro se controla con `data-theme="light"` en `<html>` (ver PR 4);
por defecto es oscuro (coherente con la estética Matrix).

Tipografía: monoespaciada en toda la interfaz (`JetBrains Mono` o `Fira Code` vía
`@fontsource`, autoalojada — no CDN de Google Fonts, para evitar bloqueo/latencia y
por coherencia con el resto de dependencias autoalojadas).

Principios de diseño (para evitar estética "genérica de IA"):

- Nada de hero centrado + blob de degradado + botón redondeado con sombra.
- Navegación con metáfora de terminal/CLI, no un navbar convencional.
- Transiciones de sección con `<ClientRouter />` (animado desde el PR
  `feat/navigation-terminal`, con `transition:persist` en el canvas de lluvia
  de codigo y en los controles de tema/idioma para que no se reinicien al
  navegar). El efecto de "decodificacion" (glitch) en los textos durante la
  transicion es trabajo pendiente de `feat/page-transitions-polish`, no de
  este PR inicial.
- Layout asimétrico; evitar grillas de 3 columnas simétricas para listar contenido.
- El canvas de lluvia de código vive detrás de todo el contenido (z-index bajo,
  `pointer-events: none`), y debe desactivarse/congelarse si
  `prefers-reduced-motion: reduce`.

## 6. Internacionalización

- Config en `astro.config.mjs`: `locales: ['es', 'ca', 'en']`, `defaultLocale: 'es'`,
  `routing: { prefixDefaultLocale: false }` (ES sin prefijo, `/ca/...` y `/en/...`
  para los otros).
- Diccionarios de UI tipados en `src/i18n/{es,en,ca}.ts`, mismo shape en los tres
  (se valida con un tipo compartido `Dictionary`).
- El contenido largo (CV, carta, experiencias, testimonios) vive en
  `src/content/**` con un archivo por idioma, no mezclado en el diccionario de UI.
- El selector de idioma conserva la sección actual al cambiar de idioma (no redirige
  siempre a home).
- **Patrón de página por idioma**: cada página real se implementa una sola vez en
  `src/pages/_shared/NombrePage.astro` (la carpeta `_shared` empieza por `_` para
  que Astro no le asigne ruta propia), leyendo `Astro.currentLocale` para elegir
  el diccionario. Después existen 3 archivos finos de ruta que solo importan y
  renderizan ese componente: `src/pages/index.astro` (ES, sin prefijo),
  `src/pages/ca/index.astro` y `src/pages/en/index.astro`. Así no se duplica el
  contenido/markup, solo el archivo de ruta (ver ejemplo en `HomePage.astro`).
- **Los slugs de URL no se traducen**: `/cv`, `/carta-presentacion`,
  `/experiencia`, `/opiniones`, `/contacto` son los mismos en los 3 idiomas
  (solo con el prefijo `/ca/` o `/en/` delante). Lo que cambia por idioma es
  unicamente la etiqueta visible en el menu (`dict.nav.*`), no la ruta. Esto
  evita multiplicar la complejidad de routing; si en el futuro se quiere URLs
  traducidas, revisar antes el impacto en todos los enlaces internos y en SEO
  (PR `feat/seo-metadata`).
- **Páginas placeholder**: mientras una sección de contenido aún no tiene su
  PR propio, su ruta existe igualmente (para que el menú no enlace a 404) y
  renderiza `src/pages/_shared/PlaceholderPage.astro` con un mensaje de
  "en construcción". Cuando llega el PR real de esa sección (ej.
  `feat/section-cv`), se sustituye `<PlaceholderPage section="cv" />` por el
  componente definitivo en los 3 archivos de ruta de esa sección.

## 7. Base de datos

- Esquema en `src/lib/db/schema.ts` con Drizzle:
  - tabla `testimonials`: `id`, `name`, `role` (nullable: solo relleno en los
    testimonios semilla, el guestbook publico no lo pide), `relationship`
    (ej. "compañero en Wallbox"), `message`, `locale`, `approved` (boolean,
    default `false`), `is_seed` (boolean, default `false`), `created_at`
    (**entero epoch unix**, no texto — un texto con formato distinto al de
    SQLite compararia mal con `>`/`<`, ver tabla `rate_limits`).
  - tabla `rate_limits`: `id`, `ip`, `created_at` (mismo motivo: entero epoch).
  - Los testimonios semilla (`is_seed = true`) se insertan con `approved = true`
    mediante `npm run db:seed` (idempotente: borra los semilla previos antes
    de reinsertar).
  - Las entradas nuevas del guestbook entran con `approved = false`.
- Conexión (`src/lib/db/client.ts`): si existe `TURSO_DATABASE_URL` úsalo (más
  `TURSO_AUTH_TOKEN`); si no, usa `file:local.db` para desarrollo local. Usa
  `process.env`, no `import.meta.env` (este archivo tambien lo importan los
  scripts de Node en `src/lib/db/*.ts`, que no pasan por Vite).
- Migraciones versionadas con `drizzle-kit`, carpeta `drizzle/` incluida en git
  (las migraciones sí se versionan; el archivo `local.db` no).
- Endpoint `POST /api/testimonials` (`src/pages/api/testimonials.ts`, uno
  solo, no se duplica por idioma — el locale viaja en el body):
  - Valida: campos requeridos, longitudes máximas (nombre ≤ 80, relación ≤ 120,
    mensaje ≤ 500), campo honeypot oculto (`website`) que debe llegar vacío
    (si llega relleno, se responde 201 falso sin insertar nada, para no
    delatar la deteccion al bot).
  - Rate limit real por IP usando la tabla `rate_limits` (ventana de 60s,
    funciona igual en funciones serverless sin estado que un contador en
    memoria no soportaria).
  - Sanitiza/escapa cualquier input antes de guardar y, sobre todo, antes de
    renderizar (Astro escapa por defecto en `{}`, no usar `set:html` con
    contenido de usuario).
  - Devuelve 201 sin exponer si el mensaje quedó pendiente de aprobación con
    detalle interno (solo un mensaje genérico de "gracias, tu opinión será
    revisada").
- Aprobación: `npm run db:approve -- <id>` (script en
  `src/lib/db/approve.ts`), no se construye panel de administración web.

## 8. Accesibilidad

- Contraste: no basta con cumplir el minimo AA (4.5:1) por los pelos — el
  usuario reporto explicitamente que, aun pasando ese minimo, texto secundario
  (`--color-muted`) y bordes de botones (`--color-accent-dim`) no se
  distinguian bien del fondo. A partir de ahora, todo texto y todo elemento
  interactivo (botones, bordes de componentes clicables) debe apuntar a un
  contraste claramente por encima del minimo, no solo al limite. Pendiente
  una pasada dedicada en `fix/contrast-pass` (ver README), pero cualquier PR
  nuevo que añada texto o controles debe ya intentar cumplir esto desde el
  principio en vez de dejarlo todo para esa pasada final.
- Toda la navegación operable por teclado (incluida la navegación tipo
  terminal).
- `prefers-reduced-motion: reduce` desactiva o reduce drásticamente: lluvia de
  código, glitch, animaciones de transición de página.
- Formularios con `<label>` asociado, mensajes de error anunciados
  (`aria-live`).

## 9. Flujo de Git / Pull Requests

Formato de commits: [Conventional Commits](https://www.conventionalcommits.org/)
(`feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `chore:`, `test:`).
Ramas desde `main`, nombre `tipo/descripcion-corta`. Cada PR:

1. Debe poder revisarse de forma aislada (no mezclar features no relacionadas).
2. Lleva descripción con: qué cambia, por qué, cómo probarlo, checklist de
   `npm run check` / `lint` / `build` en verde.
3. Se fusiona a `main` (merge commit o squash, a criterio del orquestador) antes
   de empezar el siguiente PR del plan.

**Importante sobre `gh pr create` en `cmd.exe`**: pasar la descripción con
`--body "texto con varias líneas"` se queda colgado en la consola de Windows
(cmd.exe interpreta cada salto de línea como un Enter, dejando comillas sin
cerrar). Usar siempre `--body-file` apuntando a un archivo (ej.
`tmp-pr-body.md`, ya en `.gitignore`) en vez de `--body` con texto multilínea.

Plan de PRs completo (mínimo 12, se definen 18): ver `README.md`, sección
"Plan de desarrollo", que se mantiene sincronizada con el progreso real.

## 10. Presupuesto de rendimiento

- JS enviado al cliente en la página de inicio: objetivo < 80 KB gzip (de ahí la
  preferencia por TypeScript vanilla sobre islas React salvo que haya estado
  real que gestionar).
- Imágenes propias optimizadas (`astro:assets`), sin imágenes sin optimizar en
  `public/` salvo el favicon y los PDF.
- Lighthouse objetivo: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95,
  SEO ≥ 95 en la página de inicio.
