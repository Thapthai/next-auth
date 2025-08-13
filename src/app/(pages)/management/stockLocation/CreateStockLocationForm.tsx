'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { IconX } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { PaginatedSelect } from "@/components/ui/paginated-select";

interface CreateStockLocationFormProps {
    selectedSaleOfficeId_search: string;
    isVisible: boolean;
    saleOfficeData: any[];
    onClose: () => void;
    onSuccess: () => void;
    onStart?: () => void;
    onError?: () => void;
}

export default function CreateStockLocationForm({
    selectedSaleOfficeId_search,
    isVisible,
    saleOfficeData,
    onClose,
    onSuccess,
    onStart,
    onError
}: CreateStockLocationFormProps) {
    const t = useTranslations('StockLocations');
    const [form, setForm] = useState({
        sale_office_id: 0,
        site_short_code: '',
        name_th: '',
        name_en: '',
        description: '',
        status: true
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [saleOfficeOptions, setSaleOfficeOptions] = useState<any[]>([]);
    const [loadingOptions, setLoadingOptions] = useState(false);
    const [saleOfficePage, setSaleOfficePage] = useState(1);
    const [saleOfficeKeyword, setSaleOfficeKeyword] = useState('');
    const [hasMoreSaleOffices, setHasMoreSaleOffices] = useState(true);
    const [saleOfficeItemsPerPage] = useState(10);
    const [selectedSaleOfficeId, setSelectedSaleOfficeId] = useState<string>(selectedSaleOfficeId_search);

    // Fetch sale office options with pagination and search
    const fetchSaleOffices = async (page = 1, keyword = '', reset = false) => {
        setLoadingOptions(true);
        try {
            const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/sale-offices?page=${page}&pageSize=${saleOfficeItemsPerPage}&keyword=${keyword}`;
            const response = await fetch(url);
            const data = await response.json();

            if (reset || page === 1) {
                setSaleOfficeOptions(data.data || []);
            } else {
                // Append new data and filter duplicates
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
            setLoadingOptions(false);
        }
    };

    const handleSaleOfficeSearch = (keyword: string) => {
        setSaleOfficeKeyword(keyword);
        setSaleOfficePage(1);
        fetchSaleOffices(1, keyword || '', true);
    };

    const handleLoadMoreSaleOffices = () => {
        if (hasMoreSaleOffices && !loadingOptions) {
            const nextPage = saleOfficePage + 1;
            setSaleOfficePage(nextPage);
            fetchSaleOffices(nextPage, saleOfficeKeyword, false);
        }
    };

    const formatSaleOfficeOptions = () => {

        const dataToUse = saleOfficeOptions.length > 0 ? saleOfficeOptions : saleOfficeData;

        return dataToUse.map((office: any) => ({
            id: office.id,
            value: office.id.toString(),
            label: `${office.sale_office_code} - ${office.name_th} - ${office.name_en}`
        }));
    };

    // Handle sale office change
    const handleSaleOfficeChange = (value: string) => {
        const saleOfficeId = parseInt(value) || 0;
        setSelectedSaleOfficeId(value);

        setForm({
            ...form,
            sale_office_id: saleOfficeId
        });

        // If cleared, fetch all sale offices without filter
        if (!value || value === '') {
            fetchSaleOffices(1, '', true);
        }
    };


    // Sync selectedSaleOfficeId and form when prop selectedSaleOfficeId_search changes
    useEffect(() => {
        const nextId = selectedSaleOfficeId_search || '';
        setSelectedSaleOfficeId(nextId);

        const parsedId = parseInt(nextId) || 0;
        setForm(prev => ({
            ...prev,
            sale_office_id: parsedId,
        }));
    }, [selectedSaleOfficeId_search]);


    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        if (onStart) onStart();

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/stock-locations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                    {
                        sale_office_id: parseInt(form.sale_office_id.toString()),
                        site_short_code: form.site_short_code,
                        name_th: form.name_th,
                        name_en: form.name_en,
                        description: form.description,
                        status: form.status,
                    }
                ),
            });

            if (!res.ok) {
                const errorData = await res.json();
                let errorMessage = t('createError');

                if (res.status === 409 || res.status === 400) {
                    if (errorData.message && Array.isArray(errorData.message)) {
                        const translatedMessages = errorData.message.map((msg: string) => {
                            switch (msg) {
                                case 'Site short code already exists in this sale office': return t('siteShortCodeExists');
                                case 'Site short code must not exceed 50 characters': return t('siteShortCodeTooLong');
                                case 'Description must not exceed 200 characters': return t('descriptionTooLong');
                                case 'sale_office_id must be an integer number': return t('saleOfficeIdInvalid');
                                case 'sale_office_id should not be empty': return t('saleOfficeIdRequired');
                                case 'site_short_code should not be empty': return t('siteShortCodeRequired');
                                case 'name_th should not be empty': return t('nameThRequired');
                                case 'name_en should not be empty': return t('nameEnRequired');
                                default: return msg;
                            }
                        });
                        errorMessage = translatedMessages.join(', ');
                    } else {
                        errorMessage = errorData.message || t('createError');
                    }
                }

                throw new Error(errorMessage);
            }

            // สร้างสำเร็จ - รีเซ็ตฟอร์ม
            const initialSaleOfficeId = selectedSaleOfficeId_search && selectedSaleOfficeId_search !== '0'
                ? parseInt(selectedSaleOfficeId_search) || 0
                : 0;
            setForm({
                sale_office_id: initialSaleOfficeId,
                site_short_code: '',
                name_th: '',
                name_en: '',
                description: '',
                status: true
            });
            onSuccess();
            onClose();
        } catch (err) {
            console.error('Create stock location error:', err);
            setError(err instanceof Error ? err.message : t('createError'));
            if (onError) onError();
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading) {
            const initialSaleOfficeId = selectedSaleOfficeId_search && selectedSaleOfficeId_search !== '0'
                ? parseInt(selectedSaleOfficeId_search) || 0
                : 0;
            setForm({
                sale_office_id: initialSaleOfficeId,
                site_short_code: '',
                name_th: '',
                name_en: '',
                description: '',
                status: true
            });
            onClose();
        }
    };


    if (!isVisible) return null;

    return (
        <div className="mt-6 p-4 border rounded shadow bg-white space-y-3">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-800">{t('createNewStockLocation')}</h2>
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
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">{error}</p>
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div className="space-y-2">
                    <label className="text-sm text-gray-600">{t('site_short_code')}</label>
                    <Input
                        value={form.site_short_code}
                        onChange={(e) => setForm({ ...form, site_short_code: e.target.value })}
                        disabled={loading}
                        placeholder={t('site_short_code')}
                        required
                        maxLength={50}
                    />
                    <div className="text-xs text-gray-500">
                        {form.site_short_code.length}/50 ตัวอักษร
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm text-gray-600">{t('saleOffice')}</label>
                    <PaginatedSelect
                        value={selectedSaleOfficeId}
                        placeholder={t('selectSaleOffice')}
                        disabled={loading || loadingOptions}
                        options={formatSaleOfficeOptions()}
                        loading={loadingOptions}
                        hasMore={hasMoreSaleOffices}
                        onValueChange={handleSaleOfficeChange}
                        onSearch={handleSaleOfficeSearch}
                        onLoadMore={handleLoadMoreSaleOffices}
                        className="w-full"
                    />
                </div>


                <div className="space-y-2">
                    <label className="text-sm text-gray-600">{t('nameTh')}</label>
                    <Input
                        value={form.name_th}
                        onChange={(e) => setForm({ ...form, name_th: e.target.value })}
                        disabled={loading}
                        placeholder={t('nameTh')}
                        maxLength={50}
                        required
                    />
                    <div className="text-xs text-gray-500">
                        {form.name_th.length}/50 ตัวอักษร
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm text-gray-600">{t('nameEn')}</label>
                    <Input
                        value={form.name_en}
                        onChange={(e) => setForm({ ...form, name_en: e.target.value })}
                        disabled={loading}
                        placeholder={t('nameEn')}
                        maxLength={50}
                        required
                    />
                    <div className="text-xs text-gray-500">
                        {form.name_en.length}/50 ตัวอักษร
                    </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                    <label className="text-sm text-gray-600">{t('description')}</label>
                    <Input
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        disabled={loading}
                        placeholder={t('description')}
                        maxLength={100}
                    />
                    <div className="text-xs text-gray-500">
                        {form.description.length}/100 ตัวอักษร
                    </div>
                </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
                <Button variant="outline" onClick={handleClose} disabled={loading}>
                    {t('cancel')}
                </Button>
                <Button variant="default" onClick={handleSubmit} disabled={loading}>
                    {loading ? t('saving') : t('save')}
                </Button>
            </div>
        </div>
    );
}