import { getLocale } from "next-intl/server";

export default async function LoginLayout({ children }: { children: React.ReactNode }) {
    const locale = await getLocale();
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            {children}
        </div>
    );
}
