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
import { SaleOfficeGroupType } from "@/types/saleOfficeGroupType";
import { Input } from "@/components/ui/input";
import SaleOfficeGroupTypeDetail from "./SaleOfficeGroupTypeDetail";
import CreateSaleOfficeGroupTypeForm from "./CreateSaleOfficeGroupTypeForm";


export default function SaleOfficeGroupTypesPage() {
    const t = useTranslations("SaleOfficeGroupTypes");

    const [saleOfficeGroupTypes, setSaleOfficeGroupTypes] = useState<SaleOfficeGroupType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedSaleOfficeGroupType, setSelectedSaleOfficeGroupType] = useState<SaleOfficeGroupType | null>(null);
    const [isCreateFormVisible, setIsCreateFormVisible] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [keyword, setKeyword] = useState("");
    const [totalPages, setTotalPages] = useState(1);
    const [totalSaleOfficeGroupTypes, setTotalSaleOfficeGroupTypes] = useState(0);
    const [itemsPerPage] = useState(5); // แสดง 5 รายการต่อหน้า
    const [input, setInput] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    const fetchSaleOfficeGroupTypes = async (keyword = "", page = currentPage) => {
        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sale-office-group-types/pagination-with-search?page=${page}&pageSize=${itemsPerPage}&keyword=${keyword}`);
            if (!res.ok) throw new Error("Failed to fetch sale office group types");
            const data = await res.json();
            setSaleOfficeGroupTypes(data.data || []);
            setTotalPages(data.totalPages || 1);
            setTotalSaleOfficeGroupTypes(data.total || 0);
        } catch (error) {
            setError(error instanceof Error ? error.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSaleOfficeGroupTypes(keyword, currentPage);
    }, [currentPage]);

    const handleCreateSaleOfficeGroupType = () => {
        setIsCreateFormVisible(true);
        setSelectedSaleOfficeGroupType(null); // ปิดฟอร์ม detail
    };

    const handleReset = () => {
        setInput('');
        setCurrentPage(1);
        setKeyword('');
        fetchSaleOfficeGroupTypes();
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1);
        setKeyword(input);
        fetchSaleOfficeGroupTypes(input, 1);
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

    const handleSaleOfficeGroupTypeCreated = () => {
        setIsCreateFormVisible(false);
        fetchSaleOfficeGroupTypes(keyword, currentPage);
    };

    const handleSaleOfficeGroupTypeUpdated = () => {
        setSelectedSaleOfficeGroupType(null);
        fetchSaleOfficeGroupTypes(keyword, currentPage);
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
                                onClick={handleCreateSaleOfficeGroupType}
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
                                        <TableHead>{t('table.level')}</TableHead>
                                        <TableHead>{t('table.group')}</TableHead>
                                        <TableHead>{t('table.type')}</TableHead>
                                        <TableHead>{t('table.status')}</TableHead>
                                        <TableHead>{t('table.createdAt')}</TableHead>
                                        <TableHead>{t('table.updatedAt')}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {saleOfficeGroupTypes.map((saleOfficeGroupType, index) => (
                                        <TableRow key={saleOfficeGroupType.id}>
                                            <TableCell className="w-10">
                                                <label className="flex items-center space-x-2 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="selectedSaleOfficeGroupType"
                                                        value={saleOfficeGroupType.id}
                                                        checked={selectedSaleOfficeGroupType?.id === saleOfficeGroupType.id}
                                                        onChange={() => {
                                                            setSelectedSaleOfficeGroupType(saleOfficeGroupType);
                                                            setIsCreateFormVisible(false);
                                                        }}
                                                    />
                                                </label>
                                            </TableCell>
                                            <TableCell>{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                                            <TableCell className="font-medium">
                                                {saleOfficeGroupType.level}
                                            </TableCell>
                                            <TableCell>{saleOfficeGroupType.group}</TableCell>
                                            <TableCell>{saleOfficeGroupType.type}</TableCell>
                                            <TableCell>
                                                <span className={`px-2 py-1 rounded-full text-xs ${saleOfficeGroupType.status
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {saleOfficeGroupType.status ? t('active') : t('inactive')}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                {saleOfficeGroupType.create_at ? new Date(saleOfficeGroupType.create_at).toLocaleDateString('th-TH') : '-'}
                                            </TableCell>
                                            <TableCell>
                                                {saleOfficeGroupType.update_at ? new Date(saleOfficeGroupType.update_at).toLocaleDateString('th-TH') : '-'}
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
                                    {t('pagination.showing')} {(currentPage - 1) * itemsPerPage + 1} {t('pagination.to')} {Math.min(currentPage * itemsPerPage, totalSaleOfficeGroupTypes)} {t('pagination.of')} {totalSaleOfficeGroupTypes} {t('pagination.results')}
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

                        {selectedSaleOfficeGroupType && !isCreateFormVisible && (
                            <SaleOfficeGroupTypeDetail
                                saleOfficeGroupType={selectedSaleOfficeGroupType}
                                isVisible={true}
                                onClose={() => setSelectedSaleOfficeGroupType(null)}
                                onSuccess={handleSaleOfficeGroupTypeUpdated}
                                onStart={() => setIsCreating(true)}
                                onError={() => setIsCreating(false)}
                            />
                        )}

                        {isCreateFormVisible && !selectedSaleOfficeGroupType && (
                            <CreateSaleOfficeGroupTypeForm
                                isVisible={true}
                                onClose={() => setIsCreateFormVisible(false)}
                                onSuccess={() => {
                                    setIsCreating(false);
                                    setIsCreateFormVisible(false);
                                    fetchSaleOfficeGroupTypes(keyword, currentPage);
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