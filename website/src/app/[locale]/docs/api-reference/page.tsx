import { isValidLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import { notFound } from 'next/navigation';
import { DocsHeader } from '@/components/docs/DocsHeader';
import { AnimatedSection } from '@/components/AnimatedSection';
import { CodeBlock } from '@/components/CodeBlock';

const importCode = `import { KlineChart, computeMA } from 'react-native-kline-chart';
import type { Candle, KlineChartProps } from 'react-native-kline-chart';`;

const componentUsage = `<KlineChart
  data={candles}
  width={screenWidth}
  height={450}
  candleWidth={8}
  candleSpacing={3}
  showMA={true}
  maPeriods={[5, 10]}
  showCrosshair={true}
  onCrosshairChange={(candle) => console.log(candle)}
/>`;

export default async function ApiReferencePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = await getDictionary(locale as Locale);
  const api = dict.docs.apiReference;

  return (
    <>
      <DocsHeader title={api.title} description={api.description} />

      <div className="space-y-12">
        <AnimatedSection delay={0.1}>
          <h2 className="text-2xl font-semibold mb-3">{api.componentTitle}</h2>
          <p className="text-sm text-text-secondary mb-4">{api.componentDescription}</p>
          <CodeBlock code={componentUsage} language="tsx" filename="usage.tsx" />
        </AnimatedSection>

        <AnimatedSection delay={0.15}>
          <h2 className="text-2xl font-semibold mb-6">{api.propsTitle}</h2>
          <div className="overflow-x-auto rounded-2xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-bg-card/50">
                  <th className="text-left px-4 py-3 font-semibold text-text-primary">{api.prop}</th>
                  <th className="text-left px-4 py-3 font-semibold text-text-primary">{api.type}</th>
                  <th className="text-left px-4 py-3 font-semibold text-text-primary">{api.default}</th>
                  <th className="text-left px-4 py-3 font-semibold text-text-primary">{api.required}</th>
                  <th className="text-left px-4 py-3 font-semibold text-text-primary">{api.descriptionLabel}</th>
                </tr>
              </thead>
              <tbody>
                {api.propsData.map((row, i) => (
                  <tr
                    key={row.prop}
                    className={`border-b border-border/50 ${i % 2 === 0 ? '' : 'bg-bg-card/20'}`}
                  >
                    <td className="px-4 py-3">
                      <code className="text-accent font-mono text-xs">{row.prop}</code>
                    </td>
                    <td className="px-4 py-3">
                      <code className="text-ma2 font-mono text-xs whitespace-nowrap">{row.type}</code>
                    </td>
                    <td className="px-4 py-3">
                      <code className="text-text-tertiary font-mono text-xs">{row.default}</code>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium ${row.required === 'Yes' || row.required === '是' ? 'text-bearish' : 'text-text-tertiary'}`}>
                        {row.required}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-text-secondary text-xs">{row.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <h2 className="text-2xl font-semibold mb-4">{api.exportedTitle}</h2>
          <p className="text-sm text-text-secondary mb-4">{api.exportedDescription}</p>
          <CodeBlock code={importCode} language="tsx" filename="imports.ts" />
        </AnimatedSection>
      </div>
    </>
  );
}
