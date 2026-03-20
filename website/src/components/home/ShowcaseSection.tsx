'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/AnimatedSection';
import type { Dictionary } from '@/i18n/getDictionary';

const showcaseItems = [
  { src: '/examples/screenshot1.png', alt: 'KLine Chart Screenshot 1', type: 'image' as const },
  { src: '/examples/screenshot2.png', alt: 'KLine Chart Screenshot 2', type: 'image' as const },
  { src: '/examples/demo.gif', alt: 'KLine Chart Demo', type: 'gif' as const },
];

export function ShowcaseSection({ dict }: { dict: Dictionary }) {
  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            {dict.showcase.title}
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            {dict.showcase.subtitle}
          </p>
        </AnimatedSection>

        <StaggerContainer
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          staggerDelay={0.15}
        >
          {showcaseItems.map((item, i) => (
            <StaggerItem key={i}>
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="group relative overflow-hidden rounded-2xl border border-border bg-bg-card/50 hover:border-accent/30 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-bg/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                <div className="relative aspect-[9/16] bg-bg-secondary flex items-center justify-center overflow-hidden">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    unoptimized={item.type === 'gif'}
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-medium">
                    {item.type === 'gif' ? 'Live Demo' : 'Screenshot'}
                  </span>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <AnimatedSection delay={0.4} className="text-center mt-8">
          <p className="text-sm text-text-tertiary">
            Place your screenshots at <code className="px-1.5 py-0.5 rounded bg-bg-card font-mono text-xs text-accent">public/examples/</code>
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
}
