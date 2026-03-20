'use client';

import { motion } from 'framer-motion';
import { AnimatedSection } from '@/components/AnimatedSection';
import { CodeBlock } from '@/components/CodeBlock';
import type { Dictionary } from '@/i18n/getDictionary';

const step1Code = `npm install react-native-kline-chart

# peer dependencies
npm install @shopify/react-native-skia \\
  react-native-reanimated \\
  react-native-gesture-handler`;

const step2Code = `import { KlineChart } from 'react-native-kline-chart';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import type { Candle } from 'react-native-kline-chart';`;

const step3Code = `export default function App() {
  const data: Candle[] = [
    { time: 1700000000000, open: 100, high: 105, low: 98, close: 103 },
    { time: 1700000060000, open: 103, high: 107, low: 101, close: 99 },
    // ...more candles
  ];

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KlineChart
        data={data}
        width={400}
        height={600}
        showMA
        showCrosshair
      />
    </GestureHandlerRootView>
  );
}`;

export function QuickStartSection({ dict }: { dict: Dictionary }) {
  const steps = [
    { ...dict.quickStart.step1, code: step1Code, lang: 'bash', file: 'terminal' },
    { ...dict.quickStart.step2, code: step2Code, lang: 'tsx', file: 'App.tsx' },
    { ...dict.quickStart.step3, code: step3Code, lang: 'tsx', file: 'App.tsx' },
  ];

  return (
    <section className="relative py-32 overflow-hidden bg-bg-secondary/30">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            {dict.quickStart.title}
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            {dict.quickStart.subtitle}
          </p>
        </AnimatedSection>

        <div className="space-y-12">
          {steps.map((step, i) => (
            <AnimatedSection
              key={i}
              animation={i % 2 === 0 ? 'slideInLeft' : 'slideInRight'}
              delay={i * 0.1}
            >
              <div className="flex gap-6">
                <div className="flex flex-col items-center flex-shrink-0">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-accent/10 border border-accent/30 text-accent font-bold text-sm"
                  >
                    {i + 1}
                  </motion.div>
                  {i < steps.length - 1 && (
                    <div className="w-px flex-1 bg-gradient-to-b from-accent/30 to-transparent mt-4" />
                  )}
                </div>
                <div className="flex-1 min-w-0 pb-4">
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-text-secondary mb-4">{step.description}</p>
                  <CodeBlock code={step.code} language={step.lang} filename={step.file} />
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
