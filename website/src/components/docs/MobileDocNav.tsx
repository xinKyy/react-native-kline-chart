'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/getDictionary';

export function MobileDocNav({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const allLinks = [
    { href: `/${locale}/docs`, label: dict.docs.sidebar.overview },
    { href: `/${locale}/docs/installation`, label: dict.docs.sidebar.installation },
    { href: `/${locale}/docs/quick-start`, label: dict.docs.sidebar.quickStart },
    { href: `/${locale}/docs/basic-usage`, label: dict.docs.sidebar.basicUsage },
    { href: `/${locale}/docs/customization`, label: dict.docs.sidebar.customization },
    { href: `/${locale}/docs/gestures`, label: dict.docs.sidebar.gestures },
    { href: `/${locale}/docs/api-reference`, label: dict.docs.sidebar.apiReference },
    { href: `/${locale}/docs/types`, label: dict.docs.sidebar.types },
    { href: `/${locale}/docs/examples`, label: dict.docs.sidebar.examples },
  ];

  const current = allLinks.find((l) => l.href === pathname) || allLinks[0];

  return (
    <div className="lg:hidden mb-6">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-4 py-3 rounded-xl border border-border bg-bg-card/50 text-sm"
      >
        <span>{current.label}</span>
        <ChevronDown size={16} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2 rounded-xl border border-border bg-bg-card overflow-hidden"
          >
            {allLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`block px-4 py-2.5 text-sm transition-colors ${
                  pathname === link.href
                    ? 'text-accent bg-accent/5'
                    : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
