import "./globals.css";
import SessionLayoutProvider from "@/providers/sessionLayout";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (

    <html lang="en">
      <SessionLayoutProvider>
        <body>
          {children}
        </body>
      </SessionLayoutProvider>
    </html>
  );
}
