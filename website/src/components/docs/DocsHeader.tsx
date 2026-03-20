'use client';

import { AnimatedSection } from '@/components/AnimatedSection';

export function DocsHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <AnimatedSection className="mb-12">
      <h1 className="text-4xl font-bold tracking-tight mb-3">{title}</h1>
      {description && (
        <p className="text-lg text-text-secondary leading-relaxed max-w-3xl">
          {description}
        </p>
      )}
      <div className="mt-6 h-px bg-gradient-to-r from-accent/30 via-border to-transparent" />
    </AnimatedSection>
  );
}
