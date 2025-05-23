import LogingButton from "@/components/auth/login-button";
import { useTranslations } from 'next-intl';

export default function HomePage() {
  const t = useTranslations('HomePage');

  return (
    <div>

      <h1>{t('title')}</h1>
      <br />
      <LogingButton>
        <button>Sign In</button>
      </LogingButton>
    </div >
  )
}