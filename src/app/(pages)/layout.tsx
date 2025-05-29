import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { getMessages, getLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

export default async function PageLayout({
  children
}: {
  children: React.ReactNode;
}) {

  const locale = await getLocale();
  const messages = await getMessages();

  if (!messages) notFound();

  return (

    <html lang={locale}>

      <body>

        <SidebarProvider
          style={
            {
              "--sidebar-width": "calc(var(--spacing) * 72)",
              "--header-height": "calc(var(--spacing) * 12)",
            } as React.CSSProperties
          }
        >
          <AppSidebar variant="inset" />
          <SidebarInset>
            
            {children}

          </SidebarInset>
        </SidebarProvider>
      </body>

    </html>
  );
}
