import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { getMessages, getLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { SocketAlert } from "./SocketAlert";
import LoadingProvider from "./LoadingProvider";

export default async function PageLayout({
  children
}: {
  children: React.ReactNode;
}) {

  const locale = await getLocale();
  const messages = await getMessages();

  if (!messages) notFound();

  return (
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
        <SocketAlert />
        <LoadingProvider>
          {children}
        </LoadingProvider>
      </SidebarInset>
    </SidebarProvider>
  );
}
