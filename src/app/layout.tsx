import "./globals.css";
import SessionLayoutProvider from "@/providers/sessionLayout";

import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';


export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {

  const locale = await getLocale();
  const messages = await getMessages();

  if (!messages) notFound();

  return (
    <html lang={locale}>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <SessionLayoutProvider>

          <body>
              {children}
          </body>
        </SessionLayoutProvider>
      </NextIntlClientProvider>
    </html>
  );
}
