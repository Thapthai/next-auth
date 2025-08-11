'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { Input } from "@/components/ui/input";
import { StockLocation } from "@/types/stockLocation";
import { IconArrowLeft, IconReload, IconChevronLeft, IconChevronRight, IconPlus, IconSearch, IconChevronLeftPipe, IconChevronRightPipe } from "@tabler/icons-react";
import { Location } from "@/types/location";
import LocationDetailForm from "./LocationDetail";
import { Loader2 } from "lucide-react";
import CreateLocationForm from "./LocationCreateForm";
import { useTranslations } from "next-intl";

export default function LocationByStockLocationId() {
    const params = useParams();
    const stockLocationId = params.stock_location_id;
    const [locations, setLocations] = useState<Location[]>([]);
    const [stockLocation, setStockLocation] = useState<StockLocation | null>(null);
    const [keyword, setKeyword] = useState("");
    const [page, setPage] = useState(1);
    const [pageSize] = useState(5);
    const [total, setTotal] = useState(0);
    const [input, setInput] = useState("");
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
    const [loadingId, setLoadingId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const pathname = usePathname();
    const [isCreateFormVisible, setIsCreateFormVisible] = useState(false);

    const t = useTranslations('Locations');
    const handleCreateSuccess = () => {
        setIsCreateFormVisible(false);
        setPage(1); // รีเซ็ตกลับไปหน้า 1 เพื่อเห็นรายการใหม่
    };
    // Reset loading state when pathname changes (navigation completes)
    useEffect(() => {
        if (loadingId) {
            setLoadingId(null);

        }
    }, [pathname]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setKeyword(input);
        setPage(1);
    };

    const handleReset = () => {
        setInput('');
        setKeyword('');
        setPage(1);
        setSelectedLocation(null);
        setIsCreateFormVisible(false);
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const handleNextPage = () => {
        if (page < totalPages) {
            setPage(page + 1);
        }
    };

    const handlePreviousPage = () => {
        if (page > 1) {
            setPage(page - 1);
        }
    };

    const totalPages = Math.ceil(total / pageSize);

    // Function to get visible page numbers (current page and neighbors)
    const getVisiblePages = () => {
        const pages = [];
        const start = Math.max(1, page - 1);
        const end = Math.min(totalPages, page + 1);

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        return pages;
    };

    const fetchLocations = async () => {
        if (!stockLocationId) return;

        setLoading(true);
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/locations/pagination-with-search?page=${page}&pageSize=${pageSize}&keyword=${keyword}&stock_location_id=${stockLocationId}`
            );
            if (!res.ok) throw new Error("Failed to fetch locations");
            const data = await res.json();
            setLocations(data.data || []);
            setTotal(data.total || 0);
        } catch (error) {
            console.error("Failed to fetch locations:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStockLocation = async () => {
        if (!stockLocationId) return;

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/stock-locations/${stockLocationId}`);
            if (!res.ok) throw new Error("Failed to fetch stock location");
            const data = await res.json();
            setStockLocation(data);
        } catch (error) {
            console.error("Failed to fetch stock location:", error);
        }
    };

    useEffect(() => {
        if (stockLocationId) {
            fetchStockLocation();
        }
    }, [stockLocationId]);

    useEffect(() => {
        if (stockLocationId) {
            fetchLocations();
        }
    }, [stockLocationId, page, keyword]);

    const handleLocationUpdated = () => {
        setSelectedLocation(null);
        fetchLocations();
    };

    const handleCreateLocation = () => {
        setIsCreateFormVisible(true);
        setSelectedLocation(null);
    };

    return (
        <div>
            <SiteHeader 
                headerTopic={`${t('title')} - ${stockLocation ? `${stockLocation.site_short_code} (${stockLocation.description || '-'})` : ''}`} 
            />

            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
                        {/* Back Button */}
                        <div className="flex items-center gap-2">
                            <Link href="/management/stockLocation">
                                <Button variant="outline" size="sm">
                                    <IconArrowLeft className="w-4 h-4 mr-2" />
                                    {t('backToStockLocations')}
                                </Button>
                            </Link>
                        </div>

                        {/* Search Form */}
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
                            <Button type="submit" variant="outline">
                                <IconSearch className="w-4 h-4" />
                            </Button>
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
                                            <TableCell>{(page - 1) * pageSize + index + 1}</TableCell>
                                            <TableCell className="font-medium">
                                                {location.site_short_code}
                                            </TableCell>
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
                        {!loading && totalPages > 1 && (
                            <div className="flex items-center justify-between mt-4">
                                <div className="text-sm text-gray-500">
                                    {t('pagination.showing')} {(page - 1) * pageSize + 1} {t('pagination.to')} {Math.min(page * pageSize, total)} {t('pagination.of')} {total} {t('pagination.results')}
                                </div>
                                <div className="flex items-center space-x-1">
                                    {/* First page */}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePageChange(1)}
                                        disabled={page === 1}
                                        className="w-8 h-8 p-0"
                                    >
                                        <IconChevronLeftPipe className="w-4 h-4" />
                                    </Button>

                                    {/* Previous page */}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handlePreviousPage}
                                        disabled={page === 1}
                                        className="w-8 h-8 p-0"
                                    >
                                        <IconChevronLeft className="w-4 h-4" />
                                    </Button>

                                    {/* Page numbers */}
                                    {getVisiblePages().map((pageNumber) => (
                                        <Button
                                            key={pageNumber}
                                            variant={page === pageNumber ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => handlePageChange(pageNumber)}
                                            className="w-8 h-8 p-0"
                                        >
                                            {pageNumber}
                                        </Button>
                                    ))}

                                    {/* Next page */}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleNextPage}
                                        disabled={page === totalPages}
                                        className="w-8 h-8 p-0"
                                    >
                                        <IconChevronRight className="w-4 h-4" />
                                    </Button>

                                    {/* Last page */}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePageChange(totalPages)}
                                        disabled={page === totalPages}
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
                            <LocationDetailForm
                                location={selectedLocation}
                                isVisible={true}
                                onClose={() => setSelectedLocation(null)}
                                onSuccess={handleLocationUpdated}
                                refresh={fetchLocations}
                                stockLocationId={Number(stockLocationId)}
                            />
                        )}

                        {isCreateFormVisible && !selectedLocation && (
                            <CreateLocationForm
                                isVisible={true}
                                stockLocationId={Number(stockLocationId)}
                                onClose={() => setIsCreateFormVisible(false)}
                                onSuccess={handleCreateSuccess}
                                refresh={fetchLocations}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
