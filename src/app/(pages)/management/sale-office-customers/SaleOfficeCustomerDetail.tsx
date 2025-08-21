'use client';

import { useEffect, useState } from "react";
import { SaleOfficeCustomer } from "@/types/saleOfficeCustomer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { IconDeviceFloppy, IconX } from "@tabler/icons-react";
import { Loader2 } from "lucide-react";
import { PaginatedSelect } from "@/components/ui/paginated-select";
import { useTranslations } from "next-intl";

type Props = {
    saleOfficeCustomer: SaleOfficeCustomer | null;
    refresh: () => void;
    onClose: () => void;
};

export default function SaleOfficeCustomerDetail({ saleOfficeCustomer, refresh, onClose }: Props) {
    const t = useTranslations("SaleOfficeCustomers.SaleOfficeCustomerDetail");

    const [form, setForm] = useState({
        sale_office_id: "",
        customer_id: "",
        status: true,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Sale Office options
    const [saleOfficeOptions, setSaleOfficeOptions] = useState<any[]>([]);
    const [loadingSaleOffices, setLoadingSaleOffices] = useState(false);
    const [saleOfficePage, setSaleOfficePage] = useState(1);
    const [saleOfficeKeyword, setSaleOfficeKeyword] = useState('');
    const [hasMoreSaleOffices, setHasMoreSaleOffices] = useState(true);
    const [saleOfficeItemsPerPage] = useState(10);

    // Customer options
    const [customerOptions, setCustomerOptions] = useState<any[]>([]);
    const [loadingCustomers, setLoadingCustomers] = useState(false);
    const [customerPage, setCustomerPage] = useState(1);
    const [customerKeyword, setCustomerKeyword] = useState('');
    const [hasMoreCustomers, setHasMoreCustomers] = useState(true);
    const [customerItemsPerPage] = useState(10);

    useEffect(() => {
        if (saleOfficeCustomer) {
            setForm({
                sale_office_id: saleOfficeCustomer.sale_office_id?.toString() || "",
                customer_id: saleOfficeCustomer.customer_id?.toString() || "",
                status: saleOfficeCustomer.status ?? true,
            });
        }
    }, [saleOfficeCustomer]);

    // Fetch Sale Offices with pagination and search
    const fetchSaleOffices = async (page = 1, keyword = '', reset = false) => {
        setLoadingSaleOffices(true);
        try {
            const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/sale-offices?page=${page}&pageSize=${saleOfficeItemsPerPage}&keyword=${keyword}`;
            const response = await fetch(url);
            const data = await response.json();

            if (reset || page === 1) {
                setSaleOfficeOptions(data.data || []);
            } else {
                const existingIds = new Set(saleOfficeOptions.map((item: any) => item.id));
                const newData = (data.data || []).filter((item: any) => !existingIds.has(item.id));
                setSaleOfficeOptions(prev => [...prev, ...newData]);
            }

            setHasMoreSaleOffices(page < (data.totalPages || 1));
        } catch (error) {
            console.error('Error fetching sale offices:', error);
            if (reset || page === 1) {
                setSaleOfficeOptions([]);
            }
        } finally {
            setLoadingSaleOffices(false);
        }
    };

    // Fetch Customers with pagination and search
    const fetchCustomers = async (page = 1, keyword = '', reset = false) => {
        setLoadingCustomers(true);
        try {
            const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/customers/pagination-with-search?page=${page}&pageSize=${customerItemsPerPage}&keyword=${keyword}`;
            const response = await fetch(url);
            const data = await response.json();

            if (reset || page === 1) {
                setCustomerOptions(data.data || []);
            } else {
                const existingIds = new Set(customerOptions.map((item: any) => item.id));
                const newData = (data.data || []).filter((item: any) => !existingIds.has(item.id));
                setCustomerOptions(prev => [...prev, ...newData]);
            }

            setHasMoreCustomers(page < (data.totalPages || 1));
        } catch (error) {
            console.error('Error fetching customers:', error);
            if (reset || page === 1) {
                setCustomerOptions([]);
            }
        } finally {
            setLoadingCustomers(false);
        }
    };

    // Load initial data when component becomes visible
    useEffect(() => {
        if (saleOfficeCustomer) {
            fetchSaleOffices(1, '', true);
            fetchCustomers(1, '', true);
        }
    }, [saleOfficeCustomer]);

    // Handle Sale Office search and pagination
    const handleSaleOfficeSearch = (keyword: string) => {
        setSaleOfficeKeyword(keyword);
        setSaleOfficePage(1);
        fetchSaleOffices(1, keyword || '', true);
    };

    const handleLoadMoreSaleOffices = () => {
        if (hasMoreSaleOffices && !loadingSaleOffices) {
            const nextPage = saleOfficePage + 1;
            setSaleOfficePage(nextPage);
            fetchSaleOffices(nextPage, saleOfficeKeyword, false);
        }
    };

    // Handle Customer search and pagination
    const handleCustomerSearch = (keyword: string) => {
        setCustomerKeyword(keyword);
        setCustomerPage(1);
        fetchCustomers(1, keyword || '', true);
    };

    const handleLoadMoreCustomers = () => {
        if (hasMoreCustomers && !loadingCustomers) {
            const nextPage = customerPage + 1;
            setCustomerPage(nextPage);
            fetchCustomers(nextPage, customerKeyword, false);
        }
    };

    // Format options for PaginatedSelect
    const formatSaleOfficeOptions = () => {
        return saleOfficeOptions.map((item: any) => ({
            id: item.id,
            value: item.id.toString(),
            label: `${item.name_th} (${item.sale_office_code})`
        }));
    };

    const formatCustomerOptions = () => {
        return customerOptions.map((item: any) => ({
            id: item.id,
            value: item.id.toString(),
            label: `${item.name_th} (${item.site_short_code})`
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!saleOfficeCustomer) return;

        setLoading(true);
        setError(null);

        try {
            // Convert empty strings to undefined for optional fields
            const submitData = {
                ...form,
                sale_office_id: form.sale_office_id ? Number(form.sale_office_id) : undefined,
                customer_id: form.customer_id ? Number(form.customer_id) : undefined,
            };

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sale-office-customers/${saleOfficeCustomer.id}`, {
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
                                case 'Sale office customer relationship already exists':
                                    return 'ความสัมพันธ์ระหว่างสำนักงานขายและลูกค้านี้มีอยู่แล้ว';
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
            console.error('Update sale office customer error:', err);
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

    if (!saleOfficeCustomer) return null;

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

                    {/* sale_office_id */}
                    <div className="space-y-2">
                        <Label htmlFor="sale_office_id" className="text-sm text-gray-600">{t("labels.saleOffice")}</Label>
                        <PaginatedSelect
                            value={form.sale_office_id}
                            placeholder={t("placeholders.saleOffice")}
                            disabled={loading || loadingSaleOffices}
                            options={formatSaleOfficeOptions()}
                            loading={loadingSaleOffices}
                            hasMore={hasMoreSaleOffices}
                            onValueChange={(value) => setForm({ ...form, sale_office_id: value })}
                            onSearch={handleSaleOfficeSearch}
                            onLoadMore={handleLoadMoreSaleOffices}
                            className="w-full"
                            showClearButton={false}
                        />
                    </div>

                    {/* customer_id */}
                    <div className="space-y-2">
                        <Label htmlFor="customer_id" className="text-sm text-gray-600">{t("labels.customer")}</Label>
                        <PaginatedSelect
                            value={form.customer_id}
                            placeholder={t("placeholders.customer")}
                            disabled={loading || loadingCustomers}
                            options={formatCustomerOptions()}
                            loading={loadingCustomers}
                            hasMore={hasMoreCustomers}
                            onValueChange={(value) => setForm({ ...form, customer_id: value })}
                            onSearch={handleCustomerSearch}
                            onLoadMore={handleLoadMoreCustomers}
                            className="w-full"
                            showClearButton={false}
                        />
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
