'use client';

import { useEffect, useState } from "react";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconReload, IconSearch, IconPlus, IconChevronRight, IconChevronLeft, IconChevronRightPipe, IconChevronLeftPipe } from "@tabler/icons-react";
import { SiteHeader } from "@/components/site-header";
import { Customer } from "@/types/customer";
import { v4 as uuidv4 } from 'uuid';
import { useTranslations } from "next-intl";
import CustomerDetail from "./CustomerDetail";
import CreateCustomerForm from "./CreateCustomerForm";

export default function CustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [keyword, setKeyword] = useState("");
    const [input, setInput] = useState("");
    const [isCreateFormVisible, setIsCreateFormVisible] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const t = useTranslations('customer');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage] = useState(5);

    const loadCustomers = async (keyword = "", page = currentPage) => {
        setLoading(true);

        try {
            const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/customers/pagination-with-search?page=${page}&pageSize=${itemsPerPage}&keyword=${keyword}`;
            const res = await fetch(url);
            if (!res.ok) throw new Error("Failed to fetch customers");
            const data = await res.json();

            setCustomers(data.data || []);
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
        loadCustomers(keyword, currentPage);
    }, [currentPage, keyword]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setKeyword(input);
        setCurrentPage(1);
        loadCustomers(input, 1);
    };

    const handleReset = () => {
        setInput("");
        setKeyword("");
        setCurrentPage(1);
        loadCustomers("", 1);
        setSelectedCustomer(null);
        setIsCreateFormVisible(false);
    };

    const handleCreateCustomer = () => {
        setIsCreateFormVisible(true);
        setSelectedCustomer(null);
    };

    const handleCreateSuccess = () => {
        setIsCreating(false);
        setIsCreateFormVisible(false);
        setCurrentPage(1);
        loadCustomers(keyword, 1);
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
            <SiteHeader headerTopic="จัดการลูกค้า" />
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">

                        {error && <p className="text-red-500">{error}</p>}

                        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
                            <div className="relative flex-1">
                                <Input
                                    placeholder="ค้นหาชื่อ, อีเมล, เบอร์โทร, หรือรหัสลูกค้า"
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
                        ) : customers.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead></TableHead>
                                        <TableHead>#</TableHead>
                                        <TableHead>รหัสไซต์</TableHead>
                                        <TableHead>ชื่อไทย</TableHead>
                                        <TableHead>ชื่ออังกฤษ</TableHead>
                                        <TableHead>อีเมล</TableHead>
                                        <TableHead>เบอร์โทร</TableHead>
                                        <TableHead>ที่อยู่</TableHead>
                                        <TableHead>สถานะ</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {customers.map((customer, index) => (
                                        <TableRow key={uuidv4()}>
                                            <TableCell className="w-10">
                                                <label className="flex items-center space-x-2 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="selectedCustomer"
                                                        value={customer.id}
                                                        checked={selectedCustomer?.id === customer.id}
                                                        onChange={() => {
                                                            setSelectedCustomer(customer);
                                                            setIsCreateFormVisible(false);
                                                        }}
                                                    />
                                                </label>
                                            </TableCell>
                                            <TableCell>{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                                            <TableCell>{customer.site_short_code}</TableCell>
                                            <TableCell>
                                                <div className="max-w-40 truncate" title={customer.name_th}>
                                                    {customer.name_th}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="max-w-40 truncate" title={customer.name_en}>
                                                    {customer.name_en}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="max-w-40 truncate" title={customer.email}>
                                                    {customer.email}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="max-w-40 truncate" title={customer.tel}>
                                                    {customer.tel}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="max-w-60 truncate" title={customer.address}>
                                                    {customer.address}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className={`px-2 py-1 rounded-full text-xs ${customer.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {customer.status ? 'ใช้งาน' : 'ไม่ใช้งาน'}
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
                            onClick={handleCreateCustomer}
                            variant="outline"
                            size="icon"
                            className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                            title="เพิ่มลูกค้าใหม่"
                        >
                            <IconPlus className="w-4 h-4" />
                        </Button>

                        {selectedCustomer && !isCreateFormVisible && (
                            <CustomerDetail
                                customer={selectedCustomer}
                                refresh={() => loadCustomers(keyword, currentPage)}
                                onClose={() => setSelectedCustomer(null)}
                            />
                        )}

                        {isCreateFormVisible && !selectedCustomer && (
                            <CreateCustomerForm
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
