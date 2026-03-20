import { isValidLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import { notFound } from 'next/navigation';
import { DocsHeader } from '@/components/docs/DocsHeader';
import { AnimatedSection } from '@/components/AnimatedSection';
import { CodeBlock } from '@/components/CodeBlock';
import Image from 'next/image';

const basicExample = `import { KlineChart } from 'react-native-kline-chart';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

function BasicChart({ data, width }) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KlineChart data={data} width={width} height={400} />
    </GestureHandlerRootView>
  );
}`;

const fullExample = `import React, { useState, useCallback } from 'react';
import { View, Text, useWindowDimensions, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KlineChart } from 'react-native-kline-chart';
import type { Candle } from 'react-native-kline-chart';

export default function FullFeaturedChart({ data }: { data: Candle[] }) {
  const { width } = useWindowDimensions();
  const [active, setActive] = useState<Candle | null>(null);

  const onCrosshair = useCallback((c: Candle | null) => setActive(c), []);

  return (
    <GestureHandlerRootView style={styles.root}>
      {active && (
        <View style={styles.infoBar}>
          <Text style={styles.pair}>BTC/USDT</Text>
          <Text style={styles.ohlc}>
            O:{active.open} H:{active.high} L:{active.low} C:{active.close}
          </Text>
        </View>
      )}
      <KlineChart
        data={data}
        width={width}
        height={500}
        showMA
        maPeriods={[5, 10, 20]}
        maColors={['#F7931A', '#5B8DEF', '#C084FC']}
        showCrosshair
        onCrosshairChange={onCrosshair}
        candleWidth={8}
        candleSpacing={3}
        bullishColor="#2DC08E"
        bearishColor="#F6465D"
        backgroundColor="#0B0E11"
        gridColor="rgba(255,255,255,0.06)"
        textColor="rgba(255,255,255,0.35)"
      />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0B0E11' },
  infoBar: { padding: 16, gap: 4 },
  pair: { color: '#fff', fontSize: 18, fontWeight: '700' },
  ohlc: { color: 'rgba(255,255,255,0.6)', fontSize: 12, fontFamily: 'monospace' },
});`;

const darkThemeExample = `<KlineChart
  data={data}
  width={width}
  height={500}
  backgroundColor="#0f0f1a"
  bullishColor="#4ade80"
  bearishColor="#f87171"
  gridColor="rgba(148, 163, 184, 0.06)"
  textColor="rgba(148, 163, 184, 0.4)"
  crosshairColor="rgba(148, 163, 184, 0.3)"
  showMA
  maPeriods={[7, 25, 99]}
  maColors={['#fbbf24', '#60a5fa', '#a78bfa']}
/>`;

export default async function ExamplesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = await getDictionary(locale as Locale);

  const screenshots = [
    { src: '/examples/1.png', alt: 'Screenshot 1' },
    { src: '/examples/2.png', alt: 'Screenshot 2' },
    { src: '/examples/demo.gif', alt: 'Demo GIF' },
  ];

  return (
    <>
      <DocsHeader title={dict.docs.examples.title} description={dict.docs.examples.description} />

      <div className="space-y-12">
        <AnimatedSection delay={0.1}>
          <h2 className="text-xl font-semibold mb-3">{dict.docs.examples.basicTitle}</h2>
          <p className="text-sm text-text-secondary mb-4">{dict.docs.examples.basicDescription}</p>
          <CodeBlock code={basicExample} language="tsx" filename="BasicChart.tsx" />
        </AnimatedSection>

        <AnimatedSection delay={0.15}>
          <h2 className="text-xl font-semibold mb-3">{dict.docs.examples.fullTitle}</h2>
          <p className="text-sm text-text-secondary mb-4">{dict.docs.examples.fullDescription}</p>
          <CodeBlock code={fullExample} language="tsx" filename="FullFeaturedChart.tsx" />
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <h2 className="text-xl font-semibold mb-3">{dict.docs.examples.darkTitle}</h2>
          <p className="text-sm text-text-secondary mb-4">{dict.docs.examples.darkDescription}</p>
          <CodeBlock code={darkThemeExample} language="tsx" filename="DarkTheme.tsx" />
        </AnimatedSection>

        <AnimatedSection delay={0.25}>
          <h2 className="text-xl font-semibold mb-6">{dict.docs.examples.screenshotsTitle}</h2>
          <p className="text-sm text-text-secondary mb-6">{dict.docs.examples.screenshotsDescription}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {screenshots.map((img, i) => (
              <div
                key={i}
                className="relative aspect-[1179/2556] rounded-xl border border-border overflow-hidden bg-bg-secondary"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 33vw"
                  unoptimized={img.src.endsWith('.gif')}
                />
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-text-tertiary">
            Place your images at{' '}
            <code className="px-1.5 py-0.5 rounded bg-bg-card font-mono text-accent">
              website/public/examples/
            </code>{' '}
            — screenshot1.png, screenshot2.png, demo.gif
          </p>
        </AnimatedSection>
      </div>
    </>
  );
}
