import { es } from './es';
import { ca } from './ca';
import { en } from './en';
import type { ContactContent } from './types';

const byLocale = { es, ca, en } satisfies Record<string, ContactContent>;

export function getContact(locale: string | undefined): ContactContent {
  if (locale === 'ca' || locale === 'en') return byLocale[locale];
  return byLocale.es;
}
