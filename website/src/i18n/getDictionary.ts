import type { Locale } from './config';

const dictionaries = {
  en: () => import('./en').then((m) => m.default),
  zh: () => import('./zh').then((m) => m.default),
};

export async function getDictionary(locale: Locale) {
  return dictionaries[locale]();
}

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>;
