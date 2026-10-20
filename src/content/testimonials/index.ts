import { es } from './es';
import { ca } from './ca';
import { en } from './en';
import type { TestimonialsContent } from './types';

const byLocale = { es, ca, en } satisfies Record<string, TestimonialsContent>;

export function getTestimonialsContent(locale: string | undefined): TestimonialsContent {
  if (locale === 'ca' || locale === 'en') return byLocale[locale];
  return byLocale.es;
}
