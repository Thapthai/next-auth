'use client';

import React, { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { SiteHeader } from "@/components/site-header";
import { useTranslations } from "next-intl";
import { SaleOffice } from "@/types/saleOffice";
import { UserSaleOffice } from "@/types/userSaleOffice";
import { User } from "@/types/users";

export default function UserManagement() {
    const t = useTranslations("userManagement");
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const [users, setUsers] = useState<User[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchUsers() {
            try {
                const res = await fetch(`${baseUrl}/users`);
                if (!res.ok) throw new Error("Failed to fetch users");
                const data = await res.json();
                setUsers(data);
            } catch (error) {
                console.error(error);
                setError("เกิดข้อผิดพลาดในการโหลดข้อมูล");
            }
        }
        fetchUsers();
    }, []);

    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div>
            <SiteHeader headerTopic={t('headerTopic')} />


            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Sale Offices (TH)</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center p-4">
                                            ไม่มีข้อมูล
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    users.map((user, i) => (
                                        <TableRow key={i}>
                                            <TableCell>{user.name}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>
                                                {user.user_sale_office
                                                    .filter(uso => uso.sale_office.status)
                                                    .map(uso => uso.sale_office.site_office_name_th)
                                                    .join(", ")}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div></div></div></div>
    );
}
