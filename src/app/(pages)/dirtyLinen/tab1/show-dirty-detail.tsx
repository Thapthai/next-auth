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
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";


interface ShowDirtyDetailProps {
    dirty: any | null;
}

export default function ShowDirtyDetail({ dirty }: ShowDirtyDetailProps) {
    const [details, setDetails] = useState<any[]>([]);
    const [expandedRows, setExpandedRows] = useState<Record<number, any[]>>({});
    const [loadingRounds, setLoadingRounds] = useState<number | null>(null);
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;


    useEffect(() => {
        if (!dirty) {
            setDetails([]);
            return;
        }

        const fetchDetails = async () => {
            try {
                const res = await fetch(`${baseUrl}/dirty-details?dirty_id=${dirty.id}`);
                const data = await res.json();
                setDetails(data);
            } catch (error) {
                console.error("Fetch error:", error);
                setDetails([]);
            }
        };

        fetchDetails();
    }, [dirty]);

    const toggleRow = async (detailId: number) => {
        if (expandedRows[detailId]) {
            // collapse
            setExpandedRows((prev) => {
                const updated = { ...prev };
                delete updated[detailId];
                return updated;
            });
        } else {
            setLoadingRounds(detailId);
            try {
                const res = await fetch(`${baseUrl}/dirty-detail-rounds?dirty_detail_id=${detailId}`);
                const rounds = await res.json();
                setExpandedRows((prev) => ({ ...prev, [detailId]: rounds }));
            } catch (error) {
                console.error("Error loading rounds:", error);
            } finally {
                setLoadingRounds(null);
            }
        }
    };

    if (!dirty) return null;

    return (
        <div className="border rounded-lg mt-6">
            <h3 className="text-lg font-semibold px-4 py-2">
                รายการสำหรับ Dirty Doc No: {dirty.dirty_doc_no}
            </h3>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Department ID</TableHead>
                        <TableHead>Item ID</TableHead>
                        <TableHead>Detail ID</TableHead>
                        <TableHead>Qty</TableHead>
                        <TableHead>Weight</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {details.length > 0 ? (
                        details.map((d) => (
                            <React.Fragment key={d.id}>
                                <TableRow>
                                    <TableCell>{d.department_id}</TableCell>
                                    <TableCell>{d.item_id} {d.unregistered_item?.name}</TableCell>
                                    <TableCell>{d.id}</TableCell>
                                    <TableCell>{d.qty}</TableCell>
                                    <TableCell>{d.weight}</TableCell>
                                    <TableCell>{d.status ? "✅" : "❌"}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => toggleRow(d.id)}
                                            disabled={loadingRounds === d.id}
                                        >

                                            {expandedRows[d.id] ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                                        </Button>
                                    </TableCell>
                                </TableRow>

                                {expandedRows[d.id]?.map((r) => (
                                    <TableRow key={r.id} className="bg-muted text-sm">
                                        <TableCell />
                                        <TableCell />
                                        <TableCell>↳ {r.id}</TableCell>
                                        <TableCell>{r.qty}</TableCell>
                                        <TableCell>{r.weight}</TableCell>
                                        <TableCell>{r.status ? "✅" : "❌"}</TableCell>
                                        <TableCell />
                                    </TableRow>
                                ))}

                            </React.Fragment>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center text-muted-foreground">
                                ไม่มีข้อมูล
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
