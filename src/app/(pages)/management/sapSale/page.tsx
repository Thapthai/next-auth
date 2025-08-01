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
import { SapSale } from "@/types/sapSale";
import { Input } from "@/components/ui/input";
import SapSaleDetail from "./SapSaleDetail";
import CreateSapSaleForm from "./CreateSapSaleForm";


export default function SapSalePage() {
    const t = useTranslations("SapSale");

    const [sapSales, setSapSales] = useState<SapSale[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedSapSale, setSelectedSapSale] = useState<SapSale | null>(null);
    const [isCreateFormVisible, setIsCreateFormVisible] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage] = useState(5);
    const [input, setInput] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    const fetchSapSales = async (search = "", page = currentPage) => {
        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sap-sale/pagination-with-search?page=${page}&pageSize=${itemsPerPage}&search=${search}`);
            if (!res.ok) throw new Error("Failed to fetch SAP sales");
            const data = await res.json();
            setSapSales(data.data || []);
            setTotalItems(data.total || 0);
            setTotalPages(Math.ceil((data.total || 0) / itemsPerPage));
        } catch (err) {
            console.error(err);
            setError(t("fetchError"));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSapSales(search, currentPage);
    }, [currentPage]);

    const handleCreateSapSale = () => {
        setIsCreateFormVisible(true);
        setSelectedSapSale(null);
    };

    const handleReset = () => {
        setInput('');
        setCurrentPage(1);
        setSearch('');
        fetchSapSales();
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1);
        setSearch(input);
        fetchSapSales(input, 1);
    };

    const handlePageChange = (page: number) => {
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

    return (
        <div>
            <SiteHeader headerTopic={t('headerTopic')} />

            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">

                        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
                            <Input
                                placeholder={t('search')}
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
                                onClick={handleCreateSapSale}
                                variant="outline"
                                size="icon"
                                className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                                title={t('createNewItem')}
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
                                        <TableHead>{t('code')}</TableHead>
                                        <TableHead>{t('description')}</TableHead>
                                        <TableHead>{t('status')}</TableHead>
                                        <TableHead>{t('createdAt')}</TableHead>
                                        <TableHead>{t('updatedAt')}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {sapSales.map((sapSale, index) => (
                                        <TableRow key={sapSale.id}>
                                            <TableCell className="w-10">
                                                <label className="flex items-center space-x-2 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="selectedSapSale"
                                                        value={sapSale.id}
                                                        checked={selectedSapSale?.id === sapSale.id}
                                                        onChange={() => {
                                                            setSelectedSapSale(sapSale);
                                                            setIsCreateFormVisible(false);
                                                        }}
                                                    />
                                                </label>
                                            </TableCell>
                                            <TableCell>{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                                            <TableCell className="font-mono">{sapSale.code}</TableCell>
                                            <TableCell>{sapSale.description}</TableCell>
                                            <TableCell>
                                                <span className={`px-2 py-1 rounded-full text-xs ${sapSale.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {sapSale.status ? t('active') : t('inactive')}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                {sapSale.create_at ? new Date(sapSale.create_at).toLocaleDateString('th-TH') : '-'}
                                            </TableCell>
                                            <TableCell>
                                                {sapSale.update_at ? new Date(sapSale.update_at).toLocaleDateString('th-TH') : '-'}
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
                                    {t('show')} {(currentPage - 1) * itemsPerPage + 1} {t('to')} {Math.min(currentPage * itemsPerPage, totalItems)} {t('of')} {totalItems} {t('items')}
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handlePreviousPage}
                                        disabled={currentPage === 1}
                                    >
                                        <IconChevronLeft className="w-4 h-4" />
                                        {t('previous')}
                                    </Button>

                                    <div className="flex items-center space-x-1">
                                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                            let page;
                                            if (totalPages <= 5) {
                                                page = i + 1;
                                            } else if (currentPage <= 3) {
                                                page = i + 1;
                                            } else if (currentPage >= totalPages - 2) {
                                                page = totalPages - 4 + i;
                                            } else {
                                                page = currentPage - 2 + i;
                                            }
                                            
                                            return (
                                                <Button
                                                    key={page}
                                                    variant={currentPage === page ? "default" : "outline"}
                                                    size="sm"
                                                    onClick={() => handlePageChange(page)}
                                                    className="w-8 h-8 p-0"
                                                >
                                                    {page}
                                                </Button>
                                            );
                                        })}
                                    </div>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleNextPage}
                                        disabled={currentPage === totalPages}
                                    >
                                        {t('next')}
                                        <IconChevronRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        )}

                        {selectedSapSale && !isCreateFormVisible && (
                            <SapSaleDetail 
                                sapSale={selectedSapSale} 
                                isVisible={true}
                                onClose={() => setSelectedSapSale(null)} 
                                onSuccess={() => {
                                    setSelectedSapSale(null);
                                    fetchSapSales(search, currentPage);
                                }}
                                onError={() => {
                                    console.error('Error updating SAP Sale');
                                }}
                            />
                        )}

                        {isCreateFormVisible && !selectedSapSale && (
                            <CreateSapSaleForm
                                isVisible={true}
                                onClose={() => setIsCreateFormVisible(false)}
                                onSuccess={() => {
                                    setIsCreating(false);
                                    setIsCreateFormVisible(false);
                                    fetchSapSales(search, currentPage);
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