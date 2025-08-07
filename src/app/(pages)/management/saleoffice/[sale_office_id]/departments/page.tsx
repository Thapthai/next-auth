'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { Input } from "@/components/ui/input"; // คุณต้องมี input จาก ui component
import { SaleOffice } from "@/types/saleOffice";
import { IconArrowLeft, IconReload, IconChevronLeft, IconChevronRight, IconPlus, IconSearch, IconChevronLeftPipe, IconChevronRightPipe } from "@tabler/icons-react";
import { Department } from "@/types/department";
import DepartmentDetailForm from "./DepartmentDetail";
import { Loader2 } from "lucide-react";
import CreateDepartmentForm from "./DepartmentCreateForm";
import { useTranslations } from "next-intl";

export default function DepartmentBySaleOfficeId() {
    const params = useParams();
    const saleOfficeId = params.sale_office_id;
    const [departments, setDepartments] = useState<Department[]>([]);
    const [saleOffice, setSaleOffice] = useState<SaleOffice | null>(null);
    const [keyword, setKeyword] = useState("");
    const [page, setPage] = useState(1);
    const [pageSize] = useState(5);
    const [total, setTotal] = useState(0);
    const [input, setInput] = useState("");
    const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
    const [loadingId, setLoadingId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const pathname = usePathname();
    const [isCreateFormVisible, setIsCreateFormVisible] = useState(false);

    const t = useTranslations('saleOffice');
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

    useEffect(() => {
        if (!saleOfficeId) return;
        setLoading(true);
        const fetchSaleOffice = async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sale-offices/${saleOfficeId}`);
            const data = await res.json();
            setSaleOffice(data);
            setLoading(false);
        };
        fetchSaleOffice();
    }, [saleOfficeId]);

    const totalPages = Math.ceil(total / pageSize);

    const handleCreateButtonClick = () => {
        setIsCreateFormVisible(true);
        setSelectedDepartment(null); // ปิดฟอร์ม detail
    };

    const loadDepartments = async (searchKeyword = keyword, currentPage = page) => {
        if (!saleOfficeId) return;
        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/departments/sale-offices?keyword=${searchKeyword}&page=${currentPage}&pageSize=${pageSize}&saleOfficeId=${saleOfficeId}`);
            const data = await res.json();
            setDepartments(data.items || data);
            if (data.total) setTotal(data.total);
        } catch (error) {
            console.error('Error loading departments:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDepartments();
    }, [saleOfficeId, keyword, page, pageSize]);

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

    const handleReset = () => {
        setInput("");
        setKeyword("");
        setPage(1); // รีเซ็ตกลับไปหน้า 1
    };


    return (
        <>
            <SiteHeader headerTopic={t('headerTopic')} />
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
                        <div className="flex items-center justify-between mb-4">
                            <Link href="/management/saleoffice">
                                <Button variant="secondary">
                                    <IconArrowLeft /> {t('back')}
                                </Button>
                            </Link>
                            <h2 className="text-xl font-bold">{t('departmentIn')} {saleOffice?.name_th || `Sale Office ID: ${saleOfficeId}`}</h2>
                        </div>

                        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
                            <div className="relative flex-1">
                                <Input
                                    placeholder={t('search')}
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    className="pr-8"
                                />
                                {input && (
                                    <button
                                        type="button"
                                        onClick={handleReset}
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                                    >
                                        <IconReload className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                            <Button type="submit" variant="outline">
                                <IconSearch />
                            </Button>
                        </form>
                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="flex items-center gap-2">
                                    <IconReload className="animate-spin w-5 h-5" />
                                    <span>กำลังโหลดข้อมูล...</span>
                                </div>
                            </div>
                        ) : departments.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead></TableHead>
                                        <TableHead>#</TableHead>
                                        <TableHead>{t('departmentCode')}</TableHead>
                                        <TableHead>{t('nameThai')}</TableHead>
                                        <TableHead>{t('nameEnglish')}</TableHead>
                                        <TableHead>{t('description')}</TableHead>
                                        <TableHead>{t('status')}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {departments.length > 0 ? (
                                        departments.map((dept, index) => (
                                            <TableRow key={dept.id}>
                                                <TableCell className="w-10">
                                                    <label className="flex items-center space-x-2 cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            name="selectedDepartment"
                                                            value={dept.id}
                                                            checked={selectedDepartment?.id === dept.id}
                                                            onChange={() => {
                                                                setSelectedDepartment(dept);
                                                                setIsCreateFormVisible(false);
                                                            }}
                                                            onClick={() => setIsCreateFormVisible(false)}
                                                        />
                                                        <span className="sr-only">{t('select')}</span>
                                                    </label>
                                                </TableCell>
                                                <TableCell>{(page - 1) * pageSize + index + 1}</TableCell>
                                                <TableCell>{dept.department_code}</TableCell>
                                                <TableCell>
                                                    <div className="max-w-40 truncate" title={dept.name_th}>
                                                        {dept.name_th}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="max-w-40 truncate" title={dept.name_en}>
                                                        {dept.name_en}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="max-w-40 truncate" title={dept.description}>
                                                        {dept.description}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <span className={`px-2 py-1 rounded-full text-xs ${dept.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                        }`}>
                                                        {dept.status ? t('active') : t('inactive')}
                                                    </span>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                                                {t('noData')}
                                            </TableCell>
                                        </TableRow>
                                    )}
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
                        {total > pageSize && (
                            <div className="flex items-center justify-between mt-4">
                                <div className="text-sm text-gray-500">
                                    {t('show')} {(page - 1) * pageSize + 1} {t('to')} {Math.min(page * pageSize, total)} {t('of')} {total} {t('items')}
                                </div>
                                <div className="flex items-center space-x-1">
                                    {/* First page */}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setPage(1)}
                                        disabled={page === 1}
                                        className="w-8 h-8 p-0"
                                    >
                                        <IconChevronLeftPipe className="w-4 h-4" />
                                    </Button>

                                    {/* Previous page */}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setPage(page - 1)}
                                        disabled={page <= 1}
                                        className="w-8 h-8 p-0"
                                    >
                                        <IconChevronLeft className="w-4 h-4" />
                                    </Button>

                                    {/* Page numbers */}
                                    {getVisiblePages().map((pageNum) => (
                                        <Button
                                            key={pageNum}
                                            variant={page === pageNum ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => setPage(pageNum)}
                                            className="w-8 h-8 p-0"
                                        >
                                            {pageNum}
                                        </Button>
                                    ))}

                                    {/* Next page */}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setPage(page + 1)}
                                        disabled={page >= totalPages}
                                        className="w-8 h-8 p-0"
                                    >
                                        <IconChevronRight className="w-4 h-4" />
                                    </Button>

                                    {/* Last page */}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setPage(totalPages)}
                                        disabled={page === totalPages}
                                        className="w-8 h-8 p-0"
                                    >
                                        <IconChevronRightPipe className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        )}

                        <Button
                            onClick={handleCreateButtonClick}
                            variant="outline"
                            size="icon"
                            className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                            title={t("createNewDepartment")}
                        >
                            <IconPlus className="w-4 h-4" />
                        </Button>

                        {selectedDepartment && !isCreateFormVisible && (
                            <DepartmentDetailForm
                                department={selectedDepartment}
                                refresh={() => loadDepartments(keyword, page)}
                                onClose={() => setSelectedDepartment(null)}
                            />
                        )}

                        {isCreateFormVisible && !selectedDepartment && (
                            <CreateDepartmentForm
                                isVisible={true}
                                saleOfficeId={Number(saleOfficeId)}
                                refresh={() => loadDepartments(keyword, page)}
                                onClose={() => setIsCreateFormVisible(false)}
                                onSuccess={handleCreateSuccess}

                            />
                        )}

                    </div>
                </div>
            </div>
        </>
    );
}
