'use client';

import { useEffect, useState } from "react";
import { ShipTo } from "@/types/shipTo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { IconDeviceFloppy, IconX } from "@tabler/icons-react";
import { Loader2 } from "lucide-react";
import { PaginatedSelect } from "@/components/ui/paginated-select";
import { useTranslations } from "next-intl";

type Props = {
    shipTo: ShipTo | null;
    refresh: () => void;
    onClose: () => void;
};

export default function ShipToDetail({ shipTo, refresh, onClose }: Props) {
    const t = useTranslations("ShipTos.ShipToDetail");

    const [form, setForm] = useState({
        ship_to_code: "",
        sale_office_customer_id: "",
        description: "",
        status: true,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Sale Office Customer options
    const [saleOfficeCustomerOptions, setSaleOfficeCustomerOptions] = useState<any[]>([]);
    const [loadingSaleOfficeCustomers, setLoadingSaleOfficeCustomers] = useState(false);
    const [saleOfficeCustomerPage, setSaleOfficeCustomerPage] = useState(1);
    const [saleOfficeCustomerKeyword, setSaleOfficeCustomerKeyword] = useState('');
    const [hasMoreSaleOfficeCustomers, setHasMoreSaleOfficeCustomers] = useState(true);
    const [saleOfficeCustomerItemsPerPage] = useState(10);

    useEffect(() => {
        if (shipTo) {
            setForm({
                ship_to_code: shipTo.ship_to_code || "",
                sale_office_customer_id: shipTo.sale_office_customer_id?.toString() || "",
                description: shipTo.description || "",
                status: shipTo.status ?? true,
            });
        }
    }, [shipTo]);

    // Fetch Sale Office Customers with pagination and search
    const fetchSaleOfficeCustomers = async (page = 1, keyword = '', reset = false) => {
        setLoadingSaleOfficeCustomers(true);
        try {
            // TODO: Replace with actual API endpoint for sale office customers
            const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/sale-office-customers/pagination-with-search?page=${page}&pageSize=${saleOfficeCustomerItemsPerPage}&keyword=${keyword}`;
            const response = await fetch(url);
            const data = await response.json();

            if (reset || page === 1) {
                setSaleOfficeCustomerOptions(data.data || []);
            } else {
                const existingIds = new Set(saleOfficeCustomerOptions.map((item: any) => item.id));
                const newData = (data.data || []).filter((item: any) => !existingIds.has(item.id));
                setSaleOfficeCustomerOptions(prev => [...prev, ...newData]);
            }

            setHasMoreSaleOfficeCustomers(page < (data.totalPages || 1));
        } catch (error) {
            console.error('Error fetching sale office customers:', error);
            if (reset || page === 1) {
                setSaleOfficeCustomerOptions([]);
            }
        } finally {
            setLoadingSaleOfficeCustomers(false);
        }
    };

    // Load initial data when component becomes visible
    useEffect(() => {
        if (shipTo) {
            fetchSaleOfficeCustomers(1, '', true);
        }
    }, [shipTo]);

    // Handle Sale Office Customer search and pagination
    const handleSaleOfficeCustomerSearch = (keyword: string) => {
        setSaleOfficeCustomerKeyword(keyword);
        setSaleOfficeCustomerPage(1);
        fetchSaleOfficeCustomers(1, keyword || '', true);
    };

    const handleLoadMoreSaleOfficeCustomers = () => {
        if (hasMoreSaleOfficeCustomers && !loadingSaleOfficeCustomers) {
            const nextPage = saleOfficeCustomerPage + 1;
            setSaleOfficeCustomerPage(nextPage);
            fetchSaleOfficeCustomers(nextPage, saleOfficeCustomerKeyword, false);
        }
    };

    // Format options for PaginatedSelect
    const formatSaleOfficeCustomerOptions = () => {
        return saleOfficeCustomerOptions.map((item: any) => ({
            id: item.id,
            value: item.id.toString(),
            label: `${item.customer?.name_th} - ${item.sale_office?.name_th} (${item.customer?.site_short_code})`
        }));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!shipTo) return;

        setLoading(true);
        setError(null);

        try {
            // Convert empty strings to undefined for optional fields
            const submitData = {
                ...form,
                sale_office_customer_id: form.sale_office_customer_id ? Number(form.sale_office_customer_id) : undefined,
                description: form.description || undefined,
            };

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/ship-tos/${shipTo.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(submitData),
            });

            if (!res.ok) {
                const errorData = await res.json();

                let errorMessage = t('errors.updateFailed');

                if (res.status === 409 || res.status === 400) {
                    if (errorData.message && Array.isArray(errorData.message)) {
                        const translatedMessages = errorData.message.map((msg: string) => {
                            switch (msg) {
                                case 'Ship to code already exists':
                                    return 'รหัส Ship To นี้มีอยู่แล้ว';
                                case 'Ship to code must not exceed 50 characters':
                                    return 'รหัส Ship To ต้องไม่เกิน 50 ตัวอักษร';
                                case 'Description must not exceed 200 characters':
                                    return 'คำอธิบายต้องไม่เกิน 200 ตัวอักษร';
                                default:
                                    return msg;
                            }
                        });
                        errorMessage = translatedMessages.join(', ');
                    } else {
                        errorMessage = errorData.message || t('errors.updateFailed');
                    }
                } else {
                    errorMessage = errorData.message || t('errors.updateFailed');
                }

                throw new Error(errorMessage);
            }

            refresh();
            onClose();
        } catch (err) {
            console.error('Update ship to error:', err);
            setError(err instanceof Error ? err.message : t('errors.updateFailed'));
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading) {
            onClose();
        }
    };

    if (!shipTo) return null;

    return (
        <div className="mt-6 p-4 border rounded shadow bg-white space-y-3">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-800">{t('title')}</h2>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClose}
                    disabled={loading}
                    className="text-gray-500 hover:text-gray-700"
                >
                    <IconX className="w-4 h-4" />
                </Button>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {/* ship_to_code */}
                    <div className="space-y-2">
                        <Label htmlFor="ship_to_code" className="text-sm text-gray-600">{t("labels.shipToCode")}</Label>
                        <Input
                            id="ship_to_code"
                            name="ship_to_code"
                            value={form.ship_to_code}
                            onChange={handleInputChange}
                            placeholder={t("placeholders.shipToCode")}
                            required
                            disabled={loading}
                            maxLength={50}
                            className="w-full"
                        />
                        <div className="text-xs text-gray-500">
                            {form.ship_to_code.length}/50 {t("validation.maxLength")}
                        </div>
                    </div>

                    {/* sale_office_customer_id */}
                    <div className="space-y-2">
                        <Label htmlFor="sale_office_customer_id" className="text-sm text-gray-600">{t("labels.saleOfficeCustomer")}</Label>
                        <PaginatedSelect
                            value={form.sale_office_customer_id}
                            placeholder={t("placeholders.saleOfficeCustomer")}
                            disabled={loading || loadingSaleOfficeCustomers}
                            options={formatSaleOfficeCustomerOptions()}
                            loading={loadingSaleOfficeCustomers}
                            hasMore={hasMoreSaleOfficeCustomers}
                            onValueChange={(value) => setForm({ ...form, sale_office_customer_id: value })}
                            onSearch={handleSaleOfficeCustomerSearch}
                            onLoadMore={handleLoadMoreSaleOfficeCustomers}
                            className="w-full"
                            showClearButton={false}
                        />
                    </div>

                    {/* description */}
                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="description" className="text-sm text-gray-600">{t("labels.description")}</Label>
                        <textarea
                            id="description"
                            name="description"
                            value={form.description}
                            onChange={handleInputChange}
                            placeholder={t("placeholders.description")}
                            disabled={loading}
                            maxLength={200}
                            rows={3}
                            className="w-full border rounded px-2 py-1"
                        />
                        <div className="text-xs text-gray-500">
                            {form.description.length}/200 {t("validation.maxLength")}
                        </div>
                    </div>

                    {/* status */}
                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="status" className="text-sm text-gray-600">{t("labels.status")}</Label>
                        <div className="flex items-center gap-2">
                            <Switch
                                id="status"
                                name="status"
                                onCheckedChange={(checked) => setForm({ ...form, status: checked })}
                                disabled={loading}
                                checked={form.status}
                            />
                            <span className="text-sm text-gray-600">
                                {form.status ? t("status.active") : t("status.inactive")}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleClose}
                        disabled={loading}
                    >
                        {t('buttons.cancel')}
                    </Button>
                    <Button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                {t('buttons.saving')}
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <IconDeviceFloppy className="w-4 h-4" />
                                {t('buttons.save')}
                            </div>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
