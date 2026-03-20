'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Book, Download, Zap, Code2, Palette, Hand, FileCode, Braces, Image } from 'lucide-react';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/getDictionary';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

export function DocsSidebar({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const pathname = usePathname();

  const groups: NavGroup[] = [
    {
      title: dict.docs.sidebar.gettingStarted,
      items: [
        { href: `/${locale}/docs`, label: dict.docs.sidebar.overview, icon: <Book size={15} /> },
        { href: `/${locale}/docs/installation`, label: dict.docs.sidebar.installation, icon: <Download size={15} /> },
        { href: `/${locale}/docs/quick-start`, label: dict.docs.sidebar.quickStart, icon: <Zap size={15} /> },
      ],
    },
    {
      title: dict.docs.sidebar.guides,
      items: [
        { href: `/${locale}/docs/basic-usage`, label: dict.docs.sidebar.basicUsage, icon: <Code2 size={15} /> },
        { href: `/${locale}/docs/customization`, label: dict.docs.sidebar.customization, icon: <Palette size={15} /> },
        { href: `/${locale}/docs/gestures`, label: dict.docs.sidebar.gestures, icon: <Hand size={15} /> },
      ],
    },
    {
      title: dict.docs.sidebar.reference,
      items: [
        { href: `/${locale}/docs/api-reference`, label: dict.docs.sidebar.apiReference, icon: <FileCode size={15} /> },
        { href: `/${locale}/docs/types`, label: dict.docs.sidebar.types, icon: <Braces size={15} /> },
        { href: `/${locale}/docs/examples`, label: dict.docs.sidebar.examples, icon: <Image size={15} /> },
      ],
    },
  ];

  return (
    <nav className="w-64 flex-shrink-0 hidden lg:block">
      <div className="sticky top-24 space-y-8">
        {groups.map((group) => (
          <div key={group.title}>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-text-tertiary mb-3 px-3">
              {group.title}
            </h4>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`relative flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg transition-all ${
                        isActive
                          ? 'text-accent bg-accent/10'
                          : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeDoc"
                          className="absolute left-0 top-1 bottom-1 w-0.5 rounded-full bg-accent"
                          transition={{ duration: 0.2 }}
                        />
                      )}
                      {item.icon}
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  );
}
