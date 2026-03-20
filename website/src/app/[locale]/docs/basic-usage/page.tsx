import { isValidLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import { notFound } from 'next/navigation';
import { DocsHeader } from '@/components/docs/DocsHeader';
import { AnimatedSection } from '@/components/AnimatedSection';
import { CodeBlock } from '@/components/CodeBlock';

const dataCode = `import type { Candle } from 'react-native-kline-chart';

const data: Candle[] = [
  {
    time: 1700000000000,  // millisecond timestamp
    open: 36500.00,
    high: 36800.50,
    low: 36200.00,
    close: 36650.25,
  },
  {
    time: 1700000060000,
    open: 36650.25,
    high: 36900.00,
    low: 36500.00,
    close: 36420.80,
  },
  // ...more candle data
];`;

const renderCode = `import { KlineChart } from 'react-native-kline-chart';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useWindowDimensions } from 'react-native';

function ChartScreen() {
  const { width } = useWindowDimensions();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KlineChart
        data={data}
        width={width}
        height={450}
      />
    </GestureHandlerRootView>
  );
}`;

const crosshairCode = `import React, { useState, useCallback } from 'react';
import { View, Text } from 'react-native';
import { KlineChart } from 'react-native-kline-chart';
import type { Candle } from 'react-native-kline-chart';

function ChartWithInfo() {
  const [activeCandle, setActiveCandle] = useState<Candle | null>(null);

  const handleCrosshairChange = useCallback((candle: Candle | null) => {
    setActiveCandle(candle);
  }, []);

  return (
    <View>
      {activeCandle && (
        <View style={{ flexDirection: 'row', padding: 12, gap: 16 }}>
          <Text>Open: {activeCandle.open}</Text>
          <Text>High: {activeCandle.high}</Text>
          <Text>Low: {activeCandle.low}</Text>
          <Text>Close: {activeCandle.close}</Text>
        </View>
      )}
      <KlineChart
        data={data}
        width={400}
        height={450}
        showCrosshair
        onCrosshairChange={handleCrosshairChange}
      />
    </View>
  );
}`;

export default async function BasicUsagePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = await getDictionary(locale as Locale);

  return (
    <>
      <DocsHeader title={dict.docs.basicUsage.title} description={dict.docs.basicUsage.description} />

      <div className="space-y-10">
        <AnimatedSection delay={0.1}>
          <h2 className="text-xl font-semibold mb-3">{dict.docs.basicUsage.dataTitle}</h2>
          <p className="text-sm text-text-secondary mb-4">{dict.docs.basicUsage.dataDescription}</p>
          <CodeBlock code={dataCode} language="tsx" filename="data.ts" />
        </AnimatedSection>

        <AnimatedSection delay={0.15}>
          <h2 className="text-xl font-semibold mb-3">{dict.docs.basicUsage.renderTitle}</h2>
          <p className="text-sm text-text-secondary mb-4">{dict.docs.basicUsage.renderDescription}</p>
          <CodeBlock code={renderCode} language="tsx" filename="ChartScreen.tsx" />
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <h2 className="text-xl font-semibold mb-3">{dict.docs.basicUsage.crosshairTitle}</h2>
          <p className="text-sm text-text-secondary mb-4">{dict.docs.basicUsage.crosshairDescription}</p>
          <CodeBlock code={crosshairCode} language="tsx" filename="ChartWithInfo.tsx" />
        </AnimatedSection>
      </div>
    </>
  );
}
