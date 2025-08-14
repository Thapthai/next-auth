'use client';

import { useEffect, useState } from "react";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconReload, IconSearch, IconPlus, IconChevronRight, IconChevronLeft, IconChevronRightPipe, IconChevronLeftPipe } from "@tabler/icons-react";
import { SiteHeader } from "@/components/site-header";
import { CustomerGroup } from "@/types/customerGroup";
import { v4 as uuidv4 } from 'uuid';
import { useTranslations } from "next-intl";
import CustomerGroupDetail from "./CustomerGroupDetail";
import CreateCustomerGroupForm from "./CreateCustomerGroupForm";

export default function CustomerGroupPage() {
    const [customerGroups, setCustomerGroups] = useState<CustomerGroup[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedGroup, setSelectedGroup] = useState<CustomerGroup | null>(null);
    const [keyword, setKeyword] = useState("");
    const [input, setInput] = useState("");
    const [isCreateFormVisible, setIsCreateFormVisible] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const t = useTranslations('customerGroup');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage] = useState(10);

    const loadCustomerGroups = async (keyword = "", page = currentPage) => {
        setLoading(true);

        try {
            const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/customer-groups/pagination-with-search?page=${page}&pageSize=${itemsPerPage}&keyword=${keyword}`;
            const res = await fetch(url);
            if (!res.ok) throw new Error("Failed to fetch customer groups");
            const data = await res.json();

            setCustomerGroups(data.data || []);
            setTotalItems(data.total || 0);
            setTotalPages(Math.ceil((data.total || 0) / itemsPerPage));
        } catch (err) {
            console.error('Fetch error:', err);
            setError("ไม่สามารถโหลดข้อมูลได้");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCustomerGroups(keyword, currentPage);
    }, [currentPage, keyword]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setKeyword(input);
        setCurrentPage(1);
        loadCustomerGroups(input, 1);
    };

    const handleReset = () => {
        setInput("");
        setKeyword("");
        setCurrentPage(1);
        loadCustomerGroups("", 1);
        setSelectedGroup(null);
        setIsCreateFormVisible(false);
    };

    const handleCreateCustomerGroup = () => {
        setIsCreateFormVisible(true);
        setSelectedGroup(null);
    };

    const handleCreateSuccess = () => {
        setIsCreating(false);
        setIsCreateFormVisible(false);
        setCurrentPage(1);
        loadCustomerGroups(keyword, 1);
    };

    const handleCreateStart = () => {
        setIsCreating(true);
    };

    const handleCreateError = () => {
        setIsCreating(false);
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

    const getVisiblePages = () => {
        const pages = [];
        const start = Math.max(1, currentPage - 1);
        const end = Math.min(totalPages, currentPage + 1);

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        return pages;
    };

    return (
        <>
            <SiteHeader headerTopic="จัดการกลุ่มลูกค้า" />
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">

                        {error && <p className="text-red-500">{error}</p>}

                        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
                            <div className="relative flex-1">
                                <Input
                                    placeholder="ค้นหารหัสกลุ่ม, ชื่อ, หรือระดับ"
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
                        ) : customerGroups.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead></TableHead>
                                        <TableHead>#</TableHead>

                                        <TableHead>ชื่อไทย</TableHead>
                                        <TableHead>ชื่ออังกฤษ</TableHead>
                                        <TableHead>ระดับ 1</TableHead>
                                        <TableHead>ระดับ 2</TableHead>
                                        <TableHead>สถานะ</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {customerGroups.map((group, index) => (
                                        <TableRow key={uuidv4()}>
                                            <TableCell className="w-10">
                                                <label className="flex items-center space-x-2 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="selectedGroup"
                                                        value={group.id}
                                                        checked={selectedGroup?.id === group.id}
                                                        onChange={() => {
                                                            setSelectedGroup(group);
                                                            setIsCreateFormVisible(false);
                                                        }}
                                                    />
                                                </label>
                                            </TableCell>
                                            <TableCell>{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                                            <TableCell>
                                                <div className="max-w-40 truncate" title={group.name_th}>
                                                    {group.name_th}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="max-w-40 truncate" title={group.name_en}>
                                                    {group.name_en}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="max-w-40 truncate" title={group.level1}>
                                                    {group.level1}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="max-w-40 truncate" title={group.level2}>
                                                    {group.level2}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className={`px-2 py-1 rounded-full text-xs ${group.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {group.status ? 'ใช้งาน' : 'ไม่ใช้งาน'}
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
                                    แสดง {(currentPage - 1) * itemsPerPage + 1} ถึง {Math.min(currentPage * itemsPerPage, totalItems)} จาก {totalItems} รายการ
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
                            onClick={handleCreateCustomerGroup}
                            variant="outline"
                            size="icon"
                            className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                            title="เพิ่มกลุ่มลูกค้าใหม่"
                        >
                            <IconPlus className="w-4 h-4" />
                        </Button>

                        {selectedGroup && !isCreateFormVisible && (
                            <CustomerGroupDetail
                                customerGroup={selectedGroup}
                                refresh={() => loadCustomerGroups(keyword, currentPage)}
                                onClose={() => setSelectedGroup(null)}
                            />
                        )}

                        {isCreateFormVisible && !selectedGroup && (
                            <CreateCustomerGroupForm
                                isVisible={true}
                                onClose={() => setIsCreateFormVisible(false)}
                                onSuccess={handleCreateSuccess}
                                onStart={handleCreateStart}
                                onError={handleCreateError}
                            />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
