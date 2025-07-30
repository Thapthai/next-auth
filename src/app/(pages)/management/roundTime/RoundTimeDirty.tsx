import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { IconChevronLeft, IconChevronRight, IconPlus, IconReload, IconSearch } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Table, TableHead } from "@/components/ui/table";
import { TableHeader, TableRow } from "@/components/ui/table";
import { TableBody, TableCell } from "@/components/ui/table";
import { RoundTimeDirties } from "@/types/roundTimeDirties";
import { SaleOffice } from "@/types/saleOffice";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import RoundTimeDirtyDetail from "./RoundTimeDirtyDetail";
import RoundTimeDirtyCreate from "./RoundTimeDirtyCreate";


export default function RoundTimeDirty() {
    const t = useTranslations("roundTime");
    const [saleoffice_id, setSaleoffice_id] = useState("");
    const [saleOffices, setSaleOffices] = useState<SaleOffice[]>([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingSaleOffices, setLoadingSaleOffices] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [roundTimeDirties, setRoundTimeDirties] = useState<RoundTimeDirties[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [selectedRoundTimeDirty, setSelectedRoundTimeDirty] = useState<any>(null);
    const [isCreateFormVisible, setIsCreateFormVisible] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const itemsPerPage = 10;

    const fetchSaleOffices = async () => {
        setLoadingSaleOffices(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sale-offices`);
            if (!res.ok) throw new Error("Failed to fetch sale offices");
            const data = await res.json();
            setSaleOffices(data.data || []);
        } catch (err) {
            console.error(err);
            setError("ไม่สามารถโหลดข้อมูลสำนักงานขายได้");
        } finally {
            setLoadingSaleOffices(false);
        }
    };

    const fetchItems = async (saleoffice_id = "", page = currentPage) => {

        if (!saleoffice_id) {
            setRoundTimeDirties([]);
            setTotalItems(0);
            setTotalPages(1);
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/round-time-dirties/pagination-with-search?page=${page}&pageSize=${itemsPerPage}&saleoffice_id=${saleoffice_id}`);
            if (!res.ok) throw new Error("Failed to fetch items");
            const data = await res.json();
            setRoundTimeDirties(data.data || []);
            setTotalItems(data.total || 0);
            setTotalPages(Math.ceil((data.total || 0) / itemsPerPage));
        } catch (err) {
            console.error(err);
            setError(t("fetchError"));
        } finally {
            setLoading(false);
        }
    };

    // Fetch Sale Offices on component mount
    useEffect(() => {
        fetchSaleOffices();
    }, []);

    // Fetch round time dirties when page or saleoffice_id changes
    useEffect(() => {
        fetchItems(saleoffice_id, currentPage);
    }, [currentPage, saleoffice_id]);

    const handleSaleOfficeChange = (value: string) => {
        setSaleoffice_id(value);
        setCurrentPage(1); // Reset to first page when changing sale office
    };


    const handleReset = () => {
        setSaleoffice_id("");
        setCurrentPage(1);
        setError("");
    };

    const handlePreviousPage = () => {
        setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        setCurrentPage(currentPage + 1);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return <>
        <TabsContent value="roundTimeDirty">
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
                        
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight">{t("roundTimeDirty.cardTitle")}</h1>
                                <p className="text-muted-foreground">{t("roundTimeDirty.cardDescription")}</p>
                            </div>
                        </div>

                        <div className="flex gap-2 mb-4">
                            <div className="flex-1">
                                <Select
                                    value={saleoffice_id}
                                    onValueChange={handleSaleOfficeChange}
                                    disabled={loadingSaleOffices}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder={loadingSaleOffices ? "กำลังโหลด..." : "เลือกสำนักงานขาย"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {saleOffices.map((office) => (
                                            <SelectItem key={office.id} value={office.id.toString()}>
                                                {office.site_code} - {office.site_office_name_th}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleReset}
                                disabled={loadingSaleOffices}
                                className="px-3"
                            >
                                <IconReload className="w-4 h-4" />
                            </Button>
                            
                            <Button
                                type="button"
                                onClick={() => setIsCreateFormVisible(true)}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                        
                                title={t('roundTimeDirty.createNewItem')}
                            >
                                <IconPlus className="w-4 h-4 mr-2" />
                                {t('roundTimeDirty.create')}
                            </Button>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                                {error}
                            </div>
                        )}

                        {loading ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="flex items-center space-x-2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                    <span className="text-muted-foreground">{t('loading')}</span>
                                </div>
                            </div>
                        ) : roundTimeDirties.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-muted-foreground">{t('roundTimeDirty.noData')}</p>
                            </div>
                        ) : (
                            <div className="border rounded-lg">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-12"></TableHead>
                                            <TableHead className="w-16">#</TableHead>
                                            <TableHead>{t('roundTimeDirty.time')}</TableHead>
                                            <TableHead>{t('roundTimeDirty.status')}</TableHead>
                                            <TableHead>{t('roundTimeDirty.createdAt')}</TableHead>
                                            <TableHead>{t('roundTimeDirty.updatedAt')}</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {roundTimeDirties.map((roundTimeDirtie, index) => (
                                            <TableRow 
                                                key={roundTimeDirtie.id}
                                                className={`cursor-pointer hover:bg-muted/50 ${
                                                    selectedRoundTimeDirty?.id === roundTimeDirtie.id ? 'bg-muted' : ''
                                                }`}
                                                onClick={() => {
                                                    setSelectedRoundTimeDirty(roundTimeDirtie);
                                                    setIsCreateFormVisible(false);
                                                }}
                                            >
                                                <TableCell className="w-12">
                                                    <input
                                                        type="radio"
                                                        name="selectedItem"
                                                        value={roundTimeDirtie.id}
                                                        checked={selectedRoundTimeDirty?.id === roundTimeDirtie.id}
                                                        onChange={() => {
                                                            setSelectedRoundTimeDirty(roundTimeDirtie);
                                                            setIsCreateFormVisible(false);
                                                        }}
                                                        className="w-4 h-4 text-blue-600"
                                                    />
                                                </TableCell>
                                                <TableCell className="w-16 font-medium">
                                                    {(currentPage - 1) * itemsPerPage + index + 1}
                                                </TableCell>
                                                <TableCell className="font-mono">
                                                    {roundTimeDirtie.time}
                                                </TableCell>
                                                <TableCell>
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        roundTimeDirtie.status 
                                                            ? 'bg-green-100 text-green-800' 
                                                            : 'bg-red-100 text-red-800'
                                                    }`}>
                                                        {roundTimeDirtie.status ? t('roundTimeDirty.active') : t('roundTimeDirty.inactive')}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-muted-foreground">
                                                    {roundTimeDirtie.create_at 
                                                        ? new Date(roundTimeDirtie.create_at).toLocaleDateString('th-TH', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })
                                                        : '-'
                                                    }
                                                </TableCell>
                                                <TableCell className="text-muted-foreground">
                                                    {roundTimeDirtie.update_at 
                                                        ? new Date(roundTimeDirtie.update_at).toLocaleDateString('th-TH', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })
                                                        : '-'
                                                    }
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}

                        {/* Pagination */}
                        {!loading && !error && totalPages > 1 && (
                            <div className="flex items-center justify-between mt-6">
                                <div className="text-sm text-muted-foreground">
                                    แสดง {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, totalItems)} จาก {totalItems} รายการ
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handlePreviousPage}
                                        disabled={currentPage === 1}
                                        className="h-8"
                                    >
                                        <IconChevronLeft className="w-4 h-4 mr-1" />
                                        ก่อนหน้า
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
                                        className="h-8"
                                    >
                                        ถัดไป
                                        <IconChevronRight className="w-4 h-4 ml-1" />
                                    </Button>
                                </div>
                            </div>
                        )}

                        {selectedRoundTimeDirty && !isCreateFormVisible && (
                            <RoundTimeDirtyDetail 
                                roundTimeDirty={selectedRoundTimeDirty} 
                                isVisible={true} 
                                saleOfficeData={saleOffices}
                                onClose={() => setSelectedRoundTimeDirty(null)} 
                                onSuccess={() => {
                                    setSelectedRoundTimeDirty(null);
                                    fetchItems(saleoffice_id, currentPage);
                                }} 
                                onStart={() => setIsCreating(true)} 
                                onError={() => setIsCreating(false)} 
                            />
                        )}

                        {isCreateFormVisible && (
                            <RoundTimeDirtyCreate
                                isVisible={true}
                                saleOfficeData={saleOffices}
                                onClose={() => setIsCreateFormVisible(false)}
                                onSuccess={() => {
                                    setIsCreateFormVisible(false);
                                    fetchItems(saleoffice_id, currentPage);
                                }}
                                onStart={() => setIsCreating(true)}
                                onError={() => setIsCreating(false)}
                            />
                        )}
                    </div>
                </div>
            </div>
        </TabsContent>
    </>;
}