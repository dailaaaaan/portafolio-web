import { es } from './es';
import { ca } from './ca';
import { en } from './en';
import type { CoverLetterContent } from './types';

const byLocale = { es, ca, en } satisfies Record<string, CoverLetterContent>;

export function getCoverLetter(locale: string | undefined): CoverLetterContent {
  if (locale === 'ca' || locale === 'en') return byLocale[locale];
  return byLocale.es;
}
