import { es } from './es';
import { ca } from './ca';
import { en } from './en';
import type { Dictionary } from './types';

export const dictionaries = { es, ca, en } satisfies Record<string, Dictionary>;
export type Locale = keyof typeof dictionaries;
export type { Dictionary };

export function getDictionary(locale: string | undefined): Dictionary {
  if (locale === 'ca' || locale === 'en') return dictionaries[locale];
  return dictionaries.es;
}
