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
import { startTransition } from 'react';


export const LoginForm = () => {
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
        try {
            const responseForm = await signIn("credentials", {
                ...values,
                redirect: false,
            });

            if (responseForm?.error === "EMAIL_NOT_VERIFIED") {
                router.push("/waiting-verify");
            } else if (responseForm?.error === "EMAIL_DOES_NOT_EXIST") {
                alert("Email or Password Incorrect !");

            } else if (responseForm?.ok) {
                router.push("/dashboard");
            } else {
                alert("Login failed");
            }

        } catch (e) {
            console.error("Login error", e);
        }
    };

    return (
        <CardWrapper
            headerLabel='เข้าสู่ระบบ'
            backButtonLabel='ลงทะเบียนบัญชีใหม่'
            backbuttonHref='/register'
        >
            <div className="p-8">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>

                        <div className="space-y-4">
                            <FormField control={form.control}
                                name='email'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
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
                                        <FormLabel>Password</FormLabel>
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
                            เข้าสู่ระบบ
                        </Button>

                    </form>
                </Form>
            </div>
        </CardWrapper>

    )
}
export default LoginForm