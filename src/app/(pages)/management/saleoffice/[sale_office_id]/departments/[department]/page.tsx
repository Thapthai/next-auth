'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { User } from "@/types/users";
import { Department } from "@/types/department";
import { IconArrowLeft } from "@tabler/icons-react";

export default function DepartmentDetailPage() {
    const params = useParams();
    const departmentId = params.department;

    const [department, setDepartment] = useState<Department | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (!departmentId) return;

        async function fetchData() {
            setLoading(true);
            try {
                const deptRes = await fetch(`http://localhost:3000/departments/${departmentId}`);
                if (!deptRes.ok) throw new Error("ไม่พบข้อมูลแผนก");
                const deptData = await deptRes.json();

                const userRes = await fetch(`http://localhost:3000/users?department_id=${departmentId}`);
                if (!userRes.ok) throw new Error("ไม่พบข้อมูลผู้ใช้");
                const userData = await userRes.json();

                setDepartment(deptData);
                setUsers(userData);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [departmentId]);

    if (loading) return <div className="p-6 text-center text-gray-500">⏳ กำลังโหลดข้อมูล...</div>;
    if (error) return <div className="p-6 text-center text-red-500">{error}</div>;
    if (!department) return <div className="p-6 text-center text-gray-500">ไม่พบข้อมูลแผนก</div>;

    return (
        <>
            <SiteHeader headerTopic="รายละเอียดแผนก" />

            <div className="px-6 py-8 mx-auto space-y-6">

                <div className="flex items-center space-x-4">
                    <Button variant="secondary" onClick={() => router.back()}>
                        <IconArrowLeft className="w-5 h-5 mr-2" />
                        กลับ
                    </Button>
                    <h2 className="text-2xl font-bold text-gray-800">
                        แผนก: {department.name_th} ({department.department_code})
                    </h2>
                </div>

                {/* รายละเอียดแผนก */}
                <div className="border rounded-lg p-4 bg-gray-50 shadow-sm">
                    <p className="text-gray-700 whitespace-pre-line">{department.description || "ไม่มีคำอธิบาย"}</p>
                </div>

                {/* ตารางรายชื่อผู้ใช้ */}
                <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        รายชื่อผู้ใช้ในแผนก
                    </h3>

                    {users.length === 0 ? (
                        <p className="text-sm text-gray-500">ไม่มีผู้ใช้ในแผนกนี้</p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ชื่อผู้ใช้</TableHead>
                                    <TableHead>อีเมล</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </div>
            </div>
        </>
    );
}
