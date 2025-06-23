'use client';

import { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import DepartmentModal from "./DepartmentModal";
import { Department } from "@/types/department";
import EditDepartmentModal from "./EditDepartmentModal";
import {
    IconCaretDownFilled,
    IconCaretRightFilled,
    IconEdit,
    IconEye,
    IconPlus,
    IconTrash
} from "@tabler/icons-react";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import SaleOfficeModal from "./SaleOfficeModal";

type SaleOffice = {
    id: number;
    site_code: string;
    site_office_name_th: string;
    site_office_name_en: string;
    status: boolean;
    departments: Department[];
};

export default function SaleOfficePage() {
    const [saleOffices, setSaleOffices] = useState<SaleOffice[]>([]);
    const [expandedIds, setExpandedIds] = useState<number[]>([]);
    const [error, setError] = useState<string | null>(null);

    // ✨ เพิ่มที่ด้านบนของ component
    const [departmentDialogOpen, setDepartmentDialogOpen] = useState(false);
    const [selectedSaleOfficeId, setSelectedSaleOfficeId] = useState<number | null>(null);
    const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);

    const [editingSaleOffice, setEditingSaleOffice] = useState<SaleOffice | null>(null);
    const [saleOfficeDialogOpen, setSaleOfficeDialogOpen] = useState(false);


    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch("http://localhost:3000/sale-offices");
                if (!res.ok) throw new Error("Failed to fetch sale offices");
                const data = await res.json();
                setSaleOffices(data);
            } catch (err) {
                console.error(err);
                setError("ไม่สามารถโหลดข้อมูลได้");
            }
        }
        fetchData();
    }, []);

    const toggleExpand = (id: number) => {
        setExpandedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const fetchData = async () => {
        try {
            const res = await fetch("http://localhost:3000/sale-offices");
            if (!res.ok) throw new Error("Failed to fetch sale offices");
            const data = await res.json();
            setSaleOffices(data);
        } catch (err) {
            console.error(err);
            setError("ไม่สามารถโหลดข้อมูลได้");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDeleteDepartment = async (id: number) => {
        if (!confirm("คุณแน่ใจหรือไม่ว่าต้องการลบแผนกนี้?")) return;

        try {
            const res = await fetch(`http://localhost:3000/departments/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("ลบไม่สำเร็จ");

            // รีเฟรชข้อมูลใหม่
            fetchData();
        } catch (error) {
            alert("เกิดข้อผิดพลาดขณะลบแผนก");
        }
    };



    return (
        <>
            <SiteHeader headerTopic="รายการสาขา (Sale Offices)" />
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">


                        {error && <p className="text-red-500">{error}</p>}

                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Site Code</TableHead>
                                    <TableHead>ชื่อไทย</TableHead>
                                    <TableHead>ชื่ออังกฤษ</TableHead>
                                    <TableHead></TableHead>

                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {saleOffices.map((office) => (
                                    <>
                                        <TableRow key={office.id}>

                                            <TableCell>{office.site_code}</TableCell>
                                            <TableCell>{office.site_office_name_th}</TableCell>
                                            <TableCell>{office.site_office_name_en}</TableCell>

                                            <TableCell className="w-10">

                                                <Button
                                                    variant="secondary"
                                                    className="mx-2"
                                                    size="icon"
                                                    onClick={() => {
                                                        setEditingSaleOffice(office);
                                                        setSaleOfficeDialogOpen(true);
                                                    }}
                                                >
                                                    <IconEdit />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => toggleExpand(office.id)}
                                                >
                                                    {expandedIds.includes(office.id) ? <IconCaretDownFilled /> : <IconCaretRightFilled />}
                                                </Button>
                                            </TableCell>
                                        </TableRow>


                                        {expandedIds.includes(office.id) && (
                                            <TableRow className="bg-muted">
                                                <TableCell colSpan={4}>
                                                    <div className="pl-8">
                                                        <div className="flex justify-between items-center mb-2">
                                                            <h4 className="font-semibold">แผนกภายใน</h4>
                                                            <Button
                                                                onClick={() => {
                                                                    setSelectedSaleOfficeId(office.id);
                                                                    setEditingDepartment(null);
                                                                    setDepartmentDialogOpen(true);
                                                                }}
                                                            >
                                                                <IconPlus />
                                                            </Button>
                                                        </div>

                                                        <Table>
                                                            <TableHeader>
                                                                <TableRow>
                                                                    <TableHead>รหัสแผนก</TableHead>
                                                                    <TableHead>ชื่อไทย</TableHead>
                                                                    <TableHead>ชื่ออังกฤษ</TableHead>
                                                                    <TableHead>คำอธิบาย</TableHead>
                                                                </TableRow>
                                                            </TableHeader>
                                                            <TableBody>
                                                                {office.departments.map((dept) => (
                                                                    <TableRow key={dept.id}>
                                                                        <TableCell>{dept.department_code}</TableCell>
                                                                        <TableCell>{dept.name_th}</TableCell>
                                                                        <TableCell>{dept.name_en}</TableCell>
                                                                        <TableCell>{dept.description}</TableCell>
                                                                        <TableCell className="text-right space-x-2">
                                                                            <Link href={`/management/saleoffice/${dept.id}`} passHref legacyBehavior>
                                                                                <Button variant="outline" size="sm">
                                                                                    <IconEye /> ดูข้อมูล
                                                                                </Button>
                                                                            </Link>
                                                                            <Button
                                                                                variant="secondary"
                                                                                size="sm"
                                                                                onClick={() => {
                                                                                    setEditingDepartment(dept);
                                                                                    setDepartmentDialogOpen(true);
                                                                                    setSelectedSaleOfficeId(office.id);
                                                                                }}
                                                                            >
                                                                                <IconEdit />
                                                                            </Button>
                                                                            <Button
                                                                                variant="destructive"
                                                                                size="sm"
                                                                                onClick={() => handleDeleteDepartment(dept.id)}
                                                                            >
                                                                                <IconTrash />
                                                                            </Button>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ))}
                                                            </TableBody>
                                                        </Table>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </>
                                ))}
                            </TableBody>
                        </Table>

                        <SaleOfficeModal
                            open={saleOfficeDialogOpen}
                            setOpen={setSaleOfficeDialogOpen}
                            saleOffice={editingSaleOffice}
                            refresh={fetchData}
                        />

                        <DepartmentModal
                            open={departmentDialogOpen}
                            setOpen={setDepartmentDialogOpen}
                            saleOfficeId={selectedSaleOfficeId}
                            department={editingDepartment}
                            refresh={fetchData}
                        />

                        <EditDepartmentModal
                            open={departmentDialogOpen}
                            setOpen={setDepartmentDialogOpen}
                            saleOfficeId={selectedSaleOfficeId}
                            department={editingDepartment}
                            refresh={fetchData}
                        />
                    </div>
                </div>
            </div>
        </>

    );
}
