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
import ShowDirtyDetail from "./show-dirty-detail";

export default function Tab1() {
    const t = useTranslations("DirtyLinen");
    const [keyword, setKeyword] = useState("");
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedDirty, setSelectedDirty] = useState<any | null>(null);

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    const fetchData = async (searchKeyword = "") => {
        setLoading(true);
        try {
            const res = await fetch(
                `${baseUrl}/dirties?page=1&limit=20&keyword=${searchKeyword}`
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

    const handleViewDetails = (item: any) => {
        setSelectedDirty(item);
    };


    return (
        <Card>
            <CardHeader>
                <CardTitle>{t("tab1")}</CardTitle>
                <CardDescription>{t('contentsTab1.cardDescription')}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Search Form */}
                <div className="flex items-end gap-4">
                    <div className="flex-1">
                        <Label htmlFor="keyword" className="my-1">{t('contentsTab1.Keyword')}</Label>
                        <Input
                            id="keyword"
                            placeholder="Enter doc no or keyword..."
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                    </div>
                    <Button onClick={handleSearch}>Search</Button>
                </div>

                {/* Data Table */}
                <div className="border rounded-lg mt-4">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Document No</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center">
                                        Loading...
                                    </TableCell>
                                </TableRow>
                            ) : data.length > 0 ? (
                                data.map((item: any) => (
                                    <TableRow key={item.id}>
                                        <TableCell>{item.id}</TableCell>
                                        <TableCell>{item.dirty_doc_no}</TableCell>
                                        <TableCell>{item.status ? "✅ Active" : "❌ Inactive"}</TableCell>
                                        <TableCell>{new Date(item.create_at).toLocaleString()}</TableCell>
                                        <TableCell>
                                            <Button
                                                size="sm"
                                                className={selectedDirty?.id === item.id ? "bg-green-600 text-white" : ""}
                                                onClick={() => handleViewDetails(item)}
                                            >
                                                View Details
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center text-muted-foreground"> No data found.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>


                {selectedDirty && <ShowDirtyDetail dirty={selectedDirty} />}

            </CardContent>
        </Card>
    );
}
