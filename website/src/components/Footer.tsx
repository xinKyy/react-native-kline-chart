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
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-bg-card border border-border overflow-hidden">
                <svg width="20" height="20" viewBox="0 0 512 512" fill="none">
                  <line x1="138" y1="100" x2="138" y2="412" stroke="#F6465D" strokeWidth="28" strokeLinecap="round" />
                  <rect x="108" y="160" width="60" height="180" rx="8" fill="#F6465D" />
                  <line x1="256" y1="70" x2="256" y2="380" stroke="#2DC08E" strokeWidth="28" strokeLinecap="round" />
                  <rect x="226" y="130" width="60" height="200" rx="8" fill="#2DC08E" />
                  <line x1="374" y1="120" x2="374" y2="400" stroke="#2DC08E" strokeWidth="28" strokeLinecap="round" />
                  <rect x="344" y="200" width="60" height="120" rx="8" fill="#2DC08E" />
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
