import aboutEn from '../content/site/en/about.json';
import contactEn from '../content/site/en/contact.json';
import globalEn from '../content/site/en/global.json';
import heritageEn from '../content/site/en/heritage.json';
import homeEn from '../content/site/en/home.json';
import type { Locale, SiteContentBundle } from '../types/content';

export const defaultLocale: Locale = 'en';

const bundles: Record<Locale, SiteContentBundle> = {
  en: {
    global: globalEn as SiteContentBundle['global'],
    home: homeEn as SiteContentBundle['home'],
    about: aboutEn as SiteContentBundle['about'],
    contact: contactEn as SiteContentBundle['contact'],
    heritage: heritageEn as SiteContentBundle['heritage']
  }
};

export function getSiteContent(locale: Locale = defaultLocale): SiteContentBundle {
  return bundles[locale] ?? bundles[defaultLocale];
}
