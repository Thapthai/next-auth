'use client';

import CardWrapper from '@/components/auth/card-wrapper';
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginSchema } from '@/schemas';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from '../LanguageSwitcher';


export const LoginForm = () => {
    const t = useTranslations('LoginPage');

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: '',
            password: ''
        },
    });

    const router = useRouter();

    // Current Version 
    const onSubmit = async (values: z.infer<typeof LoginSchema>) => {

        const responseForm = await signIn("credentials", {
            ...values,
            redirect: false,
        });

        if (responseForm?.error) {

            try {
                const errorObj = JSON.parse(responseForm.error);
                if (errorObj.twoFA) {
                    router.push(`/2fa?userId=${errorObj.user_id}&token=${errorObj.twoFA_token}`);
                }

                if (responseForm?.error === "EMAIL_NOT_VERIFIED") {
                    router.push("/waiting-verify");
                } else if (responseForm?.error === "EMAIL_DOES_NOT_EXIST") {
                    alert("Email or Password Incorrect !");

                }
            } catch (e) {
                alert('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
            }
        }
        else if (responseForm?.ok) {
            router.push("/dashboard");
        } else {
            alert("Login failed");
        }
    };

    return (
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

                            <FormField control={form.control}
                                name='email'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('email')}</FormLabel>
                                        <FormControl>
                                            <Input {...field}
                                                type='email'
                                            ></Input>
                                        </FormControl>

                                        <FormMessage className='text-red-600' />
                                    </FormItem>
                                )}>
                            </FormField>

                            <FormField control={form.control}
                                name='password'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('password')}</FormLabel>
                                        <FormControl>
                                            <Input {...field}
                                                type='password'
                                            ></Input>
                                        </FormControl>

                                        <FormMessage className='text-red-600' />
                                    </FormItem>
                                )}>
                            </FormField>
                        </div>

                        <Button className='w-full mt-3 text-neutral-50 text-shadow-amber-50'
                            type='submit'>
                            {t('button')}
                        </Button>

                    </form>
                </Form>
            </div>
        </CardWrapper>

    )
}
export default LoginForm