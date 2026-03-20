import { isValidLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import { notFound } from 'next/navigation';
import { DocsHeader } from '@/components/docs/DocsHeader';
import { AnimatedSection } from '@/components/AnimatedSection';
import { CodeBlock } from '@/components/CodeBlock';

const colorsCode = `<KlineChart
  data={data}
  width={width}
  height={450}
  bullishColor="#00C853"
  bearishColor="#FF1744"
  backgroundColor="#1a1a2e"
  gridColor="rgba(255, 255, 255, 0.05)"
  textColor="rgba(255, 255, 255, 0.5)"
  crosshairColor="rgba(255, 255, 255, 0.4)"
/>`;

const candleCode = `<KlineChart
  data={data}
  width={width}
  height={450}
  candleWidth={10}
  candleSpacing={4}
  minCandleWidth={3}
  maxCandleWidth={30}
  rightPaddingCandles={15}
/>`;

const maCode = `<KlineChart
  data={data}
  width={width}
  height={450}
  showMA={true}
  maPeriods={[7, 25, 99]}
  maColors={['#FFD700', '#00BFFF', '#FF69B4']}
/>`;

export default async function CustomizationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = await getDictionary(locale as Locale);

  return (
    <>
      <DocsHeader title={dict.docs.customization.title} description={dict.docs.customization.description} />

      <div className="space-y-10">
        <AnimatedSection delay={0.1}>
          <h2 className="text-xl font-semibold mb-3">{dict.docs.customization.colorsTitle}</h2>
          <p className="text-sm text-text-secondary mb-4">{dict.docs.customization.colorsDescription}</p>
          <CodeBlock code={colorsCode} language="tsx" filename="CustomColors.tsx" />

          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { name: 'bullishColor', color: '#00C853' },
              { name: 'bearishColor', color: '#FF1744' },
              { name: 'backgroundColor', color: '#1a1a2e' },
            ].map((c) => (
              <div key={c.name} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-bg-card border border-border">
                <div className="w-4 h-4 rounded" style={{ background: c.color }} />
                <code className="text-xs font-mono text-text-secondary">{c.name}</code>
              </div>
            ))}
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.15}>
          <h2 className="text-xl font-semibold mb-3">{dict.docs.customization.candleTitle}</h2>
          <p className="text-sm text-text-secondary mb-4">{dict.docs.customization.candleDescription}</p>
          <CodeBlock code={candleCode} language="tsx" filename="CandleSizing.tsx" />
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <h2 className="text-xl font-semibold mb-3">{dict.docs.customization.maTitle}</h2>
          <p className="text-sm text-text-secondary mb-4">{dict.docs.customization.maDescription}</p>
          <CodeBlock code={maCode} language="tsx" filename="MAConfig.tsx" />
        </AnimatedSection>
      </div>
    </>
  );
}
