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
import { IconPlus, IconReload, IconSearch, IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { SaleOfficeGroup } from "@/types/saleOfficeGroup";
import { Input } from "@/components/ui/input";
import SaleOfficeGroupDetail from "./SaleOfficeGroupDetail";
import CreateSaleOfficeGroupForm from "./CreateSaleOfficeGroupForm";

export default function SaleOfficeGroupsPage() {
    const t = useTranslations("SaleOfficeGroups");

    const [saleOfficeGroups, setSaleOfficeGroups] = useState<SaleOfficeGroup[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedSaleOfficeGroup, setSelectedSaleOfficeGroup] = useState<SaleOfficeGroup | null>(null);
    const [isCreateFormVisible, setIsCreateFormVisible] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [keyword, setKeyword] = useState("");
    const [totalPages, setTotalPages] = useState(1);
    const [totalSaleOfficeGroups, setTotalSaleOfficeGroups] = useState(0);
    const [itemsPerPage] = useState(5); // แสดง 5 รายการต่อหน้า
    const [input, setInput] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [saleOfficeData, setSaleOfficeData] = useState<any[]>([]);
    const [saleOfficeGroupTypeData, setSaleOfficeGroupTypeData] = useState<any[]>([]);

    const fetchSaleOfficeGroups = async (keyword = "", page = currentPage) => {
        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sale-office-groups/pagination-with-search?page=${page}&pageSize=${itemsPerPage}&keyword=${keyword}`);
            if (!res.ok) throw new Error("Failed to fetch sale office groups");
            const data = await res.json();
            setSaleOfficeGroups(data.data || []);
            setTotalPages(data.totalPages || 1);
            setTotalSaleOfficeGroups(data.total || 0);
        } catch (error) {
            setError(error instanceof Error ? error.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    const fetchOptions = async () => {
        try {
            const [saleOfficeRes, saleOfficeGroupTypeRes] = await Promise.all([
                fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sale-offices`),
                fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sale-office-group-types`)
            ]);

            if (saleOfficeRes.ok) {
                const saleOfficeData = await saleOfficeRes.json();
                setSaleOfficeData(saleOfficeData.data || []);
            }

            if (saleOfficeGroupTypeRes.ok) {
                const saleOfficeGroupTypeData = await saleOfficeGroupTypeRes.json();
                setSaleOfficeGroupTypeData(saleOfficeGroupTypeData || []);
            }
        } catch (error) {
            console.error("Failed to fetch options:", error);
        }
    };

    useEffect(() => {
        fetchSaleOfficeGroups(keyword, currentPage);
        fetchOptions();
    }, [currentPage]);

    const handleCreateSaleOfficeGroup = () => {
        setIsCreateFormVisible(true);
        setSelectedSaleOfficeGroup(null); // ปิดฟอร์ม detail
    };

    const handleReset = () => {
        setInput('');
        setCurrentPage(1);
        setKeyword('');
        fetchSaleOfficeGroups();
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1);
        setKeyword(input);
        fetchSaleOfficeGroups(input, 1);
    };

    const handlePageChange = (page: number): void => {
        setCurrentPage(page);
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handleSaleOfficeGroupCreated = () => {
        setIsCreateFormVisible(false);
        fetchSaleOfficeGroups(keyword, currentPage);
    };

    const handleSaleOfficeGroupUpdated = () => {
        setSelectedSaleOfficeGroup(null);
        fetchSaleOfficeGroups(keyword, currentPage);
    };

    if (loading) return <div className="flex justify-center items-center h-64">{t('loading')}</div>;
    if (error) return <div className="text-red-500 text-center">{t('error')}</div>;

    return (
        <div>
            <SiteHeader headerTopic={t('title')} />

            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">

                        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
                            <Input
                                placeholder={t('searchPlaceholder')}
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
                                type="button"
                                onClick={handleCreateSaleOfficeGroup}
                                variant="outline"
                                size="icon"
                                className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                                title={t('createButton')}
                            >
                                <IconPlus className="w-4 h-4" />
                            </Button>
                        </form>

                        {error && <p className="text-red-500">{error}</p>}

                        {loading ? (
                            <p>{t('loading')}</p>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead></TableHead>
                                        <TableHead>#</TableHead>
                                        <TableHead>{t('table.nameTh')}</TableHead>
                                        <TableHead>{t('table.nameEn')}</TableHead>
                                        <TableHead>{t('table.code')}</TableHead>
                                        <TableHead>{t('table.description')}</TableHead>
                                        <TableHead>{t('table.status')}</TableHead>
                                        <TableHead>{t('table.createdAt')}</TableHead>
                                        <TableHead>{t('table.updatedAt')}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {saleOfficeGroups.map((saleOfficeGroup, index) => (
                                        <TableRow key={saleOfficeGroup.id}>
                                            <TableCell className="w-10">
                                                <label className="flex items-center space-x-2 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="selectedSaleOfficeGroup"
                                                        value={saleOfficeGroup.id}
                                                        checked={selectedSaleOfficeGroup?.id === saleOfficeGroup.id}
                                                        onChange={() => {
                                                            setSelectedSaleOfficeGroup(saleOfficeGroup);
                                                            setIsCreateFormVisible(false);
                                                        }}
                                                    />
                                                </label>
                                            </TableCell>
                                            <TableCell>{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                                            <TableCell className="font-medium">
                                                {saleOfficeGroup.name_th}
                                            </TableCell>
                                            <TableCell>{saleOfficeGroup.name_en}</TableCell>
                                            <TableCell>{saleOfficeGroup.code || '-'}</TableCell>
                                            <TableCell>{saleOfficeGroup.description || '-'}</TableCell>
                                            <TableCell>
                                                <span className={`px-2 py-1 rounded-full text-xs ${saleOfficeGroup.status
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {saleOfficeGroup.status ? t('active') : t('inactive')}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                {saleOfficeGroup.create_at ? new Date(saleOfficeGroup.create_at).toLocaleDateString('th-TH') : '-'}
                                            </TableCell>
                                            <TableCell>
                                                {saleOfficeGroup.update_at ? new Date(saleOfficeGroup.update_at).toLocaleDateString('th-TH') : '-'}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}

                        {/* Pagination */}
                        {!loading && !error && totalPages > 1 && (
                            <div className="flex items-center justify-between mt-4">
                                <div className="text-sm text-gray-500">
                                    {t('pagination.showing')} {(currentPage - 1) * itemsPerPage + 1} {t('pagination.to')} {Math.min(currentPage * itemsPerPage, totalSaleOfficeGroups)} {t('pagination.of')} {totalSaleOfficeGroups} {t('pagination.results')}
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handlePreviousPage}
                                        disabled={currentPage === 1}
                                    >
                                        <IconChevronLeft className="w-4 h-4" />
                                        {t('pagination.previous')}
                                    </Button>

                                    <div className="flex items-center space-x-1">
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                            <Button
                                                key={page}
                                                variant={currentPage === page ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => handlePageChange(page)}
                                                className="w-8 h-8 p-0"
                                            >
                                                {page}
                                            </Button>
                                        ))}
                                    </div>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleNextPage}
                                        disabled={currentPage === totalPages}
                                    >
                                        {t('pagination.next')}
                                        <IconChevronRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        )}

                        {selectedSaleOfficeGroup && !isCreateFormVisible && (
                            <SaleOfficeGroupDetail
                                saleOfficeGroup={selectedSaleOfficeGroup}
                                isVisible={true}
                                saleOfficeData={saleOfficeData}
                                saleOfficeGroupTypeData={saleOfficeGroupTypeData}
                                onClose={() => setSelectedSaleOfficeGroup(null)}
                                onSuccess={handleSaleOfficeGroupUpdated}
                                onStart={() => setIsCreating(true)}
                                onError={() => setIsCreating(false)}
                            />
                        )}

                        {isCreateFormVisible && !selectedSaleOfficeGroup && (
                            <CreateSaleOfficeGroupForm
                                isVisible={true}
                                saleOfficeData={saleOfficeData}
                                saleOfficeGroupTypeData={saleOfficeGroupTypeData}
                                onClose={() => setIsCreateFormVisible(false)}
                                onSuccess={() => {
                                    setIsCreating(false);
                                    setIsCreateFormVisible(false);
                                    fetchSaleOfficeGroups(keyword, currentPage);
                                }}
                                onStart={() => setIsCreating(true)}
                                onError={() => setIsCreating(false)}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}