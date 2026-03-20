import { isValidLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import { notFound } from 'next/navigation';
import { DocsHeader } from '@/components/docs/DocsHeader';
import { AnimatedSection } from '@/components/AnimatedSection';
import { Check } from 'lucide-react';
import Link from 'next/link';

export default async function DocsOverviewPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = await getDictionary(locale as Locale);

  return (
    <>
      <DocsHeader title={dict.docs.overview.title} />

      <AnimatedSection delay={0.1} className="prose-custom">
        <p className="text-text-secondary leading-relaxed text-base mb-8">
          {dict.docs.overview.intro}
        </p>

        <h2 className="text-2xl font-semibold mb-4">{dict.docs.overview.whyTitle}</h2>
        <ul className="space-y-3 mb-10">
          {dict.docs.overview.whyItems.map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-0.5 flex items-center justify-center w-5 h-5 rounded-full bg-accent/10 flex-shrink-0">
                <Check size={12} className="text-accent" />
              </span>
              <span className="text-text-secondary text-sm">{item}</span>
            </li>
          ))}
        </ul>

        <h2 className="text-2xl font-semibold mb-4">{dict.docs.overview.requirementsTitle}</h2>
        <ul className="space-y-2 mb-10">
          {dict.docs.overview.requirements.map((req, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-text-secondary">
              <span className="w-1.5 h-1.5 rounded-full bg-accent/50" />
              <code className="px-1.5 py-0.5 rounded bg-bg-card border border-border font-mono text-xs">
                {req}
              </code>
            </li>
          ))}
        </ul>

        <div className="flex gap-4">
          <Link
            href={`/${locale}/docs/installation`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-bg font-semibold text-sm hover:bg-accent-hover transition-colors"
          >
            {dict.docs.sidebar.installation} →
          </Link>
        </div>
      </AnimatedSection>
    </>
  );
}
