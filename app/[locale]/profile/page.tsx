'use client';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import { Globe, Heart, CheckCircle } from 'lucide-react';
import { EventCategory } from '@/types/event';
import { SupportedLocale } from '@/types/user';
import Button from '@/components/ui/Button';
import { clsx } from 'clsx';

const ALL_CATEGORIES: EventCategory[] = [
  'Music', 'Comedy', 'Food & Drink', 'Sports', 'Art', 'Theatre', 'Nightlife', 'Kids', 'Wellness',
];

const CATEGORY_EMOJIS: Record<EventCategory, string> = {
  'Music': '🎵',
  'Comedy': '😂',
  'Food & Drink': '🍜',
  'Sports': '⚽',
  'Art': '🎨',
  'Theatre': '🎭',
  'Nightlife': '🌃',
  'Kids': '🧸',
  'Wellness': '🧘',
};

const LOCALES: { code: SupportedLocale; label: string; nativeLabel: string }[] = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी' },
  { code: 'kn', label: 'Kannada', nativeLabel: 'ಕನ್ನಡ' },
  { code: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்' },
];

export default function ProfilePage() {
  const t = useTranslations('profile');
  const tCat = useTranslations('categories');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [interests, setInterests] = useState<EventCategory[]>(['Music', 'Food & Drink']);
  const [saved, setSaved] = useState(false);

  function switchLocale(newLocale: SupportedLocale) {
    const segments = pathname.split('/');
    segments[1] = newLocale;
    router.push(segments.join('/'));
  }

  function toggleInterest(cat: EventCategory) {
    setInterests((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
    setSaved(false);
  }

  function saveInterests() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="max-w-lg mx-auto space-y-8">
      <h1 className="text-xl font-bold text-gray-900">{t('title')}</h1>

      {/* Language section */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-gray-700 font-semibold">
          <Globe className="h-5 w-5 text-violet-500" />
          {t('language')}
        </div>
        <div className="grid grid-cols-2 gap-2">
          {LOCALES.map(({ code, label, nativeLabel }) => (
            <button
              key={code}
              onClick={() => switchLocale(code)}
              className={clsx(
                'p-4 rounded-2xl border-2 text-left transition-all',
                locale === code
                  ? 'border-violet-600 bg-violet-50'
                  : 'border-gray-100 bg-white hover:border-violet-200'
              )}
            >
              <div className={`font-bold text-lg ${locale === code ? 'text-violet-700' : 'text-gray-800'}`}>
                {nativeLabel}
              </div>
              <div className="text-xs text-gray-400 mt-0.5">{label}</div>
              {locale === code && (
                <CheckCircle className="h-4 w-4 text-violet-600 mt-1" />
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Interests section */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-gray-700 font-semibold">
          <Heart className="h-5 w-5 text-violet-500" />
          {t('interests')}
        </div>
        <div className="grid grid-cols-3 gap-2">
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => toggleInterest(cat)}
              className={clsx(
                'p-3 rounded-2xl border-2 text-center transition-all',
                interests.includes(cat)
                  ? 'border-violet-600 bg-violet-50'
                  : 'border-gray-100 bg-white hover:border-violet-200'
              )}
            >
              <div className="text-2xl">{CATEGORY_EMOJIS[cat]}</div>
              <div className={`text-xs font-medium mt-1 ${interests.includes(cat) ? 'text-violet-700' : 'text-gray-500'}`}>
                {tCat(cat)}
              </div>
            </button>
          ))}
        </div>
        <Button
          fullWidth
          variant={saved ? 'secondary' : 'primary'}
          onClick={saveInterests}
        >
          {saved ? (
            <span className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" /> Saved!
            </span>
          ) : t('saveInterests')}
        </Button>
      </section>
    </div>
  );
}
