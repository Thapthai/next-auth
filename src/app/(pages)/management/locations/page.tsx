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
import { IconPlus, IconReload, IconSearch, IconChevronLeft, IconChevronRight, IconChevronLeftPipe, IconChevronRightPipe } from "@tabler/icons-react";
import { Location } from "@/types/location";
import { Input } from "@/components/ui/input";
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import LocationDetail from "./LocationDetail";
import CreateLocationForm from "./CreateLocationForm";

export default function LocationsPage() {
    const t = useTranslations("Locations");

    const [locations, setLocations] = useState<Location[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
    const [isCreateFormVisible, setIsCreateFormVisible] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [keyword, setKeyword] = useState("");
    const [totalPages, setTotalPages] = useState(1);
    const [totalLocations, setTotalLocations] = useState(0);
    const [itemsPerPage] = useState(5); // แสดง 5 รายการต่อหน้า
    const [input, setInput] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [stockLocationData, setStockLocationData] = useState<any[]>([]);
    const [saleOfficeData, setSaleOfficeData] = useState<any[]>([]);
    const [loadingOptions, setLoadingOptions] = useState(false);
    const [selectedSaleOfficeId, setSelectedSaleOfficeId] = useState<string>('');
    const [selectedStockLocationId, setSelectedStockLocationId] = useState<string>('');
    const [filteredStockLocations, setFilteredStockLocations] = useState<any[]>([]);

    const fetchLocations = async (keyword = "", page = currentPage, stockLocationId = selectedStockLocationId) => {
        setLoading(true);
        try {
            let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/locations/pagination-with-search?page=${page}&pageSize=${itemsPerPage}&keyword=${keyword}`;
            if (stockLocationId) {
                url += `&stock_location_id=${stockLocationId}`;
            }
            const res = await fetch(url);
            if (!res.ok) throw new Error("Failed to fetch locations");
            const data = await res.json();
            setLocations(data.data || []);
            setTotalPages(data.totalPages || 1);
            setTotalLocations(data.total || 0);
        } catch (error) {
            setError(error instanceof Error ? error.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    const fetchOptions = async () => {
        setLoadingOptions(true);
        try {
            // Fetch sale offices
            const saleOfficeRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sale-offices`);
            if (saleOfficeRes.ok) {
                const saleOfficeData = await saleOfficeRes.json();
                setSaleOfficeData(saleOfficeData.data || []);
            }

            // Fetch all stock locations
            const stockLocationRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/stock-locations`);
            if (stockLocationRes.ok) {
                const stockLocationData = await stockLocationRes.json();
                setStockLocationData(stockLocationData.data || []);
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
        fetchLocations(keyword, currentPage, selectedStockLocationId);
    }, [currentPage, keyword, selectedStockLocationId]);

    // Filter stock locations based on selected sale office
    useEffect(() => {
        if (selectedSaleOfficeId) {
            const filtered = stockLocationData.filter(
                stockLocation => stockLocation.sale_office_id === parseInt(selectedSaleOfficeId)
            );
            setFilteredStockLocations(filtered);
        } else {
            setFilteredStockLocations([]);
        }
        // Reset stock location selection when sale office changes
        setSelectedStockLocationId('');
    }, [selectedSaleOfficeId, stockLocationData]);


    const handleCreateLocation = () => {
        setIsCreateFormVisible(true);
        setSelectedLocation(null); // ปิดฟอร์ม detail
    };

    const handleReset = () => {
        setInput('');
        setCurrentPage(1);
        setKeyword('');
        setSelectedSaleOfficeId('');
        setSelectedStockLocationId('');
        fetchLocations('', 1, '');
        setSelectedLocation(null);
        setIsCreateFormVisible(false);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1);
        setKeyword(input);
        fetchLocations(input, 1, selectedStockLocationId);
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


    const handleLocationUpdated = () => {
        setSelectedLocation(null);
        fetchLocations(keyword, currentPage, selectedStockLocationId);
    };

    const handleSaleOfficeChange = (value: string) => {
        setSelectedSaleOfficeId(value);
        setCurrentPage(1);
    };

    const handleStockLocationChange = (value: string) => {
        setSelectedStockLocationId(value);
        setCurrentPage(1);
    };


    return (
        <div>

            <SiteHeader headerTopic={t('title')} />

            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
                        {error && <p className="text-red-500">{error}</p>}

                        {/* Cascading Filters */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Sale Office Filter */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm text-gray-600">{t('filterBySaleOffice')}</label>
                                <Select
                                    value={selectedSaleOfficeId}
                                    onValueChange={handleSaleOfficeChange}
                                    disabled={loadingOptions}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder={t('selectSaleOfficeFilter')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {/* <SelectItem value="">{t('allSaleOffices')}</SelectItem> */}
                                        {saleOfficeData.map((saleOffice) => (
                                            <SelectItem key={saleOffice.id} value={saleOffice.id.toString()}>
                                                {saleOffice.sale_office_code} - {saleOffice.name_th} - {saleOffice.name_en}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Stock Location Filter */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm text-gray-600">{t('filterByStockLocation')}</label>
                                <Select
                                    value={selectedStockLocationId}
                                    onValueChange={handleStockLocationChange}
                                    disabled={loadingOptions || !selectedSaleOfficeId || filteredStockLocations.length === 0}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder={
                                            !selectedSaleOfficeId
                                                ? t('selectSaleOfficeFirst')
                                                : filteredStockLocations.length === 0
                                                    ? t('noStockLocationsFound')
                                                    : t('selectStockLocationFilter')
                                        } />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {/* <SelectItem value="">{t('allStockLocations')}</SelectItem> */}
                                        {filteredStockLocations.map((stockLocation) => (
                                            <SelectItem key={stockLocation.id} value={stockLocation.id.toString()}>
                                                {stockLocation.site_short_code} - {stockLocation.description || '-'}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
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
                        ) : locations.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead></TableHead>
                                        <TableHead>#</TableHead>
                                        <TableHead>{t('table.siteShortCode')}</TableHead>
                                        <TableHead>{t('table.stockLocation')}</TableHead>
                                        <TableHead>{t('table.saleOffice')}</TableHead>
                                        <TableHead>{t('table.description')}</TableHead>
                                        <TableHead>{t('table.status')}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {locations.map((location, index) => (
                                        <TableRow key={location.id}>
                                            <TableCell className="w-10">
                                                <label className="flex items-center space-x-2 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="selectedLocation"
                                                        value={location.id}
                                                        checked={selectedLocation?.id === location.id}
                                                        onChange={() => {
                                                            setSelectedLocation(location);
                                                            setIsCreateFormVisible(false);
                                                        }}
                                                    />
                                                </label>
                                            </TableCell>
                                            <TableCell>{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                                            <TableCell className="font-medium">
                                                {location.site_short_code}
                                            </TableCell>
                                            <TableCell>{location.stock_location.site_short_code} - {location.stock_location.description || '-'}</TableCell>
                                            <TableCell>{location.stock_location.sale_office.sale_office_code} - {location.stock_location.sale_office.name_th} - {location.stock_location.sale_office.name_en}</TableCell>
                                            <TableCell>{location.description || '-'}</TableCell>
                                            <TableCell>
                                                <span className={`px-2 py-1 rounded-full text-xs ${location.status
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {location.status ? t('active') : t('inactive')}
                                                </span>
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
                                    {t('pagination.showing')} {(currentPage - 1) * itemsPerPage + 1} {t('pagination.to')} {Math.min(currentPage * itemsPerPage, totalLocations)} {t('pagination.of')} {totalLocations} {t('pagination.results')}
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
                            onClick={handleCreateLocation}
                            variant="outline"
                            size="icon"
                            className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                            title={t('createButton')}
                        >
                            <IconPlus className="w-4 h-4" />
                        </Button>

                        {selectedLocation && !isCreateFormVisible && (
                            <LocationDetail
                                location={selectedLocation}
                                isVisible={true}
                                stockLocationData={selectedSaleOfficeId ? filteredStockLocations : stockLocationData}
                                onClose={() => setSelectedLocation(null)}
                                onSuccess={handleLocationUpdated}
                                onStart={() => setIsCreating(true)}
                                onError={() => setIsCreating(false)}
                            />
                        )}

                        {isCreateFormVisible && !selectedLocation && (
                            <CreateLocationForm
                                isVisible={true}
                                stockLocationData={selectedSaleOfficeId ? filteredStockLocations : stockLocationData}
                                onClose={() => setIsCreateFormVisible(false)}
                                onSuccess={() => {
                                    setIsCreating(false);
                                    setIsCreateFormVisible(false);
                                    fetchLocations(keyword, currentPage, selectedStockLocationId);
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
