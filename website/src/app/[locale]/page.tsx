import { isValidLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import { notFound } from 'next/navigation';
import { HeroSection } from '@/components/home/HeroSection';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { QuickStartSection } from '@/components/home/QuickStartSection';
import { ShowcaseSection } from '@/components/home/ShowcaseSection';
import { CTASection } from '@/components/home/CTASection';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = await getDictionary(locale as Locale);

  return (
    <>
      <HeroSection dict={dict} locale={locale as Locale} />
      <FeaturesSection dict={dict} />
      <QuickStartSection dict={dict} />
      <ShowcaseSection dict={dict} />
      <CTASection dict={dict} locale={locale as Locale} />
    </>
  );
}
