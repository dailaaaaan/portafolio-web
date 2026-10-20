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

| Token                | Valor (oscuro, por defecto)     | Valor (claro)                   | Contraste vs `--color-bg` |
| -------------------- | ------------------------------- | ------------------------------- | ------------------------- |
| `--color-bg`         | `#0a0e0a`                       | `#f2f5f1`                       | —                         |
| `--color-surface`    | `#0f140f`                       | `#e4ebe3`                       | —                         |
| `--color-fg`         | `#d7ffd9`                       | `#0a140a`                       | ~19:1 / ~18:1             |
| `--color-accent`     | `#39ff6a`                       | `#1a7a33`                       | ~14.7:1 / ~4.9:1          |
| `--color-accent-dim` | `#2fb356` (`fix/contrast-pass`) | `#155c30` (`fix/contrast-pass`) | ~7.1:1 / ~7.3:1           |
| `--color-muted`      | `#8cb898` (`fix/contrast-pass`) | `#3d4a40` (`fix/contrast-pass`) | ~8.7:1 / ~8.5:1           |

Valores de `accent-dim`/`muted` anteriores a `fix/contrast-pass`:
`#1f8f3d`/`#4f9a63` (accent-dim) y `#6b8f74`/`#5c6b5f` (muted) — pasaban
AA (4.5:1) por poco en oscuro (4.7:1 y 5.4:1) y **el accent-dim de tema
claro no llegaba a pasar AA** (3.1:1). Subidos para que todos los tokens de
texto/borde interactivo ronden 7:1+ en ambos temas, segun lo pedido por el
usuario (ver nota de accesibilidad mas abajo). El `--color-accent` del tema
claro (4.9:1) pasa AA con margen razonable pero no AAA; no se toco porque no
fue senalado como problema y es el color principal, no uno "dim".

El tema claro/oscuro se controla con `data-theme="light"` en `<html>` (ver PR 4);
por defecto es oscuro (coherente con la estética Matrix).

Tipografía: monoespaciada en toda la interfaz (`JetBrains Mono` o `Fira Code` vía
`@fontsource`, autoalojada — no CDN de Google Fonts, para evitar bloqueo/latencia y
por coherencia con el resto de dependencias autoalojadas).

Principios de diseño (para evitar estética "genérica de IA"):

- Nada de hero centrado + blob de degradado + botón redondeado con sombra.
- Navegación con metáfora de terminal/CLI, no un navbar convencional.
- Transiciones de sección con `<ClientRouter />` (desde `feat/navigation-terminal`,
  con `transition:persist` en el canvas de lluvia de codigo y en los
  controles de tema/idioma para que no se reinicien al navegar). Desde
  `feat/page-transitions-polish`:
  - La transicion entre paginas usa una animacion "glitch" propia
    (`src/lib/transitions.ts` + `@keyframes glitch-out/glitch-in` en
    `global.css`) en vez del crossfade por defecto de Astro.
  - Cada `<h1>` de pagina lleva `data-scramble`: al cargar (carga inicial o
    tras una transicion), `src/components/ui/ScrambleHeadings.astro`
    "decodifica" el texto desde caracteres aleatorios hasta el texto real.
    Escucha el evento `astro:page-load` (se dispara en cada navegacion de
    `<ClientRouter />`), montado una sola vez en `BaseLayout.astro`.
  - Ambos efectos se desactivan automaticamente con
    `prefers-reduced-motion: reduce` (Astro ya inyecta esa media query
    globalmente para toda `transition:animate`, no hace falta logica extra).
- Microinteracciones: todo elemento clicable (botones, enlaces del menu,
  enlaces de contacto) lleva `transition` (o `transition-colors` si no tiene
  efecto de escala) + `duration-150`; los que son claramente "botones"
  (toggle de tema, descargar CV/carta, enviar opinion, items del menu)
  anaden ademas `active:scale-95` o `active:scale-[0.98]` como feedback
  táctil al pulsar.
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
- **Páginas placeholder (historico)**: mientras una sección de contenido no
  tenia su PR propio, su ruta existia igualmente (para que el menú no
  enlazara a 404) y renderizaba `PlaceholderPage.astro` con un mensaje de
  "en construcción". Las 5 secciones ya tienen su componente definitivo desde
  el PR `feat/section-contact`, asi que `PlaceholderPage.astro` se elimino
  por no tener ya ningun uso. Si en el futuro se añade una sexta sección,
  reaplicar el mismo patrón (recrear un componente placeholder equivalente)
  mientras se construye su PR.

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
- `.env` local (nunca se sube a git) con `TURSO_DATABASE_URL`/`TURSO_AUTH_TOKEN`
  para apuntar los scripts a produccion en vez de `local.db`. `npm run dev`
  lo carga automaticamente (Astro/Vite ya lee `.env` hacia `process.env`).
  Los scripts sueltos (`db:seed`, `db:approve`) NO pasan por Vite, asi que
  llevan `node --env-file-if-exists=.env` en su definicion de `package.json`
  para leerlo tambien (confirmado con una prueba real: sin ese flag, se
  ignoraba el `.env` en silencio y caia al fallback de `local.db`).
