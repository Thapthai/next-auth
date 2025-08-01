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
import { ItemCategory } from "@/types/itemCategory";
import { Input } from "@/components/ui/input";
import ItemCategoryDetail from "./ItemCategoryDetail";
import CreateItemCategoryForm from "./CreateItemCategoryForm";

export default function ItemCategoriesPage() {
    const t = useTranslations("ItemCategories");

    const [itemCategories, setItemCategories] = useState<ItemCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedItemCategory, setSelectedItemCategory] = useState<ItemCategory | null>(null);
    const [isCreateFormVisible, setIsCreateFormVisible] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [keyword, setKeyword] = useState("");
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage] = useState(5); // แสดง 5 รายการต่อหน้า
    const [input, setInput] = useState("");
    const [isCreating, setIsCreating] = useState(false);

    // Fetch related data for dropdowns
    const [saleOfficeData, setSaleOfficeData] = useState<any[]>([]);
    const [departmentData, setDepartmentData] = useState<any[]>([]);
    const [materialData, setMaterialData] = useState<any[]>([]);

    const fetchItemCategories = async (keyword = "", page = currentPage) => {
        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/item-categories/pagination-with-search?page=${page}&pageSize=${itemsPerPage}&search=${keyword}`);
            if (!res.ok) throw new Error("Failed to fetch item categories");
            const data = await res.json();
            setItemCategories(data.data || []);
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
        try {
            const [saleOfficesRes, departmentsRes, materialsRes] = await Promise.all([
                fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sale-offices`),
                fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/departments`),
                fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/materials`)
            ]);

            if (saleOfficesRes.ok) {
                const saleOfficesData = await saleOfficesRes.json();
                setSaleOfficeData(saleOfficesData.data || []);
            }

            if (departmentsRes.ok) {
                const departmentsData = await departmentsRes.json();
                setDepartmentData(departmentsData.data || []);
            }

            if (materialsRes.ok) {
                const materialsData = await materialsRes.json();
                setMaterialData(materialsData.data || []);
            }
        } catch (err) {
            console.error('Failed to fetch options:', err);
        }
    };

    useEffect(() => {
        fetchItemCategories(keyword, currentPage);
        fetchOptions();
    }, [currentPage]);

    const handleCreateItemCategory = () => {
        setIsCreateFormVisible(true);
        setSelectedItemCategory(null); // ปิดฟอร์ม detail
    };

    const handleReset = () => {
        setInput('');
        setCurrentPage(1);
        setKeyword('');
        fetchItemCategories();
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1);
        setKeyword(input);
        fetchItemCategories(input, 1);
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
                                onClick={handleCreateItemCategory}
                                variant="outline"
                                size="icon"
                                className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                                title={t('createNewItemCategory')}
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
                                        <TableHead>{t('description')}</TableHead>
                                        <TableHead>{t('saleOffice')}</TableHead>
                                        <TableHead>{t('department')}</TableHead>
                                        <TableHead>{t('status')}</TableHead>
                                        <TableHead>{t('createdAt')}</TableHead>
                                        <TableHead>{t('updatedAt')}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {itemCategories.map((category, index) => (
                                        <TableRow key={category.id}>
                                            <TableCell className="w-10">
                                                <label className="flex items-center space-x-2 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="selectedItemCategory"
                                                        value={category.id}
                                                        checked={selectedItemCategory?.id === category.id}
                                                        onChange={() => {
                                                            setSelectedItemCategory(category);
                                                            setIsCreateFormVisible(false);
                                                        }}
                                                    />
                                                </label>
                                            </TableCell>
                                            <TableCell>{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                                            <TableCell>{category.name_th || '-'}</TableCell>
                                            <TableCell>{category.name_en || '-'}</TableCell>
                                            <TableCell>{category.description || '-'}</TableCell>
                                            <TableCell>{category.sale_office?.site_office_name_th || '-'}</TableCell>
                                            <TableCell>{category.department?.name_th || '-'}</TableCell>
                                            <TableCell>
                                                <span className={`px-2 py-1 rounded-full text-xs ${category.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {category.status ? t('active') : t('inactive')}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                {category.create_at ? new Date(category.create_at).toLocaleDateString('th-TH') : '-'}
                                            </TableCell>
                                            <TableCell>
                                                {category.update_at ? new Date(category.update_at).toLocaleDateString('th-TH') : '-'}
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

                        {selectedItemCategory && !isCreateFormVisible && (
                            <ItemCategoryDetail
                                itemCategory={selectedItemCategory}
                                isVisible={true}
                                saleOfficeData={saleOfficeData}
                                departmentData={departmentData}
                                materialData={materialData}
                                onClose={() => setSelectedItemCategory(null)}
                                onSuccess={() => {
                                    setSelectedItemCategory(null);
                                    fetchItemCategories(keyword, currentPage);
                                }}
                                onError={() => {
                                    console.error('Error updating item category');
                                }}
                            />
                        )}

                        {isCreateFormVisible && !selectedItemCategory && (
                            <CreateItemCategoryForm
                                isVisible={true}
                                saleOfficeData={saleOfficeData}
                                departmentData={departmentData}
                                materialData={materialData}
                                onClose={() => setIsCreateFormVisible(false)}
                                onSuccess={() => {
                                    setIsCreating(false);
                                    setIsCreateFormVisible(false);
                                    fetchItemCategories(keyword, currentPage);
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