import { isValidLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import { notFound } from 'next/navigation';
import { DocsHeader } from '@/components/docs/DocsHeader';
import { AnimatedSection } from '@/components/AnimatedSection';
import { MoveHorizontal, ZoomIn, Crosshair } from 'lucide-react';

export default async function GesturesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = await getDictionary(locale as Locale);

  const gestures = [
    {
      icon: <MoveHorizontal size={24} />,
      title: dict.docs.gesturesGuide.panTitle,
      description: dict.docs.gesturesGuide.panDescription,
      gradient: 'from-accent/20 to-accent/5',
    },
    {
      icon: <ZoomIn size={24} />,
      title: dict.docs.gesturesGuide.pinchTitle,
      description: dict.docs.gesturesGuide.pinchDescription,
      gradient: 'from-ma2/20 to-ma2/5',
    },
    {
      icon: <Crosshair size={24} />,
      title: dict.docs.gesturesGuide.crosshairTitle,
      description: dict.docs.gesturesGuide.crosshairDescription,
      gradient: 'from-ma3/20 to-ma3/5',
    },
  ];

  return (
    <>
      <DocsHeader title={dict.docs.gesturesGuide.title} description={dict.docs.gesturesGuide.description} />

      <div className="space-y-6">
        {gestures.map((gesture, i) => (
          <AnimatedSection key={i} delay={0.1 + i * 0.05}>
            <div className={`relative rounded-2xl border border-border bg-bg-card/50 p-8 overflow-hidden`}>
              <div className={`absolute inset-0 bg-gradient-to-br ${gesture.gradient} opacity-30`} />
              <div className="relative flex gap-5">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/5 border border-border flex-shrink-0 text-accent">
                  {gesture.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">{gesture.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {gesture.description}
                  </p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </>
  );
}
