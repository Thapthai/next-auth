'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { UserSettingsSchema } from "@/schemas";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { SiteHeader } from "@/components/site-header";


export default function SettingsPage() {
    const { data: session } = useSession();
    const userId = session?.user?.id;
    const token = session?.user?.access_token
    const t = useTranslations('SettingPage');
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;


    const [qrCodeURL, setQrCodeURL] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const form = useForm({
        resolver: zodResolver(UserSettingsSchema),
        defaultValues: {
            name: '',
            password: '',
            is_two_factor_enabled: false,
        },
    });

    const is2FAEnabled = form.watch("is_two_factor_enabled");

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await fetch(`${baseUrl}/auth/user?userId=${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await res.json();

                if (res.ok) {
                    form.reset({
                        name: data.name,
                        is_two_factor_enabled: data.is_two_factor_enabled,
                        password: '',
                    });


                } else {
                    toast.error(t('fetchUserError'));
                }
            } catch (error) {
                toast.error(t('fetchUserFailed'));
            } finally {
                setLoading(false);
            }
        };

        if (userId && token) fetchUserData();
    }, [userId, token]);

    const onSubmit = async (values: any) => {
        try {
            toast.success(t('updateSuccess'));
        } catch (error) {
            toast.error(t('updateError'));
        }
    };

    const handleEnable2FA = async (checked: boolean) => {
        form.setValue("is_two_factor_enabled", checked);

        try {
            const res = await fetch(`${baseUrl}/auth/2fa/enable`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    userId,
                    is_two_factor_enabled: checked,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message || t('update2FAError'));
                form.setValue("is_two_factor_enabled", !checked); // rollback
                return;
            }
            setQrCodeURL(data.qrCodeDataURL);

            toast.success(checked ? t('enable2FASuccess') : t('disable2FASuccess'));

            // ถ้าเปิด 2FA แล้ว ให้เซ็ต QR Code
            // setQrCodeURL(checked ? data.qrCodeDataURL : null);
        } catch (error) {
            toast.error(t('update2FAFailed'));
            form.setValue("is_two_factor_enabled", !checked); // rollback
        }
    };

    const handleShowQRCode = async () => {
        try {
            const res = await fetch(`${baseUrl}/auth/2fa/2FAqrcode?userId=${userId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, // ต้องแน่ใจว่า session?.user?.token ถูกเซ็ต
                },
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message || t('fetchQRCodeError'));
                return;
            }

            setQrCodeURL(data.qrCodeDataURL);
            toast.success(t('showQRCodeSuccess'));
        } catch (error) {
            toast.error(t('fetchQRCodeFailed'));
        }
    };


    return (
        <div>

            <SiteHeader headerTopic={t('headerTopic')} />
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">


                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t('name')}</FormLabel>
                                            <FormControl>
                                                <Input placeholder={t('namePlaceholder')} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div>
                                    <label className="text-sm font-medium">{t('email')}</label>
                                    <p className="mt-1 text-gray-600">{session?.user?.email}</p>
                                </div>

                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t('password')}</FormLabel>
                                            <FormControl>
                                                <Input type="password" placeholder={t('passwordPlaceholder')} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="is_two_factor_enabled"
                                    render={({ field }) => (
                                        <FormItem className="flex items-center justify-between">
                                            <FormLabel>{t('enable2fa')}</FormLabel>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={(checked) => handleEnable2FA(checked)}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                {is2FAEnabled && (
                                    <FormItem className="flex items-center justify-between">
                                        <FormLabel>{t('showQrCode')}</FormLabel>
                                        <FormControl>
                                            <Switch
                                                checked={!!qrCodeURL}
                                                onCheckedChange={(checked) => {
                                                    if (checked) {
                                                        handleShowQRCode();
                                                    } else {
                                                        setQrCodeURL(null);
                                                    }
                                                }}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}

                                {qrCodeURL && (
                                    <div className="mt-4 text-center">
                                        <p className="mb-2 text-sm font-medium">{t('scanDes')}</p>
                                        <img src={qrCodeURL} alt="2FA QR Code" className="mx-auto max-w-xs rounded shadow" />
                                    </div>
                                )}

                                <Button type="submit" className="w-full">
                                    {t('Button')}
                                </Button>
                            </form>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    );
};


