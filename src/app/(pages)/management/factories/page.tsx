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
import { IconPencil, IconPlus, IconReload, IconSearch, IconTrash } from "@tabler/icons-react";
import { Factories } from "@/types/factories";
import CreateFactoryForm from "./CreateFactoryOfficeForm";
import EditFactoryForm from "./EditFactoryForm";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";


export default function FactoriesPage() {
    const t = useTranslations("Factories");

    const [factories, setFactories] = useState<Factories[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedFactory, setSelectedFactory] = useState<Factories | null>(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [isCreateFormVisible, setIsCreateFormVisible] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState('');
    const [totalPages, setTotalPages] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [input, setInput] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    const fetchFactories = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/factories/paginated?page=${currentPage}&search=${search}`);
            if (!res.ok) throw new Error("Failed to fetch factories");
            const data = await res.json();
            setFactories(data.data);
            setTotalPages(data.totalPages);
        } catch (err) {
            console.error(err);
            setError(t("fetchError"));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFactories();
    }, []);

    const handleDelete = async (id: number) => {
        if (!confirm(t("deleteConfirm"))) return;
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/permission/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error(t("deleteError"));
            setFactories(prev => prev.filter(p => p.id !== id));
        } catch (error) {
            alert(t("deleteFailed"));
        }
    };

    const handleCreateSuccess = () => {
        setIsCreateFormVisible(false);
        fetchFactories();
    };

    const handleCreateStart = () => {
        setIsCreateFormVisible(true);
    };

    const handleCreateError = () => {
        setError(t("createError"));
    };

    const handleCreateFactory = () => {
        setEditDialogOpen(false); // ปิด edit form ถ้าเปิดอยู่
        setSelectedFactory(null); // รีเซ็ต selected factory
        setIsCreateFormVisible(true);
    };

    const handleReset = () => {
        setInput('');
        setCurrentPage(1);
        setSearch('');
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1);
        setSearch(input);
    };

    const handleEditFactory = (factory: Factories) => {
        setIsCreateFormVisible(false); // ปิด create form ถ้าเปิดอยู่
        setSelectedFactory(factory);
        setEditDialogOpen(true);
    };

    const handleEditSuccess = () => {
        setEditDialogOpen(false);
        setSelectedFactory(null);
        fetchFactories();
    };

    const handleEditStart = () => {
        // Optional: add any logic when edit starts
    };

    const handleEditError = () => {
        setError(t("editError"));
    };

    return (

        <div>
            <SiteHeader headerTopic={t("headerTopic")} />

            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">

                    <form onSubmit={handleSearch} className="flex gap-2 mb-4">
                            <Input
                                placeholder="ค้นหา site code หรือชื่อ"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                            />
                            <Button type="button" variant="outline" onClick={handleReset}>
                                <IconReload />
                            </Button>
                            <Button type="submit">
                                <IconSearch />
                                {t('search')}
                            </Button>
                            <Button 
                                onClick={handleCreateFactory}
                                variant="outline"
                                size="icon"
                                className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                                title={t("createNewFactory")}
                                disabled={isCreating}
                            >
                                {isCreating ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <IconPlus className="w-4 h-4" />
                                )}
                            </Button>
                        </form>

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
                                        <TableHead>{t("address")}</TableHead>
                                        <TableHead className="text-right">{t("actions")}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {factories.map((factory, index) => (
                                        <TableRow key={factory.id}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{factory.name_th}</TableCell>
                                            <TableCell>{factory.name_en}</TableCell>
                                            <TableCell>{factory.address || "-"}</TableCell>
                                            <TableCell className="text-right space-x-2">

                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={() => handleEditFactory(factory)}
                                                >
                                                    <IconPencil />
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleDelete(factory.id)}
                                                >
                                                    <IconTrash />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                        <CreateFactoryForm
                            isVisible={isCreateFormVisible}
                            onClose={() => setIsCreateFormVisible(false)}
                            onSuccess={handleCreateSuccess}
                            onStart={handleCreateStart}
                            onError={handleCreateError}
                        />
                        <EditFactoryForm
                            isVisible={editDialogOpen}
                            factory={selectedFactory}
                            onClose={() => setEditDialogOpen(false)}
                            onSuccess={handleEditSuccess}
                            onStart={handleEditStart}
                            onError={handleEditError}
                        />
                    </div>

                </div>
            </div>
        </div>

    );
}
