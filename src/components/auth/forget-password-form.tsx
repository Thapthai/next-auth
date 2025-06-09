'use client';

import CardWrapper from '@/components/auth/card-wrapper';
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { ForgetPasswordSchema } from '@/schemas';
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
import { toast } from 'sonner'; // เพิ่มตรงนี้ด้วย
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Toaster } from '../ui/sonner';
import { LanguageSwitcher } from '../LanguageSwitcher';
import { useTranslations } from 'next-intl';



export const ForgetPasswordForm = () => {
    const t = useTranslations('ForgetPasswordPage');

    const form = useForm<z.infer<typeof ForgetPasswordSchema>>({
        resolver: zodResolver(ForgetPasswordSchema),
        defaultValues: {
            email: ''
        },
    });

    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const onSubmit = async (values: z.infer<typeof ForgetPasswordSchema>) => {
        setLoading(true);
        try {
            const res = await fetch('http://localhost:3000/auth/forget-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message || 'ไม่สามารถส่งอีเมลได้');
            } else {
                toast.success('ส่งอีเมลสำเร็จ! กรุณาตรวจสอบกล่องจดหมายของคุณ');
                router.push("/login");
            }
        } catch (error) {
            console.error(error);
            toast.error('เกิดข้อผิดพลาด');
        }
    };

    return (

        <CardWrapper
            headerLabel={t('topic')}
            leftButtonLabel={t('login')}
            leftButtonHref='/login'
            rightButtonLabel={t('register')}
            rightButtonHref='/register'

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
                        </div>

                        <Button className='w-full mt-3 text-neutral-50 text-shadow-amber-50'
                            type='submit' disabled={loading} >
                            {loading ? t('sendingEmail') : t('sendButton')}
                        </Button>
                        <Toaster />
                    </form>
                </Form>
            </div>
        </CardWrapper>


    )
}
export default ForgetPasswordForm