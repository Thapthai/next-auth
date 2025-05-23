'use client';

import CardWrapper from '@/components/auth/card-wrapper';
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterSchema } from '@/schemas';
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

import { useState, useTransition } from 'react';
import { register } from '@/actions/register';
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

export const RegisterForm = () => {

    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | undefined>('');
    const [success, setSuccess] = useState<string | undefined>('');

    const t = useTranslations('RegisterPage');


    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            email: '',
            password: '',
            name: ''
        },
    });
    const onSubmit = (values: z.infer<typeof RegisterSchema>) => {

        setError('');
        setSuccess('');
        startTransition(() => {
            register(values)
                .then((data) => {
                    setError(data.error);
                    setSuccess(data.success)
                })
        });
    };

    return (
        // <CardWrapper
        //     headerLabel='ลงทะเบียนบัญชีใหม่'
        //     leftButtonLabel='เข้าสู่ระบบ'
        //     leftButtonHref='/login'
        //     rightButtonHref=''
        //     rightButtonLabel=''
        // >
        <CardWrapper
            headerLabel={t('topic')}
            leftButtonLabel={t('leftButtonLabel')}
            leftButtonHref='/login'
            rightButtonLabel=''
            rightButtonHref=''
        >
            <div className="p-8">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <LanguageSwitcher />


                        <div className="space-y-4">
                            <FormField control={form.control}
                                name='name'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('name')}</FormLabel>
                                        <FormControl>
                                            <Input {...field}
                                                disabled={isPending}
                                                type='text'
                                            ></Input>
                                        </FormControl>

                                        <FormMessage className='text-red-600' />
                                    </FormItem>
                                )}>
                            </FormField>

                            <FormField control={form.control}
                                name='email'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('email')}</FormLabel>
                                        <FormControl>
                                            <Input {...field}
                                                disabled={isPending}
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
                                                disabled={isPending}
                                                type='password'
                                            ></Input>
                                        </FormControl>

                                        <FormMessage className='text-red-600' />
                                    </FormItem>
                                )}>
                            </FormField>
                        </div>

                        <Button className='w-full mt-3 bg-blue-500 text-neutral-50 text-shadow-amber-50'
                            disabled={isPending}
                            type='submit'>
                            ลงทะเบียน
                        </Button>

                    </form>
                </Form>
            </div>
        </CardWrapper >

    )
}
export default RegisterForm