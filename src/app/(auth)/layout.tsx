import { getLocale } from "next-intl/server";

export default async function LoginLayout({ children }: { children: React.ReactNode }) {
    const locale = await getLocale();
    return (
        <html lang={locale}>
            <body>
                {children}
            </body>
        </html>
    );
}
