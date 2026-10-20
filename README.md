# Portafolio Web — Dylan Andreu Fiallos

Portafolio personal interactivo con estética "Matrix terminal": landing page en
negro/verde con lluvia de código de fondo, 5 secciones (CV, carta de presentación,
experiencias, opiniones, contacto), multilenguaje (ES/CA/EN) y tema claro/oscuro.

Para las convenciones técnicas completas (stack, estructura, reglas de diseño,
base de datos, accesibilidad), ver [`CLAUDE.md`](./CLAUDE.md).

## Stack

Astro 7 (SSR) · TypeScript strict · Tailwind CSS v4 · React 19 (islas puntuales) ·
Drizzle ORM + SQLite/Turso · i18n nativo de Astro · despliegue en Vercel.

## Desarrollo local

```sh
npm install
npm run dev
```

`local.db` no viaja en git (está en `.gitignore`). `npm run dev` ejecuta
automáticamente `db:migrate` + `db:seed` antes de arrancar (ver `predev` en
`package.json`), así que no hace falta ningún paso manual. Si usas
`npm run preview` (sirve el build ya compilado) necesitarás crear la base de
datos tú mismo primero con `npm run db:migrate` (+ `db:seed` si quieres datos
de prueba), porque `preview` no pasa por el hook `predev`.

| Comando                      | Acción                                     |
| ---------------------------- | ------------------------------------------ |
| `npm run dev`                | Servidor de desarrollo en `localhost:4321` |
| `npm run build`              | Build de producción (`./dist/`)            |
| `npm run preview`            | Previsualiza el build de producción        |
| `npm run check`              | Type-check de `.astro`/`.ts`               |
| `npm run lint`               | ESLint                                     |
| `npm run format`             | Prettier (escribe)                         |
| `npm run format:check`       | Prettier (solo verifica)                   |
| `npm run db:generate`        | Genera una migración a partir del esquema  |
| `npm run db:migrate`         | Aplica las migraciones a `local.db`        |
| `npm run db:seed`            | Inserta los testimonios de prueba          |
| `npm run db:approve -- <id>` | Aprueba una opinión del guestbook          |

## Plan de desarrollo (ramas y Pull Requests)

El proyecto se construye en incrementos pequeños, cada uno como una rama fusionada
mediante un Pull Request independiente. Estado actualizado a medida que se avanza:

| #   | Rama                                  | Contenido                                                                                         | Estado                    |
| --- | ------------------------------------- | ------------------------------------------------------------------------------------------------- | ------------------------- |
| 1   | `chore/project-setup`                 | Scaffold Astro + TypeScript strict + Tailwind v4 + React + adapter Vercel + ESLint/Prettier       | ✅ Fusionado              |
| 2   | `docs/claude-md`                      | Limpieza de archivos accidentales + `CLAUDE.md`/`README.md` actualizados (añade sección Contacto) | ✅ Fusionado              |
| 3   | `feat/design-tokens`                  | Paleta Matrix, tipografías monoespaciadas, tokens claro/oscuro                                    | ✅ Fusionado              |
| 4   | `feat/theme-toggle`                   | Selector de tema persistente (vanilla TS, sin flash)                                              | ✅ Fusionado              |
| 5   | `feat/i18n-setup`                     | Routing i18n de Astro (ES/CA/EN), diccionarios, selector de idioma                                | ✅ Fusionado              |
| 6   | `feat/matrix-background`              | Canvas de lluvia de código, respeta `prefers-reduced-motion`                                      | ✅ Fusionado              |
| 7   | `feat/database-setup`                 | Drizzle + libSQL (local/Turso), esquema, migraciones, seed                                        | ✅ Fusionado              |
| 8   | `feat/navigation-terminal`            | Navegación estilo CLI + landing/hero + View Transitions                                           | ✅ Fusionado              |
| 9   | `feat/section-experience`             | Timeline de experiencia profesional                                                               | ⏳ Pendiente              |
| 10  | `feat/section-cv`                     | Sección CV estructurada + descarga del PDF original                                               | ⏳ Pendiente              |
| 11  | `feat/section-cover-letter`           | Sección carta de presentación                                                                     | ⏳ Pendiente              |
| 12  | `feat/section-testimonials-guestbook` | Opiniones desde la BD + formulario (isla React) con validación/moderación                         | ⏳ Pendiente              |
| 13  | `feat/section-contact`                | Sección Contacto: email, teléfono, LinkedIn, GitHub                                               | ⏳ Pendiente (falta info) |
| 14  | `feat/page-transitions-polish`        | Glitch effects, microinteracciones, pulido de transiciones                                        | ⏳ Pendiente              |
| 15  | `feat/accessibility-responsive`       | Accesibilidad + mobile-first                                                                      | ⏳ Pendiente              |
| 16  | `feat/seo-metadata`                   | SEO, favicon, Open Graph, sitemap, robots.txt                                                     | ⏳ Pendiente              |
| 17  | `fix/contrast-pass`                   | Sube el contraste entre texto/botones y el fondo en ambos temas (pedido explícito del usuario)    | ⏳ Pendiente              |
| 18  | `chore/deploy-config`                 | Config de despliegue (Vercel + Turso), variables de entorno                                       | ⏳ Pendiente              |

Cada PR incluye en su descripción: qué cambia, por qué, cómo probarlo localmente, y
un checklist de `npm run check` / `lint` / `build` en verde.
