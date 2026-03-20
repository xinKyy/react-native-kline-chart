import { isValidLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import { notFound } from 'next/navigation';
import { DocsSidebar } from '@/components/docs/DocsSidebar';
import { MobileDocNav } from '@/components/docs/MobileDocNav';

export default async function DocsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = await getDictionary(locale as Locale);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <MobileDocNav locale={locale as Locale} dict={dict} />
        <div className="flex gap-12">
          <DocsSidebar locale={locale as Locale} dict={dict} />
          <div className="flex-1 min-w-0 max-w-3xl">{children}</div>
        </div>
      </div>
    </div>
  );
}
