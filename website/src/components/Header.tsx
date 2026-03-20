'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe, ChevronDown } from 'lucide-react';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/getDictionary';

export function Header({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const switchLocalePath = (newLocale: string) => {
    const segments = pathname.split('/');
    segments[1] = newLocale;
    return segments.join('/');
  };

  const links = [
    { href: `/${locale}`, label: dict.nav.home },
    { href: `/${locale}/docs`, label: dict.nav.docs },
    { href: `/${locale}/docs/examples`, label: dict.nav.examples },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-bg/80 backdrop-blur-xl shadow-lg shadow-black/20' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href={`/${locale}`} className="flex items-center gap-3 group">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 border border-accent/20 group-hover:bg-accent/20 transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-accent">
                <rect x="3" y="8" width="4" height="8" rx="1" fill="currentColor" />
                <line x1="5" y1="5" x2="5" y2="19" stroke="currentColor" strokeWidth="1.5" />
                <rect x="10" y="6" width="4" height="12" rx="1" fill="currentColor" opacity="0.7" />
                <line x1="12" y1="3" x2="12" y2="21" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />
                <rect x="17" y="9" width="4" height="6" rx="1" fill="currentColor" opacity="0.5" />
                <line x1="19" y1="6" x2="19" y2="18" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
              </svg>
            </div>
            <span className="text-sm font-semibold tracking-tight hidden sm:block">
              KLine Chart
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {links.map((link) => {
              const isActive =
                link.href === `/${locale}`
                  ? pathname === `/${locale}`
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                    isActive
                      ? 'text-accent bg-accent/10'
                      : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <a
              href="https://github.com/xinKyy/react-native-kline-chart"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 text-sm text-text-secondary hover:text-text-primary rounded-lg hover:bg-white/5 transition-colors"
            >
              {dict.nav.github}
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 px-3 py-2 text-sm text-text-secondary hover:text-text-primary rounded-lg hover:bg-white/5 transition-colors"
              >
                <Globe size={15} />
                <span className="uppercase">{locale}</span>
                <ChevronDown size={12} className={`transition-transform ${langOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-1 glass rounded-xl overflow-hidden min-w-[120px] shadow-xl"
                  >
                    <Link
                      href={switchLocalePath('en')}
                      onClick={() => setLangOpen(false)}
                      className={`block px-4 py-2.5 text-sm transition-colors ${
                        locale === 'en' ? 'text-accent bg-accent/5' : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                      }`}
                    >
                      English
                    </Link>
                    <Link
                      href={switchLocalePath('zh')}
                      onClick={() => setLangOpen(false)}
                      className={`block px-4 py-2.5 text-sm transition-colors ${
                        locale === 'zh' ? 'text-accent bg-accent/5' : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                      }`}
                    >
                      中文
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              href={`/${locale}/docs`}
              className="hidden md:inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg bg-accent text-bg hover:bg-accent-hover transition-colors"
            >
              {dict.nav.getStarted}
            </Link>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-text-secondary hover:text-text-primary rounded-lg hover:bg-white/5 transition-colors"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-border overflow-hidden"
          >
            <nav className="p-4 space-y-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 text-sm rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <a
                href="https://github.com/xinKyy/react-native-kline-chart"
                target="_blank"
                rel="noopener noreferrer"
                className="block px-4 py-3 text-sm rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
              >
                {dict.nav.github}
              </a>
              <Link
                href={`/${locale}/docs`}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 text-sm font-medium rounded-lg bg-accent text-bg text-center"
              >
                {dict.nav.getStarted}
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
