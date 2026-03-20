import Link from 'next/link';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/getDictionary';

export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <footer className="border-t border-border bg-bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 border border-accent/20">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-accent">
                  <rect x="3" y="8" width="4" height="8" rx="1" fill="currentColor" />
                  <line x1="5" y1="5" x2="5" y2="19" stroke="currentColor" strokeWidth="1.5" />
                  <rect x="10" y="6" width="4" height="12" rx="1" fill="currentColor" opacity="0.7" />
                  <line x1="12" y1="3" x2="12" y2="21" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />
                  <rect x="17" y="9" width="4" height="6" rx="1" fill="currentColor" opacity="0.5" />
                  <line x1="19" y1="6" x2="19" y2="18" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
                </svg>
              </div>
              <span className="font-semibold">React Native KLine Chart</span>
            </div>
            <p className="text-sm text-text-secondary max-w-md leading-relaxed">
              {dict.footer.description}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4">{dict.footer.resources}</h3>
            <ul className="space-y-3">
              <li>
                <Link href={`/${locale}/docs`} className="text-sm text-text-secondary hover:text-accent transition-colors">
                  {dict.footer.docs}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/docs/api-reference`} className="text-sm text-text-secondary hover:text-accent transition-colors">
                  {dict.footer.apiRef}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/docs/examples`} className="text-sm text-text-secondary hover:text-accent transition-colors">
                  {dict.footer.examples}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4">{dict.footer.community}</h3>
            <ul className="space-y-3">
              <li>
                <a href="https://github.com/xinKyy/react-native-kline-chart" target="_blank" rel="noopener noreferrer" className="text-sm text-text-secondary hover:text-accent transition-colors">
                  {dict.footer.github}
                </a>
              </li>
              <li>
                <a href="https://github.com/xinKyy/react-native-kline-chart/issues" target="_blank" rel="noopener noreferrer" className="text-sm text-text-secondary hover:text-accent transition-colors">
                  {dict.footer.issues}
                </a>
              </li>
              <li>
                <a href="https://github.com/xinKyy/react-native-kline-chart/releases" target="_blank" rel="noopener noreferrer" className="text-sm text-text-secondary hover:text-accent transition-colors">
                  {dict.footer.releases}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-tertiary">
            © {new Date().getFullYear()} React Native KLine Chart. MIT License.
          </p>
          <p className="text-xs text-text-tertiary">
            {dict.footer.builtWith} Next.js & Tailwind CSS {dict.footer.by} xinKyy
          </p>
        </div>
      </div>
    </footer>
  );
}
