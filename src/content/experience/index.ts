import { es } from './es';
import { ca } from './ca';
import { en } from './en';
import type { ExperienceContent } from './types';

const byLocale = { es, ca, en } satisfies Record<string, ExperienceContent>;

export function getExperience(locale: string | undefined): ExperienceContent {
  if (locale === 'ca' || locale === 'en') return byLocale[locale];
  return byLocale.es;
}
