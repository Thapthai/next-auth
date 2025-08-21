'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { IconDeviceFloppy, IconX } from "@tabler/icons-react";
import { Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { PaginatedSelect } from "@/components/ui/paginated-select";
import { useTranslations } from "next-intl";

interface CreateSaleOfficeCustomerFormProps {
    isVisible: boolean;
    onClose: () => void;
    onSuccess: () => void;
    onStart?: () => void;
    onError?: () => void;
}

export default function CreateSaleOfficeCustomerForm({ isVisible, onClose, onSuccess, onStart, onError }: CreateSaleOfficeCustomerFormProps) {
    const t = useTranslations("SaleOfficeCustomers.CreateSaleOfficeCustomerForm");

    const [formData, setFormData] = useState({
        sale_office_id: '',
        customer_id: '',
        status: true
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
        if (isVisible) {
            fetchSaleOffices(1, '', true);
            fetchCustomers(1, '', true);
        }
    }, [isVisible]);

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
        setLoading(true);
        setError(null);

        if (onStart) onStart();

        try {
            // Convert empty strings to undefined for optional fields
            const submitData = {
                ...formData,
                sale_office_id: formData.sale_office_id ? Number(formData.sale_office_id) : undefined,
                customer_id: formData.customer_id ? Number(formData.customer_id) : undefined,
            };

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sale-office-customers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(submitData),
            });

            if (!res.ok) {
                const errorData = await res.json();

                let errorMessage = t('errors.createFailed');

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
                        errorMessage = errorData.message || t('errors.createFailed');
                    }
                } else {
                    errorMessage = errorData.message || t('errors.createFailed');
                }

                throw new Error(errorMessage);
            }

            // Reset form
            setFormData({
                sale_office_id: '',
                customer_id: '',
                status: true
            });

            onSuccess();
        } catch (err) {
            console.error('Create sale office customer error:', err);
            setError(err instanceof Error ? err.message : t('errors.createFailed'));
        } finally {
            setLoading(false);
            if (onError) onError();
        }
    };

    const handleClose = () => {
        if (!loading) {
            // Reset form
            setFormData({
                sale_office_id: '',
                customer_id: '',
                status: true
            });
            onClose();
        }
    };

    if (!isVisible) return null;

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
                            value={formData.sale_office_id}
                            placeholder={t("placeholders.saleOffice")}
                            disabled={loading || loadingSaleOffices}
                            options={formatSaleOfficeOptions()}
                            loading={loadingSaleOffices}
                            hasMore={hasMoreSaleOffices}
                            onValueChange={(value) => setFormData({ ...formData, sale_office_id: value })}
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
                            value={formData.customer_id}
                            placeholder={t("placeholders.customer")}
                            disabled={loading || loadingCustomers}
                            options={formatCustomerOptions()}
                            loading={loadingCustomers}
                            hasMore={hasMoreCustomers}
                            onValueChange={(value) => setFormData({ ...formData, customer_id: value })}
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
                                onCheckedChange={(checked) => setFormData({ ...formData, status: checked })}
                                disabled={loading}
                                checked={formData.status}
                            />
                            <span className="text-sm text-gray-600">
                                {formData.status ? t("status.active") : t("status.inactive")}
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
                                {t('buttons.creating')}
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <IconDeviceFloppy className="w-4 h-4" />
                                {t('buttons.create')}
                            </div>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
