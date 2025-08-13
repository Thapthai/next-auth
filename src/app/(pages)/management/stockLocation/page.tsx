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

import StockLocationDetail from "./StockLocationDetail";
import CreateStockLocationForm from "./CreateStockLocationForm";
import { PaginatedSelect } from "@/components/ui/paginated-select";

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
    const [saleOfficePage, setSaleOfficePage] = useState(1);
    const [saleOfficeKeyword, setSaleOfficeKeyword] = useState('');
    const [hasMoreSaleOffices, setHasMoreSaleOffices] = useState(true);
    const [saleOfficeItemsPerPage] = useState(10);

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

    // Fetch sale office options with pagination and search
    const fetchSaleOffices = async (page = 1, keyword = '', reset = false) => {
        setLoadingOptions(true);
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/sale-offices?page=${page}&pageSize=${saleOfficeItemsPerPage}&keyword=${keyword}`
            );
            const data = await response.json();

            if (reset || page === 1) {
                setSaleOfficeData(data.data || []);
            } else {
                // Append new data and filter duplicates
                const existingIds = new Set(saleOfficeData.map((item: any) => item.id));
                const newData = (data.data || []).filter((item: any) => !existingIds.has(item.id));
                setSaleOfficeData(prev => [...prev, ...newData]);
            }

            setHasMoreSaleOffices(page < (data.totalPages || 1));
        } catch (error) {
            console.error('Error fetching sale offices:', error);
            if (reset || page === 1) {
                setSaleOfficeData([]);
            }
        } finally {
            setLoadingOptions(false);
        }
    };

    const handleSaleOfficeSearch = (keyword: string) => {
        setSaleOfficeKeyword(keyword);
        setSaleOfficePage(1);
        fetchSaleOffices(1, keyword, true);
    };

    const handleLoadMoreSaleOffices = () => {
        if (hasMoreSaleOffices && !loadingOptions) {
            const nextPage = saleOfficePage + 1;
            setSaleOfficePage(nextPage);
            fetchSaleOffices(nextPage, saleOfficeKeyword);
        }
    };

    const formatSaleOfficeOptions = () => {
        return saleOfficeData.map((office: any) => ({
            id: office.id,
            value: office.id.toString(),
            label: `${office.sale_office_code} - ${office.name_th} - ${office.name_en}`
        }));
    };

    useEffect(() => {
        fetchSaleOffices(1, '', true);
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

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1);
        setKeyword(input);
        fetchStockLocations(input, 1, selectedSaleOfficeId);
    };

    const handlePageChange = (page: number): void => {
        setCurrentPage(page);
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
                            <PaginatedSelect
                                value={selectedSaleOfficeId}
                                placeholder={t('selectSaleOfficeFilter')}
                                disabled={loadingOptions}
                                options={formatSaleOfficeOptions()}
                                loading={loadingOptions}
                                hasMore={hasMoreSaleOffices}
                                onValueChange={handleSaleOfficeChange}
                                onSearch={handleSaleOfficeSearch}
                                onLoadMore={handleLoadMoreSaleOffices}
                                className="w-full"
                            />
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
                                        <TableHead>{t('table.nameTh')}</TableHead>
                                        <TableHead>{t('table.nameEn')}</TableHead>
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
                                            <TableCell>{stockLocation.name_th}</TableCell>
                                            <TableCell>{stockLocation.name_en}</TableCell>
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
                                selectedSaleOfficeId={selectedSaleOfficeId}
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