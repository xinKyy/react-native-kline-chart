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
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-bg-card border border-border group-hover:border-accent/30 transition-colors overflow-hidden">
              <svg width="20" height="20" viewBox="0 0 512 512" fill="none">
                <line x1="138" y1="100" x2="138" y2="412" stroke="#F6465D" strokeWidth="28" strokeLinecap="round" />
                <rect x="108" y="160" width="60" height="180" rx="8" fill="#F6465D" />
                <line x1="256" y1="70" x2="256" y2="380" stroke="#2DC08E" strokeWidth="28" strokeLinecap="round" />
                <rect x="226" y="130" width="60" height="200" rx="8" fill="#2DC08E" />
                <line x1="374" y1="120" x2="374" y2="400" stroke="#2DC08E" strokeWidth="28" strokeLinecap="round" />
                <rect x="344" y="200" width="60" height="120" rx="8" fill="#2DC08E" />
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
