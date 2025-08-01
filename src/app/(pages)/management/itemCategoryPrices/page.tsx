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
import { ItemCategoryPrice } from "@/types/itemCategoryPrice";
import { Input } from "@/components/ui/input";
import ItemCategoryPriceDetail from "./ItemCategoryPriceDetail";
import CreateItemCategoryPriceForm from "./CreateItemCategoryPriceForm";


export default function ItemCategoryPricesPage() {
    const t = useTranslations("ItemCategoryPrices");

    const [itemCategoryPrices, setItemCategoryPrices] = useState<ItemCategoryPrice[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedItemCategoryPrice, setSelectedItemCategoryPrice] = useState<ItemCategoryPrice | null>(null);
    const [isCreateFormVisible, setIsCreateFormVisible] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [keyword, setKeyword] = useState("");
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage] = useState(5); // แสดง 5 รายการต่อหน้า
    const [input, setInput] = useState("");
    const [isCreating, setIsCreating] = useState(false);

    // Fetch related data for dropdowns
    const [itemCategoryData, setItemCategoryData] = useState<any[]>([]);

    const fetchItemCategoryPrices = async (keyword = "", page = currentPage) => {
        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/item-category-prices/pagination-with-search?page=${page}&pageSize=${itemsPerPage}&search=${keyword}`);
            if (!res.ok) throw new Error("Failed to fetch item category prices");
            const data = await res.json();
            setItemCategoryPrices(data.data || []);
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
            const itemCategoriesRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/item-categories`);

            if (itemCategoriesRes.ok) {
                const itemCategoriesData = await itemCategoriesRes.json();
                setItemCategoryData(itemCategoriesData.data || []);
            }
        } catch (err) {
            console.error('Failed to fetch options:', err);
        }
    };

    useEffect(() => {
        fetchItemCategoryPrices(keyword, currentPage);
        fetchOptions();
    }, [currentPage]);

    const handleCreateItemCategoryPrice = () => {
        setIsCreateFormVisible(true);
        setSelectedItemCategoryPrice(null); // ปิดฟอร์ม detail
    };

    const handleReset = () => {
        setInput('');
        setCurrentPage(1);
        setKeyword('');
        fetchItemCategoryPrices();
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1);
        setKeyword(input);
        fetchItemCategoryPrices(input, 1);
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
                                placeholder={t('searchPlaceholder')}
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
                                onClick={handleCreateItemCategoryPrice}
                                variant="outline"
                                size="icon"
                                className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                                title={t('createNewItemCategoryPrice')}
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
                                        <TableHead>{t('description')}</TableHead>
                                        <TableHead>{t('itemCategory')}</TableHead>
                                        <TableHead>{t('price')}</TableHead>
                                        <TableHead>{t('status')}</TableHead>
                                        <TableHead>{t('createdAt')}</TableHead>
                                        <TableHead>{t('updatedAt')}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {itemCategoryPrices.map((price, index) => (
                                        <TableRow key={price.id}>
                                            <TableCell className="w-10">
                                                <label className="flex items-center space-x-2 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="selectedItemCategoryPrice"
                                                        value={price.id}
                                                        checked={selectedItemCategoryPrice?.id === price.id}
                                                        onChange={() => {
                                                            setSelectedItemCategoryPrice(price);
                                                            setIsCreateFormVisible(false);
                                                        }}
                                                    />
                                                </label>
                                            </TableCell>
                                            <TableCell>{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                                            <TableCell>{price.description}</TableCell>
                                            <TableCell>{price.item_category?.name_th} - {price.item_category?.name_en}</TableCell>

                                            <TableCell className="text-left">
                                                {price.price ? `${price.price.toLocaleString()} ฿` : '-'}
                                            </TableCell>
                                            <TableCell>
                                                <span className={`px-2 py-1 rounded-full text-xs ${price.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {price.status ? t('active') : t('inactive')}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                {price.create_at ? new Date(price.create_at).toLocaleDateString('th-TH') : '-'}
                                            </TableCell>
                                            <TableCell>
                                                {price.update_at ? new Date(price.update_at).toLocaleDateString('th-TH') : '-'}
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

                        {selectedItemCategoryPrice && !isCreateFormVisible && (
                            <ItemCategoryPriceDetail 
                                itemCategoryPrice={selectedItemCategoryPrice} 
                                isVisible={true}
                                itemCategoryData={itemCategoryData}
                                onClose={() => setSelectedItemCategoryPrice(null)}
                                onSuccess={() => {
                                    setSelectedItemCategoryPrice(null);
                                    fetchItemCategoryPrices(keyword, currentPage);
                                }}
                                onError={() => {
                                    console.error('Error updating item category price');
                                }}
                            />
                        )}

                        {isCreateFormVisible && !selectedItemCategoryPrice && (
                            <CreateItemCategoryPriceForm
                                isVisible={true}
                                itemCategoryData={itemCategoryData}
                                onClose={() => setIsCreateFormVisible(false)}
                                onSuccess={() => {
                                    setIsCreating(false);
                                    setIsCreateFormVisible(false);
                                    fetchItemCategoryPrices(keyword, currentPage);
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