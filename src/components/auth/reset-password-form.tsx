'use client';

import CardWrapper from '@/components/auth/card-wrapper';
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { ResetPasswordSchema } from '@/schemas';
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

type ResetPasswordFormProps = {
    email: string;
    token: string;
};

const ResetPasswordForm = ({ email, token }: ResetPasswordFormProps) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    const form = useForm<z.infer<typeof ResetPasswordSchema>>({
        resolver: zodResolver(ResetPasswordSchema),
        defaultValues: {
            password: '',
            conPassword: ''
        },
    });

    const router = useRouter();

    const [loading, setLoading] = useState(false);

    const onSubmit = async (values: z.infer<typeof ResetPasswordSchema>) => {
        setLoading(true);
        const { password } = values;

        if (!token || !email) {
            toast.error('ลิงก์ไม่ถูกต้อง');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(`${baseUrl}/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, token, newPassword: password }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message || 'ไม่สามารถรีเซ็ตรหัสผ่านได้');
            } else {
                toast.success('รีเซ็ตรหัสผ่านสำเร็จ');
                router.push('/login');
            }
        } catch (err) {
            toast.error('เกิดข้อผิดพลาด');
        } finally {
            setLoading(false);
        }
    };


    return (

        <CardWrapper
            headerLabel='ลืมรหัสผ่าน'
            leftButtonLabel='เข้าสู่ระบบ'
            leftButtonHref='/login'
            rightButtonLabel=''
            rightButtonHref=''

        >
            <div className="p-8">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>รหัสผ่านใหม่</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="รหัสผ่านใหม่" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="conPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>ยืนยันรหัสผ่าน</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="ยืนยันรหัสผ่าน" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full">
                            {loading ? 'กำลังส่ง รีเซ็ตรหัสผ่าน ...' : 'รีเซ็ตรหัสผ่าน'}
                        </Button>

                    </form>
                </Form>
            </div>
        </CardWrapper>

    );
};

export default ResetPasswordForm;
