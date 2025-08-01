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
import { Item } from "@/types/item";
import { Material } from "@/types/material";
import { Input } from "@/components/ui/input";
import ItemDetail from "./ItemDetail";
import CreateItemForm from "./CreateItemForm";


export default function ItemsPage() {
    const t = useTranslations("Items");

    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [isCreateFormVisible, setIsCreateFormVisible] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [keyword, setKeyword] = useState("");
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage] = useState(5); // แสดง 5 รายการต่อหน้า
    const [input, setInput] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [materialData, setMaterialData] = useState<Material[]>([]);
    const [saleOfficeData, setSaleOfficeData] = useState<any[]>([]);
    const [departmentData, setDepartmentData] = useState<any[]>([]);
    const [itemCategoryData, setItemCategoryData] = useState<any[]>([]);
    const [loadingOptions, setLoadingOptions] = useState(false);

    const fetchItems = async (keyword = "", page = currentPage) => {
        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/items/item-pagination-with-search?page=${page}&pageSize=${itemsPerPage}&search=${keyword}`);
            if (!res.ok) throw new Error("Failed to fetch items");
            const data = await res.json();
            setItems(data.data || []);
            setTotalItems(data.total || 0);
            setTotalPages(Math.ceil((data.total || 0) / itemsPerPage));
        } catch (err) {
            console.error(err);
            setError(t("fetchError"));
        } finally {
            setLoading(false);
        }
    };

    // Fetch related data for dropdowns
    const fetchOptions = async () => {
        setLoadingOptions(true);
        try {
            const [materialsRes, saleOfficesRes, departmentsRes, itemCategoriesRes] = await Promise.all([
                fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/materials`),
                fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sale-offices`),
                fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/departments`),
                fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/item-categories`)
            ]);

            if (materialsRes.ok) {
                const materialsData = await materialsRes.json();
                setMaterialData(materialsData.data || []);
            }

            if (saleOfficesRes.ok) {
                const saleOfficesData = await saleOfficesRes.json();
                setSaleOfficeData(saleOfficesData.data || []);
            }

            if (departmentsRes.ok) {
                const departmentsData = await departmentsRes.json();
                setDepartmentData(departmentsData.data || []);
            }

            if (itemCategoriesRes.ok) {
                const itemCategoriesData = await itemCategoriesRes.json();
                setItemCategoryData(itemCategoriesData.data || []);
            }
        } catch (err) {
            console.error('Failed to fetch options:', err);
        } finally {
            setLoadingOptions(false);
        }
    };

    useEffect(() => {
        fetchItems(keyword, currentPage);
        fetchOptions();
    }, [currentPage]);


    const handleCreateItem = () => {
        setIsCreateFormVisible(true);
        setSelectedItem(null); // ปิดฟอร์ม detail
    };

    const handleReset = () => {
        setInput('');
        setCurrentPage(1);
        setKeyword('');
        fetchItems();
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1);
        setKeyword(input);
        fetchItems(input, 1);
    };

    const handlePageChange = (page: number): void => {
        setCurrentPage(page);
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

    return (

        <div>
            <SiteHeader headerTopic={t('headerTopic')} />

            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">

                        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
                            <Input
                                placeholder={t('search')}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                            />

                            <Button type="button" variant="outline" onClick={handleReset}>
                                <IconReload />
                            </Button>
                            <Button type="submit">
                                <IconSearch />
                                {t('search')}
                            </Button>
                            <Button
                                type="button"
                                onClick={handleCreateItem}
                                variant="outline"
                                size="icon"
                                className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                                title={t('createNewItem')}
                            >
                                <IconPlus className="w-4 h-4" />
                            </Button>
                        </form>

                        {error && <p className="text-red-500">{error}</p>}

                        {loading ? (
                            <p>{t('loading')}</p>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead></TableHead>
                                        <TableHead>#</TableHead>
                                        <TableHead>{t('nameThai')}</TableHead>
                                        <TableHead>{t('nameEnglish')}</TableHead>
                                        <TableHead>{t('status')}</TableHead>
                                        <TableHead>{t('createdAt')}</TableHead>
                                        <TableHead>{t('updatedAt')}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {items.map((item, index) => (
                                        <TableRow key={item.id}>
                                            <TableCell className="w-10">
                                                <label className="flex items-center space-x-2 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="selectedItem"
                                                        value={item.id}
                                                        checked={selectedItem?.id === item.id}
                                                        onChange={() => {
                                                            setSelectedItem(item);
                                                            setIsCreateFormVisible(false);
                                                        }}
                                                    />
                                                </label>
                                            </TableCell>
                                            <TableCell>{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                                            <TableCell>{item.name_th}</TableCell>
                                            <TableCell>{item.name_en}</TableCell>
                                            <TableCell>
                                                <span className={`px-2 py-1 rounded-full text-xs ${item.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {item.status ? t('active') : t('inactive')}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                {item.create_at ? new Date(item.create_at).toLocaleDateString('th-TH') : '-'}
                                            </TableCell>
                                            <TableCell>
                                                {item.update_at ? new Date(item.update_at).toLocaleDateString('th-TH') : '-'}
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
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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

                        {selectedItem && !isCreateFormVisible && (
                            <ItemDetail 
                                item={selectedItem} 
                                isVisible={true}
                                materialData={materialData}
                                saleOfficeData={saleOfficeData}
                                departmentData={departmentData}
                                itemCategoryData={itemCategoryData}
                                onClose={() => setSelectedItem(null)}
                                onSuccess={() => {
                                    setSelectedItem(null);
                                    fetchItems(keyword, currentPage);
                                }}
                                onError={() => {
                                    console.error('Error updating item');
                                }}
                            />
                        )}

                        {isCreateFormVisible && !selectedItem && (
                            <CreateItemForm
                                isVisible={true}
                                materialData={materialData}
                                saleOfficeData={saleOfficeData}
                                departmentData={departmentData}
                                itemCategoryData={itemCategoryData}
                                onClose={() => setIsCreateFormVisible(false)}
                                onSuccess={() => {
                                    setIsCreating(false);
                                    setIsCreateFormVisible(false);
                                    fetchItems(keyword, currentPage);
                                }}
                                onStart={() => setIsCreating(true)}
                                onError={() => setIsCreating(false)}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>

    );
}