- `seed.ts`/`approve.ts` cierran la conexion con `db.$client.close()` al
  terminar y dejan que Node salga solo (sin `process.exit()`): contra Turso
  (HTTP/WS), forzar la salida justo despues de `close()` provoca un
  "Assertion failed" de libuv en Windows (el handle aun no habia terminado
  de cerrarse a nivel nativo). No afecta a los datos, pero conviene salir
  limpio.
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
  distinguian bien del fondo. Todo texto y todo elemento interactivo (botones,
  bordes de componentes clicables) debe apuntar a un contraste claramente por
  encima del minimo, no solo al limite — en la practica, 7:1+ para texto
  normal cuando sea razonable. `fix/contrast-pass` ya subio `--color-muted` y
  `--color-accent-dim` a ~7-8.7:1 en ambos temas (ver tabla de la seccion 5
  para los valores exactos y el calculo); cualquier color nuevo que se añada
  despues debe calcularse con la misma formula WCAG, no a ojo.
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
2. Lleva descripción breve con dos secciones: "## Resumen" (que cambia y por
   que) y "## Cambios" (lista de archivos/decisiones). Sin seccion de
   "Como probar" ni checklist — el usuario pidio explicitamente no incluirlas
   en la descripcion del PR (la verificacion de `check`/`lint`/`build` se
   sigue haciendo siempre antes de entregar el PR, solo que no se listas ahi).
3. Se fusiona a `main` (merge commit o squash, a criterio del orquestador) antes
   de empezar el siguiente PR del plan.

**Importante sobre `gh pr create` en `cmd.exe`**: pasar la descripción con
`--body "texto con varias líneas"` se queda colgado en la consola de Windows
(cmd.exe interpreta cada salto de línea como un Enter, dejando comillas sin
cerrar). Usar siempre `--body-file` apuntando a un archivo (ej.
`tmp-pr-body.md`, ya en `.gitignore`) en vez de `--body` con texto multilínea.

Plan de PRs completo (mínimo 12, se definen 19 — incluye un fix no
planificado, `fix/theme-persist-on-navigation`): ver `README.md`, sección
"Plan de desarrollo", que se mantiene sincronizada con el progreso real.

## 10. SEO

- `site` en `astro.config.mjs` apunta a la URL real de produccion
  (`https://portafolio-web-nine-bay.vercel.app`, actualizado en
  `chore/deploy-config`), de la que dependen el sitemap, las URLs canonicas,
  `og:url` y las `hreflang`. `public/robots.txt` tiene la URL del sitemap
  con el mismo dominio, mantener ambos sincronizados si el dominio cambia
  (ej. al anadir un dominio propio).
- `@astrojs/sitemap` genera `sitemap-index.xml` automaticamente a partir de
  las rutas construidas, sin configuracion adicional.
- `BaseLayout.astro` acepta una prop opcional `description` (por defecto
  `dict.seo.home`); cada ruta debe pasar `description={dict.seo.<seccion>}`
  explicitamente. Genera automaticamente: meta description, canonical,
  `hreflang` para los 3 idiomas + `x-default` (apuntando a ES), Open Graph
  (`og:locale` + `og:locale:alternate` por cada otro idioma) y Twitter Card.
  No hay `og:image` todavia (requeriria generar una imagen, fuera de alcance
  de este PR).
- `src/lib/locale-path.ts`: `getPathWithoutLocale()`, compartida entre
  `LanguageSwitcher.astro` y `BaseLayout.astro` (antes duplicada).
- Datos estructurados (`schema.org` `Person`) solo en la home
  (`HomePage.astro`), via `<script type="application/ld+json" is:inline
set:html={...}>` — este es el unico uso aceptable de `set:html` en el
  proyecto, porque el JSON lo generamos nosotros mismos, no viene de un
  usuario (la regla de la seccion 7 sobre no usar `set:html` es
  especificamente sobre contenido de usuario).
- Favicon (`public/favicon.svg`) sustituido por un icono propio (">_"
  estilo terminal, verde sobre negro) en vez del logo generico de Astro del
  scaffold inicial. El `favicon.ico` heredado del scaffold no se toco (bajo
  impacto, fallback legacy).

## 11. Presupuesto de rendimiento

- JS enviado al cliente en la página de inicio: objetivo < 80 KB gzip (de ahí la
  preferencia por TypeScript vanilla sobre islas React salvo que haya estado
  real que gestionar).
- Imágenes propias optimizadas (`astro:assets`), sin imágenes sin optimizar en
  `public/` salvo el favicon y los PDF.
- Lighthouse objetivo: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95,
  SEO ≥ 95 en la página de inicio.
