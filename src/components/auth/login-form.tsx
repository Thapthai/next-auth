'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { LoginSchema } from '@/schemas';
import CardWrapper from '@/components/auth/card-wrapper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Form, FormControl, FormField, FormItem,
    FormLabel, FormMessage
} from '@/components/ui/form';
import {
    Dialog, DialogContent, DialogHeader,
    DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog";
import { CheckCircle } from "lucide-react";
import { LanguageSwitcher } from '../LanguageSwitcher';

export const LoginForm = () => {
    const t = useTranslations('LoginPage');
    const router = useRouter();

    const [errorModalOpen, setErrorModalOpen] = useState(false);
    const [successModalOpen, setSuccessModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: '',
            password: ''
        },
    });

    const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
        const responseForm = await signIn("credentials", {
            ...values,
            redirect: false,
        });

        if (responseForm?.error) {
            try {
                const errorObj = JSON.parse(responseForm.error);
                if (errorObj.twoFA) {

                    setSuccessModalOpen(true);
                    setTimeout(() => {
                        router.push(`/2fa?userId=${errorObj.user_id}&token=${errorObj.twoFA_token}`);

                    }, 3500);
                }
            } catch (e) {
                if (responseForm?.error === "EMAIL_NOT_VERIFIED") {
                    setModalMessage(t("enailNotVerify"));
                } else if (responseForm?.error === "EMAIL_DOES_NOT_EXIST") {
                    setModalMessage(t("emailPasswordIncorrect"));
                } else {
                    setModalMessage(t("loginFailed"));
                }
                setErrorModalOpen(true);
            }
        }
        else if (responseForm?.ok) {
            setSuccessModalOpen(true);
            setTimeout(() => {
                router.push("/dashboard");
            }, 1500); // รอ 1.5 วินาทีก่อน redirect
        } else {
            setModalMessage(t("loginFailed"));
            setErrorModalOpen(true);
        }
    };

    return (
        <>
            <CardWrapper
                headerLabel={t('topic')}
                leftButtonLabel={t('leftButtonLabel')}
                leftButtonHref='/register'
                rightButtonLabel={t('rightButtonLabel')}
                rightButtonHref='/forget-password'
            >
                <div className="p-8">

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="space-y-4">
                    <LanguageSwitcher />

                                {/* Email */}
                                <FormField control={form.control} name='email' render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('email')}</FormLabel>
                                        <FormControl>
                                            <Input {...field} type='email' />
                                        </FormControl>
                                        <FormMessage className='text-red-600' />
                                    </FormItem>
                                )} />

                                {/* Password */}
                                <FormField control={form.control} name='password' render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('password')}</FormLabel>
                                        <FormControl>
                                            <Input {...field} type='password' />
                                        </FormControl>
                                        <FormMessage className='text-red-600' />
                                    </FormItem>
                                )} />
                            </div>

                            <Button className='w-full mt-3' type='submit'>
                                {t('button')}
                            </Button>
                        </form>
                    </Form>
                </div>
            </CardWrapper>

            {/* ❌ Error Modal */}
            <Dialog open={errorModalOpen} onOpenChange={setErrorModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t('loginFailed')}</DialogTitle>
                        <DialogDescription>{modalMessage}</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={() => setErrorModalOpen(false)}>{t('close')}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ✅ Success Modal */}
            <Dialog open={successModalOpen} onOpenChange={setSuccessModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <div className="flex items-center gap-2 text-green-600">
                            <CheckCircle className="w-6 h-6" />
                            <DialogTitle>{t('loginSuccess')}</DialogTitle>
                        </div>
                        <DialogDescription>
                            {t('redirectingToDashboard')}
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default LoginForm;
