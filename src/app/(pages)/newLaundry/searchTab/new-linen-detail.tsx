"use client";

import { useState, useEffect } from "react";
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
    const [details, setDetails] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!newLinenId) {
            setDetails([]);
            return;
        }

        const fetchDetails = async () => {
            setLoading(true);
            try {
                const res = await fetch(
                    `http://localhost:3000/new-linen-details?new_linen_id=${newLinenId}`
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
                Details for Dirty ID: {newLinenId}
            </h3>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Item ID</TableHead>
                        <TableHead>Qty</TableHead>
                        <TableHead>Weight</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center">
                                Loading...
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
                                No detail data.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
