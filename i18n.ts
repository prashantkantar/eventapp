import { getRequestConfig } from 'next-intl/server';
import en from './public/locales/en/common.json';
import hi from './public/locales/hi/common.json';
import kn from './public/locales/kn/common.json';
import ta from './public/locales/ta/common.json';

const messages: Record<string, unknown> = { en, hi, kn, ta };

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = (await requestLocale) || 'en';
  return {
    locale,
    messages: messages[locale] ?? en,
  };
});
