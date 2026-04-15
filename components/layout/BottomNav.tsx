'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Compass, Search, Ticket, User } from 'lucide-react';
import { clsx } from 'clsx';

export default function BottomNav() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();

  const tabs = [
    { href: `/${locale}`, icon: Compass, label: t('discover') },
    { href: `/${locale}/search`, icon: Search, label: t('search') },
    { href: `/${locale}/bookings`, icon: Ticket, label: t('myBookings') },
    { href: `/${locale}/profile`, icon: User, label: t('profile') },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 safe-area-inset-bottom">
      <div className="flex">
        {tabs.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || (href !== `/${locale}` && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                'flex-1 flex flex-col items-center py-2 gap-0.5 text-[10px] font-medium transition-colors',
                isActive ? 'text-violet-600' : 'text-gray-400 hover:text-gray-600'
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="truncate max-w-[60px] text-center">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
