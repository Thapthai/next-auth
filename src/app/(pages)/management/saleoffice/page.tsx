'use client';

import { useEffect, useState } from "react";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconCaretRightFilled, IconReload, IconSearch, IconPlus, IconChevronRight, IconChevronLeft } from "@tabler/icons-react";
import { SiteHeader } from "@/components/site-header";
import { SaleOffice } from "@/types/saleOffice";
import { v4 as uuidv4 } from 'uuid';
import SaleOfficeDetail from "./SaleOfficeDetail";
import CreateSaleOfficeForm from "./CreateSaleOfficeForm";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function SaleOfficePage() {
    const [saleOffices, setSaleOffices] = useState<SaleOffice[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [selectedOffice, setSelectedOffice] = useState<SaleOffice | null>(null);
    const [keyword, setKeyword] = useState("");
    const [input, setInput] = useState("");
    const [isCreateFormVisible, setIsCreateFormVisible] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const router = useRouter();
    const t = useTranslations('saleOffice');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage] = useState(5);



    // Load sale offices on component mount
    useEffect(() => {
        loadSaleOffices();
    }, []);

    const loadSaleOffices = async (keyword = "", page = currentPage) => {
        try {
            const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/sale-offices?page=${page}&pageSize=${itemsPerPage}&keyword=${keyword}`;
            const res = await fetch(url);
            if (!res.ok) throw new Error("Failed to fetch sale offices");
            const data = await res.json();

            setSaleOffices(data.data || []);
            setTotalItems(data.total || 0);
            setTotalPages(Math.ceil((data.total || 0) / itemsPerPage));
        } catch (err) {
            console.error('Fetch error:', err);
            setError("ไม่สามารถโหลดข้อมูลได้");
        }
    };

    useEffect(() => {
        loadSaleOffices();
    }, [currentPage]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setKeyword(input);
        loadSaleOffices(input);
    };

    const handleReset = () => {
        setInput("");
        setKeyword("");
        loadSaleOffices();
    };

    const handleGoToDepartment = (id: number) => {
        router.push(`/management/saleoffice/${id}/departments`);
    };

    const handleCreateSaleOffice = () => {
        setIsCreateFormVisible(true);
        setSelectedOffice(null); // ปิดฟอร์ม detail
    };

    const handleCreateSuccess = () => {
        setIsCreating(false);
        setIsCreateFormVisible(false);
        loadSaleOffices(keyword);
    };

    const handleCreateStart = () => {
        setIsCreating(true);
    };

    const handleCreateError = () => {
        setIsCreating(false);
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

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <>
            <SiteHeader headerTopic={t("headerTopic")} />
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">

                        {error && <p className="text-red-500">{error}</p>}

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
                                onClick={handleCreateSaleOffice}
                                variant="outline"
                                size="icon"
                                className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                                title={t("createNewOffice")}
                            >
                                <IconPlus className="w-4 h-4" />
                            </Button>
                        </form>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead></TableHead>
                                    <TableHead>#</TableHead>
                                    <TableHead>{t('siteCode')}</TableHead>
                                    <TableHead>{t('nameThaiLabel')}</TableHead>
                                    <TableHead>{t('nameEnglishLabel')}</TableHead>
                                    <TableHead>{t('status')}</TableHead>
                                    <TableHead></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {saleOffices.map((office, index) => (
                                    <TableRow key={uuidv4()}>
                                        <TableCell className="w-10">
                                            <label className="flex items-center space-x-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="selectedOffice"
                                                    value={office.id}
                                                    checked={selectedOffice?.id === office.id}
                                                    onChange={() => {
                                                        setSelectedOffice(office);
                                                        setIsCreateFormVisible(false);
                                                    }}
                                                />
                                            </label>
                                        </TableCell>
                                        <TableCell>{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                                        <TableCell>{office.site_code}</TableCell>
                                        <TableCell>{office.site_office_name_th}</TableCell>
                                        <TableCell>{office.site_office_name_en}</TableCell>
                                        <TableCell>{office.status ? t('active') : t('inactive')}</TableCell>
                                        <TableCell className="w-10">
                                            <Button
                                                variant="ghost"
                                                onClick={() => handleGoToDepartment(office.id)}
                                                className="transition-all duration-200 hover:bg-gray-100"
                                            >
                                                <IconCaretRightFilled />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        {/* Pagination */}
                        {!error && totalPages > 1 && (
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
                                        {t('next')}
                                        <IconChevronRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                        {selectedOffice && !isCreateFormVisible && (
                            <SaleOfficeDetail saleOffice={selectedOffice} refresh={() => loadSaleOffices(keyword)} />
                        )}

                        {isCreateFormVisible && !selectedOffice && (
                            <CreateSaleOfficeForm
                                isVisible={true}
                                onClose={() => setIsCreateFormVisible(false)}
                                onSuccess={handleCreateSuccess}
                                onStart={handleCreateStart}
                                onError={handleCreateError}
                            />
                        )}
                    </div>
                </div>
            </div>


        </>
    );
}
