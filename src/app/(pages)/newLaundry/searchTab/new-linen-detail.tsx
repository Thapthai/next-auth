"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";

interface ShowNewLinenDetailProps {
    newLinenId: number | null;
}

export default function ShowNewlinenDetail({ newLinenId }: ShowNewLinenDetailProps) {
    const t = useTranslations("newLaundry");
    const [details, setDetails] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    useEffect(() => {
        if (!newLinenId) {
            setDetails([]);
            return;
        }

        const fetchDetails = async () => {
            setLoading(true);
            try {
                const res = await fetch(
                    `${baseUrl}/new-linen-details?new_linen_id=${newLinenId}`
                );
                const data = await res.json();
                setDetails(data);
            } catch (error) {
                console.error("Fetch dirty details error:", error);
                setDetails([]);
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [newLinenId]);

    if (!newLinenId) {
        return null;
    }

    return (
        <div className="border rounded-lg mt-6">
            <h3 className="text-lg font-semibold px-4 py-2">
                {t('detail.title')}: {newLinenId}
            </h3>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>{t('detail.id')}</TableHead>
                        <TableHead>{t('detail.itemId')}</TableHead>
                        <TableHead>{t('detail.qty')}</TableHead>
                        <TableHead>{t('detail.weight')}</TableHead>
                        <TableHead>{t('detail.status')}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center">
                                {t('detail.loading')}
                            </TableCell>
                        </TableRow>
                    ) : details.length > 0 ? (
                        details.map((d) => (
                            <TableRow key={d.id}>
                                <TableCell>{d.id}</TableCell>
                                <TableCell>{d.item_id}</TableCell>
                                <TableCell>{d.qty}</TableCell>
                                <TableCell>{d.weight}</TableCell>
                                <TableCell>{d.status ? "✅" : "❌"}</TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center text-muted-foreground">
                                {t('detail.noData')}
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
