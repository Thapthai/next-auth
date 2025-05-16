'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import ResetPasswordForm from '@/components/auth/reset-password-form';

const ResetPasswordPage = () => {
    const searchParams = useSearchParams();
    const email = searchParams.get('email') ?? '';
    const token = searchParams.get('token') ?? '';

    return (

        <div className="container mx-auto p-8 flex">
            <div className="max-w-md w-full mx-auto">
                <ResetPasswordForm
                    email={email}
                    token={token}
                />
            </div>
        </div>

    );
};

export default ResetPasswordPage;
