import { isValidLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import { notFound } from 'next/navigation';
import { DocsHeader } from '@/components/docs/DocsHeader';
import { AnimatedSection } from '@/components/AnimatedSection';
import { CodeBlock } from '@/components/CodeBlock';
import Link from 'next/link';

export default async function InstallationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = await getDictionary(locale as Locale);

  return (
    <>
      <DocsHeader title={dict.docs.installation.title} />

      <div className="space-y-10">
        <AnimatedSection delay={0.1}>
          <h2 className="text-xl font-semibold mb-4">{dict.docs.installation.step1Title}</h2>
          <CodeBlock
            code="npm install react-native-kline-chart"
            language="bash"
            filename="terminal"
          />
        </AnimatedSection>

        <AnimatedSection delay={0.15}>
          <h2 className="text-xl font-semibold mb-4">{dict.docs.installation.step2Title}</h2>
          <CodeBlock
            code={`npm install @shopify/react-native-skia \\
  react-native-reanimated \\
  react-native-gesture-handler`}
            language="bash"
            filename="terminal"
          />
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <h2 className="text-xl font-semibold mb-4">{dict.docs.installation.step3Title}</h2>
          <p className="text-sm text-text-secondary mb-4">{dict.docs.installation.step3Description}</p>
          <CodeBlock
            code={`module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: ['react-native-reanimated/plugin'],
};`}
            language="js"
            filename="babel.config.js"
          />
        </AnimatedSection>

        <AnimatedSection delay={0.25}>
          <h2 className="text-xl font-semibold mb-4">{dict.docs.installation.step4Title}</h2>
          <p className="text-sm text-text-secondary mb-4">{dict.docs.installation.step4Description}</p>
          <CodeBlock code="cd ios && pod install && cd .." language="bash" filename="terminal" />
        </AnimatedSection>

        <AnimatedSection delay={0.3}>
          <div className="rounded-2xl border border-accent/20 bg-accent/5 p-6">
            <h3 className="text-lg font-semibold text-accent mb-2">{dict.docs.installation.doneTitle}</h3>
            <p className="text-sm text-text-secondary">
              {dict.docs.installation.doneDescription}{' '}
              <Link href={`/${locale}/docs/quick-start`} className="text-accent hover:underline">
                Quick Start →
              </Link>
            </p>
          </div>
        </AnimatedSection>
      </div>
    </>
  );
}
