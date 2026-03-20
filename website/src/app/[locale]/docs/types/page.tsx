import { isValidLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import { notFound } from 'next/navigation';
import { DocsHeader } from '@/components/docs/DocsHeader';
import { AnimatedSection } from '@/components/AnimatedSection';
import { CodeBlock } from '@/components/CodeBlock';

const candleType = `type Candle = {
  time: number;   // millisecond timestamp
  open: number;   // opening price
  high: number;   // highest price
  low: number;    // lowest price
  close: number;  // closing price
};`;

const propsType = `type KlineChartProps = {
  // Required
  data: Candle[];
  width: number;
  height: number;

  // Candle appearance
  candleWidth?: number;          // default: 8
  candleSpacing?: number;        // default: 3
  minCandleWidth?: number;       // default: 2
  maxCandleWidth?: number;       // default: 24
  bullishColor?: string;         // default: '#2DC08E'
  bearishColor?: string;         // default: '#F6465D'

  // Moving Average
  showMA?: boolean;              // default: true
  maPeriods?: number[];          // default: [5, 10]
  maColors?: string[];           // default: ['#F7931A', '#5B8DEF', '#C084FC']

  // Crosshair
  showCrosshair?: boolean;       // default: true
  crosshairColor?: string;       // default: 'rgba(255,255,255,0.3)'
  onCrosshairChange?: (candle: Candle | null) => void;

  // Layout & Colors
  backgroundColor?: string;      // default: '#0B0E11'
  gridColor?: string;            // default: 'rgba(255,255,255,0.2)'
  textColor?: string;            // default: 'rgba(255,255,255,0.35)'
  rightPaddingCandles?: number;  // default: 20
};`;

const computeMAType = `function computeMA(
  data: Candle[],
  period: number
): (number | null)[];

// Returns an array of MA values.
// null for indices where period hasn't been reached yet.`;

export default async function TypesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = await getDictionary(locale as Locale);

  return (
    <>
      <DocsHeader
        title={dict.docs.apiReference.typesTitle}
        description={dict.docs.apiReference.description}
      />

      <div className="space-y-10">
        <AnimatedSection delay={0.1}>
          <h2 className="text-xl font-semibold mb-3">{dict.docs.apiReference.candleType}</h2>
          <p className="text-sm text-text-secondary mb-4">{dict.docs.apiReference.candleDescription}</p>
          <CodeBlock code={candleType} language="typescript" filename="types.ts" />
        </AnimatedSection>

        <AnimatedSection delay={0.15}>
          <h2 className="text-xl font-semibold mb-3">KlineChartProps</h2>
          <CodeBlock code={propsType} language="typescript" filename="types.ts" />
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <h2 className="text-xl font-semibold mb-3">computeMA</h2>
          <CodeBlock code={computeMAType} language="typescript" filename="indicators.ts" />
        </AnimatedSection>
      </div>
    </>
  );
}
