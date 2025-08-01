'use client';

import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { IconPlus, IconReload, IconSearch, IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { Material } from "@/types/material";
import { MaterialType } from "@/types/materialType";
import { SapSale } from "@/types/sapSale";
import { Input } from "@/components/ui/input";
import MaterialDetail from "./MaterialDetail";
import CreateMaterialForm from "./CreateMaterialForm";

export default function MaterialsPage() {
    const t = useTranslations("Materials");
    const [materials, setMaterials] = useState<Material[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
    const [isCreateFormVisible, setIsCreateFormVisible] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage] = useState(10);
    const [input, setInput] = useState('');
    const [materialTypes, setMaterialTypes] = useState<MaterialType[]>([]);
    const [sapSales, setSapSales] = useState<SapSale[]>([]);
    const [loadingOptions, setLoadingOptions] = useState(false);

    const fetchMaterials = async (search = "", page = currentPage) => {
        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/materials/pagination-with-search?page=${page}&pageSize=${itemsPerPage}&search=${search}`);
            if (!res.ok) throw new Error("Failed to fetch materials");
            const data = await res.json();
            setMaterials(data.data || []);
            setTotalItems(data.total || 0);
            setTotalPages(Math.ceil((data.total || 0) / itemsPerPage));
        } catch (err) {
            console.error(err);
            setError(t("fetchError"));
        } finally {
            setLoading(false);
        }
    };

    // Fetch material types and SAP sales for dropdowns
    const fetchOptions = async () => {
        setLoadingOptions(true);
        try {
            const [materialTypesRes, sapSalesRes] = await Promise.all([
                fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/material-types`),
                fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sap-sale`)
            ]);

            if (materialTypesRes.ok) {
                const materialTypesData = await materialTypesRes.json();
                setMaterialTypes(materialTypesData.data || []);
            }

            if (sapSalesRes.ok) {
                const sapSalesData = await sapSalesRes.json();
                setSapSales(sapSalesData.data || []);
            }
        } catch (err) {
            console.error('Failed to fetch options:', err);
        } finally {
            setLoadingOptions(false);
        }
    };

    useEffect(() => {
        fetchMaterials(search, currentPage);
        fetchOptions();
    }, [currentPage]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1);
        setSearch(input);
        fetchMaterials(input, 1);
    };

    const handleReset = () => {
        setInput('');
        setCurrentPage(1);
        setSearch('');
        fetchMaterials();
    };

    const handlePreviousPage = () => {
        setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        setCurrentPage(currentPage + 1);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div>
            <SiteHeader headerTopic={t('headerTopic')} />
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
                        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
                            <Input placeholder={t('search')} value={input} onChange={(e) => setInput(e.target.value)} />
                            <Button type="button" variant="outline" onClick={handleReset}><IconReload /></Button>
                            <Button type="submit"><IconSearch />{t('search')}</Button>
                            <Button type="button" onClick={() => setIsCreateFormVisible(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
                                <IconPlus className="w-4 h-4" />
                            </Button>
                        </form>

                        {loading ? (
                            <p>{t('loading')}</p>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead></TableHead>
                                        <TableHead>#</TableHead>
                                        <TableHead>{t('materialCode')}</TableHead>
                                        <TableHead>{t('longMeterialName')}</TableHead>
                                        <TableHead>{t('materialType')}</TableHead>
                                        <TableHead>{t('status')}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {materials.map((material, index) => (
                                        <TableRow key={material.id}>
                                            <TableCell className="w-10">
                                                <input
                                                    type="radio"
                                                    name="selectedMaterial"
                                                    checked={selectedMaterial?.id === material.id}
                                                    onChange={() => {
                                                        setSelectedMaterial(material);
                                                        setIsCreateFormVisible(false);
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell>{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                                            <TableCell className="font-mono">{material.material_code}</TableCell>
                                            <TableCell>{material.material_name_th}</TableCell>
                                            <TableCell>{material.material_name_en}</TableCell>
                                            <TableCell>{material.material_types?.description || '-'}</TableCell>
                                            <TableCell>
                                                <span className={`px-2 py-1 rounded-full text-xs ${material.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {material.status ? t('active') : t('inactive')}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                        {/* Pagination */}
                        {!loading && !error && totalPages > 1 && (
                            <div className="flex items-center justify-between mt-4">
                                <div className="text-sm text-gray-500">
                                    {t('show')} {(currentPage - 1) * itemsPerPage + 1} {t('to')} {Math.min(currentPage * itemsPerPage, totalItems)} {t('of')} {totalItems} {t('items')}
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handlePreviousPage}
                                        disabled={currentPage === 1}
                                    >
                                        <IconChevronLeft className="w-4 h-4" />
                                        {t('previous')}
                                    </Button>

                                    <div className="flex items-center space-x-1">
                                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                            let page;
                                            if (totalPages <= 5) {
                                                page = i + 1;
                                            } else if (currentPage <= 3) {
                                                page = i + 1;
                                            } else if (currentPage >= totalPages - 2) {
                                                page = totalPages - 4 + i;
                                            } else {
                                                page = currentPage - 2 + i;
                                            }

                                            return (
                                                <Button
                                                    key={page}
                                                    variant={currentPage === page ? "default" : "outline"}
                                                    size="sm"
                                                    onClick={() => handlePageChange(page)}
                                                    className="w-8 h-8 p-0"
                                                >
                                                    {page}
                                                </Button>
                                            );
                                        })}
                                    </div>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleNextPage}
                                        disabled={currentPage === totalPages}
                                    >
                                        {t('next')}
                                        <IconChevronRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        )}


                        {selectedMaterial && !isCreateFormVisible && (
                            <MaterialDetail
                                material={selectedMaterial}
                                isVisible={true}
                                materialTypeData={materialTypes}
                                sapSaleData={sapSales}
                                onClose={() => setSelectedMaterial(null)}
                                onSuccess={() => {
                                    setSelectedMaterial(null);
                                    fetchMaterials(search, currentPage);
                                }}
                                onError={() => {
                                    console.error('Error updating material');
                                }}
                            />
                        )}

                        {isCreateFormVisible && (
                            <CreateMaterialForm
                                isVisible={true}
                                onClose={() => setIsCreateFormVisible(false)}
                                onSuccess={() => {
                                    setIsCreateFormVisible(false);
                                    fetchMaterials(search, currentPage);
                                }}
                                onStart={() => {
                                    console.log('Creating material...');
                                }}
                                onError={() => {
                                    console.error('Error creating material');
                                }}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}