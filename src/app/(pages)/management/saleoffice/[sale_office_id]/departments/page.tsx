'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { Input } from "@/components/ui/input"; // คุณต้องมี input จาก ui component
import { SaleOffice } from "@/types/saleOffice";
import { IconArrowLeft, IconCaretRightFilled, IconChevronLeft, IconChevronRight, IconPlus, IconReload, IconSearch } from "@tabler/icons-react";
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
    const [pageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [input, setInput] = useState("");
    const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
    const [loadingId, setLoadingId] = useState<number | null>(null);
 
    const pathname = usePathname();
    const [isCreateFormVisible, setIsCreateFormVisible] = useState(false);
 


    const t = useTranslations('saleOffice');
    const handleCreateSuccess = () => {
        setIsCreateFormVisible(false);

        loadDepartments(); // รีเฟรชข้อมูล
    };
    // Reset loading state when pathname changes (navigation completes)
    useEffect(() => {
        if (loadingId) {
            setLoadingId(null);

        }
    }, [pathname]);

    const handleSearch = () => {
        setKeyword(input);
        setPage(1);
    };

    useEffect(() => {
        if (!saleOfficeId) return;
        const fetchSaleOffice = async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sale-offices/${saleOfficeId}`);
            const data = await res.json();
            setSaleOffice(data);
        };
        fetchSaleOffice();
    }, [saleOfficeId]);

    useEffect(() => {
        if (!saleOfficeId) return;
        const fetchDepartments = async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/departments/sale-offices?keyword=${keyword}&page=${page}&pageSize=${pageSize}&saleOfficeId=${saleOfficeId}`);
            const data = await res.json();

            setDepartments(data.items || data); // เผื่อกรณีคุณยังไม่ได้ส่ง total
            if (data.total) setTotal(data.total);
        };
        fetchDepartments();
    }, [saleOfficeId, keyword, page, pageSize]);

    const totalPages = Math.ceil(total / pageSize);

    const handleGoToDepartmentDetail = (saleId: number, depId: number) => {
        // หา department ที่ถูกเลือก
        const selectedDept = departments.find(dept => dept.id === depId);
        if (selectedDept) {
            setSelectedDepartment(selectedDept);
            setIsCreateFormVisible(false); // ปิดฟอร์มสร้าง
        }
    };

    const handleCreateButtonClick = () => {
        setIsCreateFormVisible(true);
        setSelectedDepartment(null); // ปิดฟอร์ม detail
    };

    const loadDepartments = async () => {
        if (!saleOfficeId) return;
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/departments/sale-offices?keyword=${keyword}&page=${page}&pageSize=${pageSize}&saleOfficeId=${saleOfficeId}`);
        const data = await res.json();
        setDepartments(data.items || data);
        if (data.total) setTotal(data.total);
    };

    useEffect(() => {
        loadDepartments();
    }, [saleOfficeId, keyword, page, pageSize]);

    return (
        <>
            <SiteHeader headerTopic="รายการสาขา (Sale Offices)" />
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
                        <div className="flex items-center justify-between mb-4">
                            <Link href="/management/saleoffice">
                                <Button variant="secondary">
                                    <IconArrowLeft /> {t('back')}
                                </Button>
                            </Link>
                            <h2 className="text-xl font-bold">{t('departmentIn')} {saleOffice?.site_office_name_th || `Sale Office ID: ${saleOfficeId}`}</h2>
                        </div>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSearch();
                            }}
                            className="flex items-center gap-2 mb-4"
                        >
                            <Input
                                placeholder="ค้นหาแผนก"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                            />
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setInput("");
                                    setKeyword("");
                                    setPage(1);
                                }}
                            >
                                <IconReload />

                            </Button>
                            <Button type="submit">
                                <IconSearch />
                            </Button>
                            <Button
                                onClick={handleCreateButtonClick}
                                variant="outline"
                                size="icon"
                                className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                                title={t("createNewDepartment")}
                            >
                                <IconPlus className="w-4 h-4" />
                            </Button>
                        </form>

                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead></TableHead>
                                    <TableHead>{t('departmentCode')}</TableHead>
                                    <TableHead>{t('nameThai')}</TableHead>
                                    <TableHead>{t('nameEnglish')}</TableHead>
                                    <TableHead>{t('description')}</TableHead>

                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {departments.length > 0 ? (
                                    departments.map((dept) => (
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
                                            <TableCell>{dept.department_code}</TableCell>
                                            <TableCell>{dept.name_th}</TableCell>
                                            <TableCell>{dept.name_en}</TableCell>
                                            <TableCell>{dept.description}</TableCell>

                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                                            {t('noData')}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>

                        {total > pageSize && (
                            <div className="flex justify-end items-center gap-2 mt-4">
                                <Button
                                    variant="outline"
                                    disabled={page <= 1}
                                    onClick={() => setPage(page - 1)}
                                >
                                    <IconChevronLeft /> {t('previous')}
                                </Button>
                                <span className="text-sm text-gray-700">{t('page')} {page} / {totalPages}</span>
                                <Button
                                    variant="outline"
                                    disabled={page >= totalPages}
                                    onClick={() => setPage(page + 1)}
                                >
                                    {t('next')} <IconChevronRight />
                                </Button>
                            </div>
                        )}

                        {selectedDepartment && !isCreateFormVisible && (
                            <DepartmentDetailForm
                                department={selectedDepartment}
                                refresh={loadDepartments}
                            />
                        )}

                        {isCreateFormVisible && !selectedDepartment && (
                            <CreateDepartmentForm
                                isVisible={true}
                                saleOfficeId={Number(saleOfficeId)}
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
