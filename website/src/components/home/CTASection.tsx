'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { AnimatedSection } from '@/components/AnimatedSection';
import type { Dictionary } from '@/i18n/getDictionary';
import type { Locale } from '@/i18n/config';

export function CTASection({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-accent/5 rounded-full blur-[150px]" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center">
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="relative rounded-3xl border border-border bg-bg-card/30 p-16 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-ma2/5" />
            <div className="relative">
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
                {dict.cta.title}
              </h2>
              <p className="text-lg text-text-secondary mb-10 max-w-xl mx-auto">
                {dict.cta.description}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href={`/${locale}/docs`}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-accent text-bg font-semibold text-sm hover:bg-accent-hover transition-all"
                >
                  {dict.cta.button}
                  <ArrowRight size={16} />
                </Link>
                <a
                  href="https://github.com/xinKyy/react-native-kline-chart"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl border border-border text-text-primary font-semibold text-sm hover:bg-white/5 hover:border-border-hover transition-all"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  {dict.cta.github}
                </a>
              </div>
            </div>
          </motion.div>
        </AnimatedSection>
      </div>
    </section>
  );
}
