'use client';

import { useEffect, useState } from "react";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconReload, IconSearch, IconPlus, IconChevronRight, IconChevronLeft, IconChevronRightPipe, IconChevronLeftPipe } from "@tabler/icons-react";
import { SiteHeader } from "@/components/site-header";
import { SaleOfficeCustomer } from "@/types/saleOfficeCustomer";
import { v4 as uuidv4 } from 'uuid';
import { useTranslations } from "next-intl";
import SaleOfficeCustomerDetail from "./SaleOfficeCustomerDetail";
import CreateSaleOfficeCustomerForm from "./CreateSaleOfficeCustomerForm";

export default function SaleOfficeCustomersPage() {
    const [saleOfficeCustomers, setSaleOfficeCustomers] = useState<SaleOfficeCustomer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedSaleOfficeCustomer, setSelectedSaleOfficeCustomer] = useState<SaleOfficeCustomer | null>(null);
    const [keyword, setKeyword] = useState("");
    const [input, setInput] = useState("");
    const [isCreateFormVisible, setIsCreateFormVisible] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const t = useTranslations('SaleOfficeCustomers.SaleOfficeCustomersPage');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage] = useState(5);

    const loadSaleOfficeCustomers = async (keyword = "", page = currentPage) => {
        setLoading(true);

        try {
            const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/sale-office-customers/pagination-with-search?page=${page}&pageSize=${itemsPerPage}&keyword=${keyword}`;
            const res = await fetch(url);
            if (!res.ok) throw new Error("Failed to fetch sale office customers");
            const data = await res.json();

            setSaleOfficeCustomers(data.data || []);
            setTotalItems(data.total || 0);
            setTotalPages(Math.ceil((data.total || 0) / itemsPerPage));
        } catch (err) {
            console.error('Fetch error:', err);
            setError(t("errors.loadFailed"));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSaleOfficeCustomers();
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setKeyword(input);
        setCurrentPage(1);
        loadSaleOfficeCustomers(input, 1);
    };

    const handleClearSearch = () => {
        setInput("");
        setKeyword("");
        setCurrentPage(1);
        loadSaleOfficeCustomers("", 1);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        loadSaleOfficeCustomers(keyword, page);
    };

    const handleCreateSaleOfficeCustomer = () => {
        setSelectedSaleOfficeCustomer(null);
        setIsCreateFormVisible(true);
    };

    const handleRowClick = (saleOfficeCustomer: SaleOfficeCustomer) => {
        setSelectedSaleOfficeCustomer(saleOfficeCustomer);
        setIsCreateFormVisible(false);
    };

    const handleRefresh = () => {
        loadSaleOfficeCustomers(keyword, currentPage);
    };

    const handleCreateSuccess = () => {
        setIsCreateFormVisible(false);
        handleRefresh();
    };

    const handleCreateStart = () => {
        setIsCreating(true);
    };

    const handleCreateEnd = () => {
        setIsCreating(false);
    };

    const handleCloseDetail = () => {
        setSelectedSaleOfficeCustomer(null);
    };

    const handleCloseCreateForm = () => {
        setIsCreateFormVisible(false);
    };

    // Generate page numbers for pagination
    const generatePageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return pages;
    };

    return (
        <>
            <SiteHeader headerTopic={t("title")} />
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">

                        {error && <p className="text-red-500">{error}</p>}

                        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
                            <div className="relative flex-1">
                                <Input
                                    placeholder={t("search.placeholder")}
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    className="pr-8"
                                />
                                {input && (
                                    <button
                                        type="button"
                                        onClick={handleClearSearch}
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        ×
                                    </button>
                                )}
                            </div>
                            <Button type="submit" variant="outline" size="icon">
                                <IconSearch className="w-4 h-4" />
                            </Button>
                            <Button
                                type="button"
                                onClick={handleRefresh}
                                variant="outline"
                                size="icon"
                                disabled={loading}
                            >
                                <IconReload className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                            </Button>
                        </form>

                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="flex items-center gap-2">
                                    <IconReload className="animate-spin w-5 h-5" />
                                    <span>{t("loading")}</span>
                                </div>
                            </div>
                        ) : saleOfficeCustomers.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead></TableHead>
                                        <TableHead>#</TableHead>
                                        <TableHead>{t("table.customer")}</TableHead>
                                        <TableHead>{t("table.saleOffice")}</TableHead>
                                        <TableHead>{t("table.email")}</TableHead>
                                        <TableHead>{t("table.phone")}</TableHead>
                                        <TableHead>{t("table.status")}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {saleOfficeCustomers.map((saleOfficeCustomer, index) => (
                                        <TableRow key={uuidv4()}>
                                            <TableCell className="w-10">
                                                <label className="flex items-center space-x-2 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="selectedSaleOfficeCustomer"
                                                        checked={selectedSaleOfficeCustomer?.id === saleOfficeCustomer.id}
                                                        onChange={() => handleRowClick(saleOfficeCustomer)}
                                                        className="form-radio h-4 w-4 text-blue-600"
                                                    />
                                                </label>
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {(currentPage - 1) * itemsPerPage + index + 1}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{saleOfficeCustomer.customer?.name_th}</span>
                                                    <span className="text-sm text-gray-500">{saleOfficeCustomer.customer?.site_short_code}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{saleOfficeCustomer.sale_office?.name_th}</span>
                                                    <span className="text-sm text-gray-500">{saleOfficeCustomer.sale_office?.sale_office_code}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>{saleOfficeCustomer.customer?.email}</TableCell>
                                            <TableCell>{saleOfficeCustomer.customer?.phone}</TableCell>
                                            <TableCell>
                                                <span className={`px-2 py-1 rounded-full text-xs ${saleOfficeCustomer.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {saleOfficeCustomer.status ? t("status.active") : t("status.inactive")}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <div className="flex justify-center items-center h-64">
                                <div className="text-center">
                                    <p className="text-gray-500 text-lg">{t("noData.title")}</p>
                                    <p className="text-gray-400 text-sm mt-2">{t("noData.description")}</p>
                                </div>
                            </div>
                        )}

                        {/* Pagination */}
                        {!error && totalPages > 1 && (
                            <div className="flex items-center justify-between mt-4">
                                <div className="text-sm text-gray-500">
                                    {t("pagination.showing", {
                                        start: (currentPage - 1) * itemsPerPage + 1,
                                        end: Math.min(currentPage * itemsPerPage, totalItems),
                                        total: totalItems
                                    })}
                                </div>
                                <div className="flex items-center space-x-1">
                                    {/* First page */}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePageChange(1)}
                                        disabled={currentPage === 1}
                                    >
                                        <IconChevronLeftPipe className="w-4 h-4" />
                                    </Button>

                                    {/* Previous page */}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        <IconChevronLeft className="w-4 h-4" />
                                    </Button>

                                    {/* Page numbers */}
                                    {generatePageNumbers().map((pageNum) => (
                                        <Button
                                            key={pageNum}
                                            variant={currentPage === pageNum ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => handlePageChange(pageNum)}
                                        >
                                            {pageNum}
                                        </Button>
                                    ))}

                                    {/* Next page */}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                    >
                                        <IconChevronRight className="w-4 h-4" />
                                    </Button>

                                    {/* Last page */}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePageChange(totalPages)}
                                        disabled={currentPage === totalPages}
                                    >
                                        <IconChevronRightPipe className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        )}

                        <Button
                            onClick={handleCreateSaleOfficeCustomer}
                            variant="outline"
                            size="icon"
                            className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                            title={t("buttons.addNew")}
                        >
                            <IconPlus className="w-4 h-4" />
                        </Button>

                        {selectedSaleOfficeCustomer && !isCreateFormVisible && (
                            <SaleOfficeCustomerDetail
                                saleOfficeCustomer={selectedSaleOfficeCustomer}
                                refresh={handleRefresh}
                                onClose={handleCloseDetail}
                            />
                        )}

                        {isCreateFormVisible && (
                            <CreateSaleOfficeCustomerForm
                                isVisible={isCreateFormVisible}
                                onClose={handleCloseCreateForm}
                                onSuccess={handleCreateSuccess}
                                onStart={handleCreateStart}
                                onError={handleCreateEnd}
                            />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
