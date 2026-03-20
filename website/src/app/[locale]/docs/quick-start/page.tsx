import { isValidLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import { notFound } from 'next/navigation';
import { DocsHeader } from '@/components/docs/DocsHeader';
import { AnimatedSection } from '@/components/AnimatedSection';
import { CodeBlock } from '@/components/CodeBlock';
import Link from 'next/link';

const basicCode = `import { KlineChart } from 'react-native-kline-chart';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import type { Candle } from 'react-native-kline-chart';

const data: Candle[] = [
  { time: 1700000000000, open: 100, high: 105, low: 98, close: 103 },
  { time: 1700000060000, open: 103, high: 107, low: 101, close: 99 },
  // ...more candles
];

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KlineChart data={data} width={400} height={600} />
    </GestureHandlerRootView>
  );
}`;

const advancedCode = `import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, useWindowDimensions } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KlineChart } from 'react-native-kline-chart';
import type { Candle } from 'react-native-kline-chart';

export default function App() {
  const { width } = useWindowDimensions();
  const [activeCandle, setActiveCandle] = useState<Candle | null>(null);

  const handleCrosshairChange = useCallback((candle: Candle | null) => {
    setActiveCandle(candle);
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {activeCandle && (
        <View style={{ padding: 16 }}>
          <Text>O: {activeCandle.open}  H: {activeCandle.high}</Text>
          <Text>L: {activeCandle.low}   C: {activeCandle.close}</Text>
        </View>
      )}
      <KlineChart
        data={data}
        width={width}
        height={450}
        showMA
        maPeriods={[5, 10, 20]}
        maColors={['#F7931A', '#5B8DEF', '#C084FC']}
        showCrosshair
        onCrosshairChange={handleCrosshairChange}
        bullishColor="#2DC08E"
        bearishColor="#F6465D"
        backgroundColor="#0B0E11"
      />
    </GestureHandlerRootView>
  );
}`;

export default async function QuickStartPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = await getDictionary(locale as Locale);

  return (
    <>
      <DocsHeader title={dict.docs.quickStart.title} description={dict.docs.quickStart.description} />

      <div className="space-y-10">
        <AnimatedSection delay={0.1}>
          <h2 className="text-xl font-semibold mb-3">{dict.docs.quickStart.basicTitle}</h2>
          <p className="text-sm text-text-secondary mb-4">{dict.docs.quickStart.basicDescription}</p>
          <CodeBlock code={basicCode} language="tsx" filename="App.tsx" />
        </AnimatedSection>

        <AnimatedSection delay={0.15}>
          <h2 className="text-xl font-semibold mb-3">{dict.docs.quickStart.propsTitle}</h2>
          <p className="text-sm text-text-secondary mb-4">{dict.docs.quickStart.propsDescription}</p>
          <CodeBlock code={advancedCode} language="tsx" filename="App.tsx" />
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <h2 className="text-xl font-semibold mb-4">{dict.docs.quickStart.nextTitle}</h2>
          <ul className="space-y-3">
            {dict.docs.quickStart.nextItems.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-text-secondary">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex gap-4">
            <Link
              href={`/${locale}/docs/api-reference`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent/10 text-accent text-sm font-medium hover:bg-accent/20 transition-colors"
            >
              API Reference →
            </Link>
            <Link
              href={`/${locale}/docs/examples`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border text-text-secondary text-sm font-medium hover:bg-white/5 transition-colors"
            >
              Examples →
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </>
  );
}
