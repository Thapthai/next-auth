'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { UserSettingsSchema } from "@/schemas";

type FormValues = z.infer<typeof UserSettingsSchema>;

const mockUser = {
    name: "สมชาย ใจดี",
    email: "somchai@example.com",
    is_two_factor_enabled: true,
};

const SettingsPage = () => {
    const form = useForm<FormValues>({
        resolver: zodResolver(UserSettingsSchema),
        defaultValues: {
            name: mockUser.name,
            is_two_factor_enabled: mockUser.is_two_factor_enabled,
        },
    });

    const onSubmit = async (values: FormValues) => {
        try {
            // ส่งข้อมูลไปยัง backend
            toast.success("อัปเดตข้อมูลสำเร็จ");
        } catch (error) {
            toast.error("เกิดข้อผิดพลาดในการอัปเดตข้อมูล");
        }
    };

    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }
        >
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader
                    headerTopic='ตั้งค่าผู้ใช้' />
                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-2">
                        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                            <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                        {/* Name */}
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>ชื่อผู้ใช้</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="ชื่อผู้ใช้" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Email (แสดงอย่างเดียว) */}
                                        <div>
                                            <label className="text-sm font-medium">อีเมล</label>
                                            <p className="mt-1 text-gray-600">{mockUser.email}</p>
                                        </div>

                                        {/* Password (เปลี่ยนได้) */}
                                        <FormField
                                            control={form.control}
                                            name="password"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>รหัสผ่านใหม่ (ถ้าต้องการเปลี่ยน)</FormLabel>
                                                    <FormControl>
                                                        <Input type="password" placeholder="********" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* 2FA */}
                                        <FormField
                                            control={form.control}
                                            name="is_two_factor_enabled"
                                            render={({ field }) => (
                                                <FormItem className="flex items-center justify-between">
                                                    <FormLabel>เปิดใช้งาน Two-Factor</FormLabel>
                                                    <FormControl>
                                                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />

                                        <Button type="submit" className="w-full">
                                            บันทึกการเปลี่ยนแปลง
                                        </Button>
                                    </form>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
};

export default SettingsPage;
