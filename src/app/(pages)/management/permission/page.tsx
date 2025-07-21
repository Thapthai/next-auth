'use client';

import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import EditModal from "./editModal";
import { IconPencil, IconTrash } from "@tabler/icons-react";
import { Permission } from "@/types/permission";


export default function PermissionMangementPage() {
    const t = useTranslations("permission");

    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);

    const fetchPermissions = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/permission`);
            if (!res.ok) throw new Error("Failed to fetch permissions");
            const data = await res.json();
            setPermissions(data);
        } catch (err) {
            console.error(err);
            setError(t("fetchError"));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPermissions();
    }, []);

    const handleDelete = async (id: number) => {
        if (!confirm(t("deleteConfirm"))) return;
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/permission/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error(t("deleteError"));
            setPermissions(prev => prev.filter(p => p.id !== id));
        } catch (error) {
            alert(t("deleteFailed"));
        }
    };


    return (
        <div>
            <SiteHeader headerTopic={t("headerTopic")} />

            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">

                        <h2 className="text-xl font-semibold mb-4">{t("permissionList")}</h2>

                        {loading ? (
                            <p>{t("loading")}</p>
                        ) : error ? (
                            <p className="text-red-500">{error}</p>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>#</TableHead>
                                        <TableHead>{t("nameThai")}</TableHead>
                                        <TableHead>{t("nameEnglish")}</TableHead>
                                        <TableHead>{t("description")}</TableHead>
                                        <TableHead className="text-right">{t("actions")}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {permissions.map((perm, index) => (
                                        <TableRow key={perm.id}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{perm.name_th}</TableCell>
                                            <TableCell>{perm.name_en}</TableCell>
                                            <TableCell>{perm.description || "-"}</TableCell>
                                            <TableCell className="text-right space-x-2">

                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={() => {
                                                        setSelectedPermission(perm);
                                                        setEditDialogOpen(true);
                                                    }}
                                                >
                                                    <IconPencil />
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleDelete(perm.id)}
                                                >
                                                    <IconTrash />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}


                        <EditModal
                            open={editDialogOpen}
                            setOpen={setEditDialogOpen}
                            selectedPermission={selectedPermission}
                            setPermissions={setPermissions}
                            fetchPermissions={fetchPermissions}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
