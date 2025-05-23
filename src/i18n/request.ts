import { cookies } from 'next/headers';
import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async () => {
  // อ่าน locale จาก cookie ชื่อ 'locale'
  const cookieStore = cookies();
  const cookieLocale = (await cookieStore).get('locale')?.value;

  // fallback เป็น 'th' ถ้าไม่มี cookie
  const locale = cookieLocale ?? 'th';

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});
