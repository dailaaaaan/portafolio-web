import { es } from './es';
import { ca } from './ca';
import { en } from './en';
import type { CvContent } from './types';

const byLocale = { es, ca, en } satisfies Record<string, CvContent>;

export function getCv(locale: string | undefined): CvContent {
  if (locale === 'ca' || locale === 'en') return byLocale[locale];
  return byLocale.es;
}
