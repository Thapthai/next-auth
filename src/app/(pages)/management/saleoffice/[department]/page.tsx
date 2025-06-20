"use client"
import { useState, useEffect } from "react";
import { useParams } from "next/navigation"; // Next 13+ router hook
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { User } from "@/types/users";
import { Department } from "@/types/department";
import { useRouter } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { IconArrowAutofitLeft, IconArrowLeft, IconSignRight } from "@tabler/icons-react";

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
                // ดึงข้อมูล department
                const deptRes = await fetch(`http://localhost:3000/departments/${departmentId}`);
                if (!deptRes.ok) throw new Error("ไม่พบข้อมูลแผนก");
                const deptData = await deptRes.json();

                // ดึง user ในแผนกนี้
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

    if (loading) return <p>กำลังโหลดข้อมูล...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
    if (!department) return <p>ไม่พบข้อมูลแผนก</p>;
    return (
        <>
            <SiteHeader headerTopic="รายการสาขา (Sale Offices)" />

            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
                        <div className="flex items-center justify-between mb-6 px-4 lg:px-6">
                            <button
                                onClick={() => router.back()}
                                className="flex items-center p-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium transition"
                                aria-label="กลับ"
                            >
                                <IconArrowLeft className="w-5 h-5" />
                            </button>
                            <h2 className="text-2xl font-extrabold text-gray-900 border-b border-gray-300 pb-2 ml-4 flex-1 text-center lg:text-left">
                                แผนก: {department.name_th} ({department.department_code})
                            </h2>
                        </div>


                        <p className="mb-6 text-gray-700 max-w-3xl leading-relaxed">
                            {department.description}
                        </p>

                        {/* หัวข้อรายชื่อผู้ใช้ */}
                        <h3 className="text-xl font-semibold text-gray-900 border-b border-gray-300 pb-1 mb-4">
                            รายชื่อผู้ใช้ในแผนก
                        </h3>

                        {/* ส่วนอื่น ๆ ต่อจากนี้ */}

                        {users.length === 0 ? (
                            <p>ไม่มีผู้ใช้ในแผนกนี้</p>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Username</TableHead>
                                        <TableHead>Email</TableHead>
                                        {/* เพิ่มหัวข้ออื่นถ้าต้องการ */}
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
                    </div >
                </div >
            </div >

        </>
    );
}
