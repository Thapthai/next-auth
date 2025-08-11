'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
import { IconPlus, IconReload, IconSearch, IconChevronLeft, IconChevronRight, IconChevronLeftPipe, IconChevronRightPipe, IconCaretRightFilled } from "@tabler/icons-react";
import { StockLocation } from "@/types/stockLocation";
import { Input } from "@/components/ui/input";
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import StockLocationDetail from "./StockLocationDetail";
import CreateStockLocationForm from "./CreateStockLocationForm";

export default function StockLocationsPage() {
    const t = useTranslations("StockLocations");
    const router = useRouter();

    const [stockLocations, setStockLocations] = useState<StockLocation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedStockLocation, setSelectedStockLocation] = useState<StockLocation | null>(null);
    const [isCreateFormVisible, setIsCreateFormVisible] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [keyword, setKeyword] = useState("");
    const [totalPages, setTotalPages] = useState(1);
    const [totalStockLocations, setTotalStockLocations] = useState(0);
    const [itemsPerPage] = useState(5); // แสดง 5 รายการต่อหน้า
    const [input, setInput] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [saleOfficeData, setSaleOfficeData] = useState<any[]>([]);
    const [loadingOptions, setLoadingOptions] = useState(false);
    const [selectedSaleOfficeId, setSelectedSaleOfficeId] = useState<string>('');
    const [navigatingToId, setNavigatingToId] = useState<number | null>(null);

    const fetchStockLocations = async (keyword = "", page = currentPage, saleOfficeId = selectedSaleOfficeId) => {
        setLoading(true);
        try {
            let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/stock-locations/pagination-with-search?page=${page}&pageSize=${itemsPerPage}&keyword=${keyword}`;
            if (saleOfficeId) {
                url += `&sale_office_id=${saleOfficeId}`;
            }
            const res = await fetch(url);
            if (!res.ok) throw new Error("Failed to fetch stock locations");
            const data = await res.json();
            setStockLocations(data.data || []);
            setTotalPages(data.totalPages || 1);
            setTotalStockLocations(data.total || 0);
        } catch (error) {
            setError(error instanceof Error ? error.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    const fetchOptions = async () => {
        setLoadingOptions(true);
        try {
            const saleOfficeRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sale-offices`);

            if (saleOfficeRes.ok) {
                const saleOfficeData = await saleOfficeRes.json();
                setSaleOfficeData(saleOfficeData.data || []);
            }
        } catch (error) {
            console.error("Failed to fetch options:", error);
        } finally {
            setLoadingOptions(false);
        }
    };

    useEffect(() => {
        fetchOptions();
    }, []);

    useEffect(() => {
        fetchStockLocations(keyword, currentPage, selectedSaleOfficeId);
    }, [currentPage, keyword, selectedSaleOfficeId]);


    const handleCreateStockLocation = () => {
        setIsCreateFormVisible(true);
        setSelectedStockLocation(null); // ปิดฟอร์ม detail
    };

    const handleReset = () => {
        setInput('');
        setCurrentPage(1);
        setKeyword('');
        setSelectedSaleOfficeId('');
        fetchStockLocations('', 1, '');
        setSelectedStockLocation(null);
        setIsCreateFormVisible(false);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1);
        setKeyword(input);
        fetchStockLocations(input, 1, selectedSaleOfficeId);
    };

    const handlePageChange = (page: number): void => {
        setCurrentPage(page);
    };

    // Function to get visible page numbers (current page and neighbors)
    const getVisiblePages = () => {
        const pages = [];
        const start = Math.max(1, currentPage - 1);
        const end = Math.min(totalPages, currentPage + 1);

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        return pages;
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


    const handleStockLocationUpdated = () => {
        setSelectedStockLocation(null);
        fetchStockLocations(keyword, currentPage, selectedSaleOfficeId);
    };

    const handleSaleOfficeChange = (value: string) => {
        setSelectedSaleOfficeId(value);
        setCurrentPage(1);
    };

    const handleGoToLocation = async (id: number) => {
        setNavigatingToId(id);
        try {
            router.push(`/management/stockLocation/${id}/location`);
        } finally {
            // Loading จะหยุดเมื่อ component unmount หรือ navigate เสร็จ
            setTimeout(() => setNavigatingToId(null), 1000);
        }
    };


    return (
        <div>

            <SiteHeader headerTopic={t('title')} />

            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
                        {error && <p className="text-red-500">{error}</p>}

                        <div className="flex flex-col gap-2">
                            <label className="text-sm text-gray-600">{t('filterBySaleOffice')}</label>
                            <Select
                                value={selectedSaleOfficeId}
                                onValueChange={handleSaleOfficeChange}
                                disabled={loadingOptions}
                            >
                                <SelectTrigger className="w-full ">
                                    <SelectValue placeholder={t('selectSaleOfficeFilter')} />
                                </SelectTrigger>
                                <SelectContent>

                                    {saleOfficeData.map((saleOffice) => (
                                        <SelectItem key={saleOffice.id} value={saleOffice.id.toString()}>
                                            {saleOffice.sale_office_code} - {saleOffice.name_th} - {saleOffice.name_en}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
                            <div className="relative flex-1">
                                <Input
                                    placeholder={t('searchPlaceholder')}
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    className="pr-8"
                                />
                                {input && (
                                    <button
                                        type="button"
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                                        onClick={handleReset}
                                    >
                                        <IconReload className="w-4 h-4" />
                                    </button>
                                )}
                            </div>

                            <Button type="submit" variant="outline"><IconSearch /></Button>
                        </form>



                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="flex items-center gap-2">
                                    <IconReload className="animate-spin w-5 h-5" />
                                    <span>กำลังโหลดข้อมูล...</span>
                                </div>
                            </div>
                        ) : stockLocations.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead></TableHead>
                                        <TableHead>#</TableHead>
                                        <TableHead>{t('table.siteShortCode')}</TableHead>
                                        <TableHead>{t('table.saleOffice')}</TableHead>
                                        <TableHead>{t('table.description')}</TableHead>
                                        <TableHead>{t('table.status')}</TableHead>
                                        <TableHead></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {stockLocations.map((stockLocation, index) => (
                                        <TableRow key={stockLocation.id}>
                                            <TableCell className="w-10">
                                                <label className="flex items-center space-x-2 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="selectedStockLocation"
                                                        value={stockLocation.id}
                                                        checked={selectedStockLocation?.id === stockLocation.id}
                                                        onChange={() => {
                                                            setSelectedStockLocation(stockLocation);
                                                            setIsCreateFormVisible(false);
                                                        }}
                                                    />
                                                </label>
                                            </TableCell>
                                            <TableCell>{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                                            <TableCell className="font-medium">
                                                {stockLocation.site_short_code}
                                            </TableCell>
                                            <TableCell>{stockLocation.sale_office.sale_office_code} - {stockLocation.sale_office.name_th} - {stockLocation.sale_office.name_en}</TableCell>
                                            <TableCell>{stockLocation.description || '-'}</TableCell>
                                            <TableCell>
                                                <span className={`px-2 py-1 rounded-full text-xs ${stockLocation.status
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {stockLocation.status ? t('active') : t('inactive')}
                                                </span>
                                            </TableCell>
                                            <TableCell className="w-10">
                                                <Button
                                                    variant="ghost"
                                                    onClick={() => handleGoToLocation(stockLocation.id)}
                                                    className="transition-all duration-200 hover:bg-gray-100"
                                                    disabled={navigatingToId === stockLocation.id}
                                                    title={t('goToLocations')}
                                                >
                                                    {navigatingToId === stockLocation.id ? (
                                                        <IconReload className="animate-spin w-4 h-4" />
                                                    ) : (
                                                        <IconCaretRightFilled />
                                                    )}
                                                </Button>
                                            </TableCell>

                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <div className="flex justify-center items-center h-64">
                                <div className="text-center">
                                    <p className="text-gray-500 text-lg">ไม่พบข้อมูล</p>
                                    <p className="text-gray-400 text-sm mt-2">ลองค้นหาด้วยคำค้นอื่น หรือเพิ่มข้อมูลใหม่</p>
                                </div>
                            </div>
                        )}

                        {/* Pagination */}
                        {!error && totalPages > 1 && (
                            <div className="flex items-center justify-between mt-4">
                                <div className="text-sm text-gray-500">
                                    {t('pagination.showing')} {(currentPage - 1) * itemsPerPage + 1} {t('pagination.to')} {Math.min(currentPage * itemsPerPage, totalStockLocations)} {t('pagination.of')} {totalStockLocations} {t('pagination.results')}
                                </div>
                                <div className="flex items-center space-x-1">
                                    {/* First page */}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePageChange(1)}
                                        disabled={currentPage === 1}
                                        className="w-8 h-8 p-0"
                                    >
                                        <IconChevronLeftPipe className="w-4 h-4" />
                                    </Button>

                                    {/* Previous page */}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handlePreviousPage}
                                        disabled={currentPage === 1}
                                        className="w-8 h-8 p-0"
                                    >
                                        <IconChevronLeft className="w-4 h-4" />
                                    </Button>

                                    {/* Page numbers */}
                                    {getVisiblePages().map((page) => (
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

                                    {/* Next page */}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleNextPage}
                                        disabled={currentPage === totalPages}
                                        className="w-8 h-8 p-0"
                                    >
                                        <IconChevronRight className="w-4 h-4" />
                                    </Button>

                                    {/* Last page */}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePageChange(totalPages)}
                                        disabled={currentPage === totalPages}
                                        className="w-8 h-8 p-0"
                                    >
                                        <IconChevronRightPipe className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                        <Button
                            type="button"
                            onClick={handleCreateStockLocation}
                            variant="outline"
                            size="icon"
                            className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                            title={t('createButton')}
                        >
                            <IconPlus className="w-4 h-4" />
                        </Button>

                        {selectedStockLocation && !isCreateFormVisible && (
                            <StockLocationDetail
                                stockLocation={selectedStockLocation}
                                isVisible={true}
                                saleOfficeData={saleOfficeData}
                                onClose={() => setSelectedStockLocation(null)}
                                onSuccess={handleStockLocationUpdated}
                                onStart={() => setIsCreating(true)}
                                onError={() => setIsCreating(false)}
                            />
                        )}

                        {isCreateFormVisible && !selectedStockLocation && (
                            <CreateStockLocationForm
                                isVisible={true}
                                saleOfficeData={saleOfficeData}
                                onClose={() => setIsCreateFormVisible(false)}
                                onSuccess={() => {
                                    setIsCreating(false);
                                    setIsCreateFormVisible(false);
                                    fetchStockLocations(keyword, currentPage, selectedSaleOfficeId);
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