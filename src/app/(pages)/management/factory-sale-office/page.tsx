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
import { IconChevronLeft, IconChevronRight, IconPlus, IconReload, IconSearch } from "@tabler/icons-react";
import { FactorySaleOffice } from "@/types/factorySaleOffice";

import { Input } from "@/components/ui/input";
import FactorySaleOfficeDetail from "./FactorySaleOfficeDetail";
import CreateFactorySaleOfficeForm from "./CreateFactorySaleOfficeForm";

export default function FactorySaleOfficePage() {
    const t = useTranslations("FactorySaleOffice");

    const [factorySaleOffices, setFactorySaleOffices] = useState<FactorySaleOffice[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedItem, setSelectedItem] = useState<FactorySaleOffice | null>(null);
    const [isCreateFormVisible, setIsCreateFormVisible] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [keyword, setKeyword] = useState('');
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage] = useState(5);
    const [input, setInput] = useState('');
    const [searchLoading, setSearchLoading] = useState(false);
    const [saleOffices, setSaleOffices] = useState<any[]>([]);
    const [factories, setFactories] = useState<any[]>([]);
    const [loadingMasterData, setLoadingMasterData] = useState(false);

    const fetchFactorySaleOffices = async (keyword = "", page = currentPage) => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/factory-sale-office/paginated?page=${page}&pageSize=${itemsPerPage}&keyword=${keyword}`);
            if (!res.ok) throw new Error("Failed to fetch factory sale offices");
            const data = await res.json();
            setFactorySaleOffices(data.data || []);
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
        fetchFactorySaleOffices();
    }, [currentPage]);

    useEffect(() => {
        loadMasterData();
    }, []);

    const loadMasterData = async () => {
        setLoadingMasterData(true);
        try {
            // Load sale offices and factories in parallel
            const [saleOfficesRes, factoriesRes] = await Promise.all([
                fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sale-offices`),
                fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/factories`)
            ]);

            if (saleOfficesRes.ok) {
                const saleOfficesData = await saleOfficesRes.json();
                setSaleOffices(saleOfficesData.data || saleOfficesData || []);
            }

            if (factoriesRes.ok) {
                const factoriesData = await factoriesRes.json();
                setFactories(factoriesData.data || factoriesData || []);
            }
        } catch (err) {
            console.error('Error loading master data:', err);
        } finally {
            setLoadingMasterData(false);
        }
    };

    const handleCreateItem = () => {
        setIsCreateFormVisible(true);
        setSelectedItem(null);
    };

    const handleReset = async () => {
        setSearchLoading(true);
        setInput('');
        setCurrentPage(1);
        setKeyword('');
        await fetchFactorySaleOffices();
        setSearchLoading(false);
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setSearchLoading(true);
        setCurrentPage(1);
        setKeyword(input);
        await fetchFactorySaleOffices(input);
        setSearchLoading(false);
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
        <div>
            <SiteHeader headerTopic={t("headerTopic")} />

            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">

                        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
                            <Input
                                placeholder={t('search')}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                disabled={searchLoading || loading}
                            />
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleReset}
                                disabled={searchLoading || loading}
                            >
                                {searchLoading ? (
                                    <>
                                        <IconReload className="animate-spin mr-2" />
                                        กำลังรีเซ็ต...
                                    </>
                                ) : (
                                    <IconReload />
                                )}
                            </Button>
                            <Button
                                type="submit"
                                disabled={searchLoading || loading}
                            >
                                {searchLoading ? (
                                    <>
                                        <IconReload className="animate-spin mr-2 w-4 h-4" />
                                        กำลังค้นหา...
                                    </>
                                ) : (
                                    <>
                                        <IconSearch className="mr-2" />
                                        {t('search')}
                                    </>
                                )}
                            </Button>
                            <Button
                                type="button"
                                onClick={handleCreateItem}
                                variant="outline"
                                size="icon"
                                className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                                title={t("createNewFactorySaleOffice")}
                            >
                                <IconPlus className="w-4 h-4" />
                            </Button>
                        </form>

                        {error && <p className="text-red-500">{error}</p>}

                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="flex items-center gap-2">
                                    <IconReload className="animate-spin w-5 h-5" />
                                    <span>กำลังโหลดข้อมูล...</span>
                                </div>
                            </div>
                        ) : factorySaleOffices.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead></TableHead>
                                        <TableHead>#</TableHead>
                                        <TableHead>{t("table.saleOffice")}</TableHead>
                                        <TableHead>{t("table.factory")}</TableHead>
                                        <TableHead>{t("table.status")}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {factorySaleOffices.map((item, index) => (
                                        <TableRow key={item.id}>
                                            <TableCell className="w-10">
                                                <label className="flex items-center space-x-2 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="selectedItem"
                                                        value={item.id}
                                                        checked={selectedItem?.id === item.id}
                                                        onChange={() => {
                                                            setSelectedItem(item);
                                                            setIsCreateFormVisible(false);
                                                        }}
                                                    />
                                                </label>
                                            </TableCell>
                                            <TableCell>{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                                            <TableCell>
                                                <div className="max-w-48 truncate" title={item.sale_office?.site_office_name_th}>
                                                    {item.sale_office?.site_office_name_th || `ID: ${item.sale_office_id}`}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="max-w-48 truncate" title={item.factory?.name_th}>
                                                    {item.factory?.name_th || `ID: ${item.factory_id}`}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className={`px-2 py-1 rounded-full text-xs ${item.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {item.status ? t('active') : t('inactive')}
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
                                        disabled={currentPage === 1 || loading}
                                    >
                                        {loading ? (
                                            <>
                                                <IconReload className="animate-spin w-4 h-4 mr-1" />
                                                กำลังโหลด...
                                            </>
                                        ) : (
                                            <>
                                                <IconChevronLeft className="w-4 h-4 mr-1" />
                                                {t('previous')}
                                            </>
                                        )}
                                    </Button>

                                    <div className="flex items-center space-x-1">
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                            <Button
                                                key={page}
                                                variant={currentPage === page ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => handlePageChange(page)}
                                                className="w-8 h-8 p-0"
                                                disabled={loading}
                                            >
                                                {loading ? (
                                                    <IconReload className="animate-spin w-3 h-3" />
                                                ) : (
                                                    page
                                                )}
                                            </Button>
                                        ))}
                                    </div>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleNextPage}
                                        disabled={currentPage === totalPages || loading}
                                    >
                                        {loading ? (
                                            <>
                                                กำลังโหลด...
                                                <IconReload className="animate-spin w-4 h-4 ml-1" />
                                            </>
                                        ) : (
                                            <>
                                                {t('next')}
                                                <IconChevronRight className="w-4 h-4 ml-1" />
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        )}

                        {selectedItem && !isCreateFormVisible && (
                            <FactorySaleOfficeDetail
                                isVisible={true}
                                factorySaleOffice={selectedItem}
                                saleOffices={saleOffices}
                                factories={factories}
                                loadingMasterData={loadingMasterData}
                                onClose={() => setSelectedItem(null)}
                                onSuccess={() => {
                                    setSelectedItem(null);
                                    fetchFactorySaleOffices(keyword, currentPage);
                                }}
                                onStart={() => { }}
                                onError={() => {
                                    console.error('Error updating factory sale office');
                                }}
                            />
                        )}

                        {isCreateFormVisible && !selectedItem && (
                            <CreateFactorySaleOfficeForm
                                isVisible={true}
                                saleOffices={saleOffices}
                                factories={factories}
                                loadingMasterData={loadingMasterData}
                                onClose={() => setIsCreateFormVisible(false)}
                                onSuccess={() => {
                                    setIsCreateFormVisible(false);
                                    fetchFactorySaleOffices(keyword, currentPage);
                                }}
                                onStart={() => { }}
                                onError={() => { }}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}