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
import { User } from "@/types/users";
import { Button } from "@/components/ui/button";
import EditUserModal from "./editUserModal";
import { Icon } from "lucide-react";
import { IconEdit } from "@tabler/icons-react";

export default function UserManagement() {
    const t = useTranslations("userManagement");
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const [users, setUsers] = useState<User[]>([]);
    const [error, setError] = useState<string | null>(null);

    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);


    const fetchUsers = async () => {
        try {
            const res = await fetch(`${baseUrl}/users`);
            if (!res.ok) throw new Error("Failed to fetch users");
            const data = await res.json();
            setUsers(data);
        } catch (error) {
            console.error(error);
            setError("เกิดข้อผิดพลาดในการโหลดข้อมูล");
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div>
            <SiteHeader headerTopic={t('headerTopic')} />
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
                        <h2 className="text-2xl font-bold text-gray-900 border-b pb-2 mb-4">
                            รายชื่อผู้ใช้งาน
                        </h2>

                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ชื่อ</TableHead>
                                    <TableHead>อีเมล</TableHead>
                                    <TableHead>permission</TableHead>
                                    <TableHead>สาขา (ไทย)</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center p-4 text-gray-500">
                                            ไม่มีข้อมูลผู้ใช้
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    users.map((user, i) => (
                                        <TableRow key={i}>
                                            <TableCell className="font-medium">{user.name}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>{user.permission_id}</TableCell>
                                            <TableCell>
                                                {user.user_sale_office
                                                    .filter(uso => uso.sale_office?.status)
                                                    .map(uso => uso.sale_office?.site_office_name_th)
                                                    .join(", ") || "-"}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    size="sm"
                                                    variant="secondary"
                                                    onClick={() => {
                                                        setSelectedUser(user);
                                                        setEditDialogOpen(true);
                                                    }}
                                                >
                                                    <IconEdit />
                                                </Button>
                                            </TableCell>


                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>

                        <EditUserModal
                            open={editDialogOpen}
                            setOpen={setEditDialogOpen}
                            user={selectedUser}
                            refresh={fetchUsers}
                        />

                    </div>
                </div>
            </div>
        </div>
    );
}
