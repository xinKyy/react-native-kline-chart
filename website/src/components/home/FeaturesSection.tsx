'use client';

import { motion } from 'framer-motion';
import { Cpu, Hand, Gauge, TrendingUp, Crosshair, Palette } from 'lucide-react';
import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/AnimatedSection';
import type { Dictionary } from '@/i18n/getDictionary';

const iconMap = [Cpu, Hand, Gauge, TrendingUp, Crosshair, Palette];
const gradients = [
  'from-accent/20 to-accent/5',
  'from-ma2/20 to-ma2/5',
  'from-bearish/20 to-bearish/5',
  'from-ma1/20 to-ma1/5',
  'from-ma3/20 to-ma3/5',
  'from-accent/20 to-ma2/5',
];
const iconColors = [
  'text-accent',
  'text-ma2',
  'text-bearish',
  'text-ma1',
  'text-ma3',
  'text-accent',
];

export function FeaturesSection({ dict }: { dict: Dictionary }) {
  const features = [
    dict.features.skia,
    dict.features.gestures,
    dict.features.performance,
    dict.features.indicators,
    dict.features.crosshair,
    dict.features.customizable,
  ];

  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            {dict.features.title}
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            {dict.features.subtitle}
          </p>
        </AnimatedSection>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.08}>
          {features.map((feature, i) => {
            const Icon = iconMap[i];
            return (
              <StaggerItem key={i}>
                <motion.div
                  whileHover={{ y: -4, scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  className="group relative h-full rounded-2xl border border-border bg-bg-card/50 p-8 hover:border-border-hover hover:bg-bg-card-hover/50 transition-colors"
                >
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradients[i]} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  <div className="relative">
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/5 border border-border mb-5 ${iconColors[i]}`}>
                      <Icon size={22} />
                    </div>
                    <h3 className="text-lg font-semibold mb-3">{feature.title}</h3>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
