"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";
import ShowNewlinenDetail from "./new-linen-detail";

export default function SearchTab() {
    const t = useTranslations("newLaundry");

    const [keyword, setKeyword] = useState("");
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedNewLinenId, setSelectedNewLinenId] = useState<number | null>(null);
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;


    const fetchData = async (searchKeyword = "") => {
        setLoading(true);
        try {
            const res = await fetch(
                `${baseUrl}/new-linens?page=1&limit=20&keyword=${searchKeyword}`
            );
            const result = await res.json();
            setData(result.data); // ดึง array จาก { data: [], total, ... }
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(); // โหลดรอบแรก
    }, []);

    const handleSearch = () => {
        fetchData(keyword);
    };

    const handleViewDetails = (id: number) => {
        setSelectedNewLinenId(id);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t("tab2")}</CardTitle>
                <CardDescription>{t('searchTab.cardDescription')}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Search Form */}
                <div className="flex items-end gap-4">
                    <div className="flex-1">
                        <Label htmlFor="keyword" className="my-1">{t('searchTab.keyword')}</Label>
                        <Input
                            id="keyword"
                            placeholder={t('searchTab.keywordPlaceholder')}
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                    </div>
                    <Button onClick={handleSearch}>{t('searchTab.search')}</Button>
                </div>

                {/* Data Table */}
                <div className="border rounded-lg mt-4">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t('searchTab.id')}</TableHead>
                                <TableHead>{t('searchTab.documentNo')}</TableHead>
                                <TableHead>{t('searchTab.status')}</TableHead>
                                <TableHead>{t('searchTab.createdAt')}</TableHead>
                                <TableHead>{t('searchTab.actions')}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center">
                                        {t('searchTab.loading')}
                                    </TableCell>
                                </TableRow>
                            ) : data.length > 0 ? (
                                data.map((item: any) => (
                                    <TableRow key={item.id}>
                                        <TableCell>{item.id}</TableCell>
                                        <TableCell>{item.dirty_doc_no}</TableCell>
                                        <TableCell>{item.status ? t('searchTab.active') : t('searchTab.inactive')}</TableCell>
                                        <TableCell>{new Date(item.create_at).toLocaleString()}</TableCell>
                                        <TableCell>
                                            <Button size="sm" onClick={() => handleViewDetails(item.id)}>
                                                {t('searchTab.viewDetails')}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                                        {t('searchTab.noData')}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>


                {selectedNewLinenId && <ShowNewlinenDetail newLinenId={selectedNewLinenId} />}
            </CardContent>
        </Card>
    );
}
