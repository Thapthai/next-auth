'use client';

import { useEffect, useState } from "react";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconCaretRightFilled, IconReload, IconSearch } from "@tabler/icons-react";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SaleOffice } from "@/types/saleOffice";
import { v4 as uuidv4 } from 'uuid';
import SaleOfficeDetail from "./SaleOfficeDetail";
import { useRouter, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function SaleOfficePage() {
    const [saleOffices, setSaleOffices] = useState<SaleOffice[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [selectedOffice, setSelectedOffice] = useState<SaleOffice | null>(null);
    const [keyword, setKeyword] = useState("");
    const [input, setInput] = useState("");
    const [loadingId, setLoadingId] = useState<number | null>(null);
    const router = useRouter();
    const pathname = usePathname();

    // Reset loading state when pathname changes (navigation completes)
    useEffect(() => {
        if (loadingId) {
            setLoadingId(null);
        }
    }, [pathname]);

    // Load sale offices on component mount
    useEffect(() => {
        loadSaleOffices();
    }, []);

    const loadSaleOffices = async (keyword = "") => {
        try {
            const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/sale-offices?keyword=${keyword}`;
            console.log('Fetching URL:', url);
            const res = await fetch(url);
            console.log('Response status:', res.status);
            if (!res.ok) throw new Error("Failed to fetch sale offices");
            const data = await res.json();
            console.log('Response data:', data);
            setSaleOffices(data.items || data); // กรณีมี pagination
        } catch (err) {
            console.error('Fetch error:', err);
            setError("ไม่สามารถโหลดข้อมูลได้");
        }
    };

    useEffect(() => {
        loadSaleOffices();
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setKeyword(input);
        loadSaleOffices(input);
    };

    const handleReset = () => {
        setInput("");
        setKeyword("");
        loadSaleOffices();
    };

    const handleGoToDepartment = (id: number) => {
        setLoadingId(id);
        router.push(`/management/saleoffice/${id}/departments`);
    };

    return (
        <>
            <SiteHeader headerTopic="รายการสาขา (Sale Offices)" />
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">

                        {error && <p className="text-red-500">{error}</p>}

                        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
                            <Input
                                placeholder="ค้นหา site code หรือชื่อ"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                            />
                            <Button type="button" variant="outline" onClick={handleReset}>
                                <IconReload />
                            </Button>
                            <Button type="submit">
                                <IconSearch />
                            </Button>

                        </form>

                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead></TableHead>
                                    <TableHead>Site Code</TableHead>
                                    <TableHead>ชื่อไทย</TableHead>
                                    <TableHead>ชื่ออังกฤษ</TableHead>
                                    <TableHead></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {saleOffices.map((office) => {
                                    const isItemLoading = loadingId === office.id;
                                    
                                    return (
                                        <TableRow key={uuidv4()}>
                                            <TableCell className="w-10">
                                                <label className="flex items-center space-x-2 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="selectedOffice"
                                                        value={office.id}
                                                        checked={selectedOffice?.id === office.id}
                                                        onChange={() => setSelectedOffice(office)}
                                                        disabled={isItemLoading}
                                                    />
                                                </label>
                                            </TableCell>
                                            <TableCell>{office.site_code}</TableCell>
                                            <TableCell>{office.site_office_name_th}</TableCell>
                                            <TableCell>{office.site_office_name_en}</TableCell>
                                            <TableCell className="w-10">
                                                <Button
                                                    variant="ghost"
                                                    disabled={isItemLoading}
                                                    onClick={() => handleGoToDepartment(office.id)}
                                                    className={`transition-all duration-200 ${
                                                        isItemLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
                                                    }`}
                                                >
                                                    {isItemLoading ? (
                                                        <div className="flex items-center gap-2">
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                            <span className="text-xs">กำลังโหลด...</span>
                                                        </div>
                                                    ) : (
                                                        <IconCaretRightFilled />
                                                    )}
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>

                        <SaleOfficeDetail saleOffice={selectedOffice} refresh={() => loadSaleOffices(keyword)} />
                    </div>
                </div>
            </div>
        </>
    );
}
