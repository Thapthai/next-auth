import LogingButton from "@/components/auth/login-button";
import { useTranslations } from 'next-intl';

export default function HomePage() {
  const t = useTranslations('HomePage');

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 to-indigo-200 flex flex-col items-center justify-center px-4">
      <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 text-center drop-shadow-lg">
        {t('title')}
      </h1>

      <p className="text-white text-lg md:text-xl max-w-xl text-center mb-10 drop-shadow-md">
        {t('subtitle')}
      </p>

      <LogingButton>
        <button
          type="button"
          className="px-8 py-3 bg-white text-indigo-600 font-semibold rounded-md shadow-lg hover:bg-indigo-50 transition"
        >
          {t('signIn') || 'Sign In'}
        </button>
      </LogingButton>
    </div>
  );
}
