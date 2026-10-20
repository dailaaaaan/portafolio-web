// Astro.url.pathname incluye el prefijo de idioma actual (ej. "/ca/cv"); esta
// funcion lo quita para quedarnos con la ruta "neutra" (ej. "cv") antes de
// reconstruir un enlace a otro idioma con getRelativeLocaleUrl. Compartida
// entre LanguageSwitcher.astro y BaseLayout.astro (etiquetas hreflang).
export function getPathWithoutLocale(pathname: string): string {
  const stripped = pathname.replace(/^\/(ca|en)(\/|$)/, '/');
  return stripped === '/' ? '' : stripped.replace(/^\//, '');
}
