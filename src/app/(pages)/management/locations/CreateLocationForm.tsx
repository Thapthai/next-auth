'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { IconX } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { PaginatedSelect } from "@/components/ui/paginated-select";

interface CreateLocationFormProps {
    isVisible: boolean;
    saleOfficeData: any[];
    selectedSaleOfficeId_search: string;
    selectedStockLocationId_search: string;
    onClose: () => void;
    onSuccess: () => void;
    onStart?: () => void;
    onError?: () => void;
}

export default function CreateLocationForm({
    isVisible,
    saleOfficeData,
    selectedSaleOfficeId_search,
    selectedStockLocationId_search,
    onClose,
    onSuccess,
    onStart,
    onError
}: CreateLocationFormProps) {
    const t = useTranslations('Locations');
    const [form, setForm] = useState({
        stock_location_id: selectedStockLocationId_search,
        site_short_code: '',
        name_th: '',
        name_en: '',
        description: '',
        status: true
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Sale Office states
    const [loadingSaleOffice, setLoadingSaleOffice] = useState(false);
    const [saleOfficePage, setSaleOfficePage] = useState(1);
    const [saleOfficeKeyword, setSaleOfficeKeyword] = useState('');
    const [hasMoreSaleOffices, setHasMoreSaleOffices] = useState(true);
    const [saleOfficeItemsPerPage] = useState(10);
    const [selectedSaleOfficeId, setSelectedSaleOfficeId] = useState<string>(selectedSaleOfficeId_search);
    const [saleOfficeOptions, setSaleOfficeOptions] = useState<any[]>([]);

    // Stock Location states  
    const [filteredStockLocations, setFilteredStockLocations] = useState<any[]>([]);
    const [loadingStockLocation, setLoadingStockLocation] = useState(false);
    const [stockLocationPage, setStockLocationPage] = useState(1);
    const [stockLocationKeyword, setStockLocationKeyword] = useState('');
    const [hasMoreStockLocations, setHasMoreStockLocations] = useState(true);
    const [stockLocationItemsPerPage] = useState(10);


    useEffect(() => {
        if (isVisible) {
            fetchSaleOffices(1, '', true);
        }
    }, [isVisible]);

    // Sync selected sale office when prop changes
    useEffect(() => {
        setSelectedSaleOfficeId(selectedSaleOfficeId_search || '');
    }, [selectedSaleOfficeId_search]);

    useEffect(() => {
        if (selectedSaleOfficeId) {
            fetchStockLocations(1, '', true, selectedSaleOfficeId);
        } else {
            setFilteredStockLocations([]);
        }
        // Reset stock location selection when sale office changes
        setForm(prev => ({ ...prev, stock_location_id: '' }));
    }, [selectedSaleOfficeId]);

    // Fetch sale office options with pagination and search
    const fetchSaleOffices = async (page = 1, keyword = '', reset = false) => {
        setLoadingSaleOffice(true);
        try {
            const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/sale-offices?page=${page}&pageSize=${saleOfficeItemsPerPage}&keyword=${keyword}`;
            const response = await fetch(url);
            const data = await response.json();

            if (reset || page === 1) {
                let nextOptions = Array.isArray(data?.data) ? data.data : [];
                // Ensure current selectedSaleOfficeId appears in options
                if (selectedSaleOfficeId) {
                    const selectedIdNum = parseInt(selectedSaleOfficeId);
                    if (selectedIdNum && !nextOptions.some((o: any) => o.id === selectedIdNum)) {
                        const fromProp = (saleOfficeData || []).find((o: any) => o.id === selectedIdNum);
                        if (fromProp) {
                            nextOptions = [fromProp, ...nextOptions];
                        } else {
                            try {
                                const selRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sale-offices/${selectedIdNum}`);
                                if (selRes.ok) {
                                    const selItem = await selRes.json();
                                    if (selItem) nextOptions = [selItem, ...nextOptions];
                                }
                            } catch {}
                        }
                    }
                }
                setSaleOfficeOptions(nextOptions);
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
            setLoadingSaleOffice(false);
        }
    };
    const fetchStockLocations = async (page = 1, keyword = '', reset = false, saleOfficeId = selectedSaleOfficeId) => {
        setLoadingStockLocation(true);
        try {
            let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/stock-locations/pagination-with-search?page=${page}&pageSize=${stockLocationItemsPerPage}&keyword=${keyword}`;
            if (saleOfficeId) {
                url += `&sale_office_id=${saleOfficeId}`;
            }
            const response = await fetch(url);
            const data = await response.json();

            if (reset || page === 1) {
                let nextOptions = Array.isArray(data?.data) ? data.data : [];
                // Ensure current selected stock_location_id appears in options
                const selectedStockId = parseInt(String(form.stock_location_id)) || 0;
                if (selectedStockId && !nextOptions.some((o: any) => o.id === selectedStockId)) {
                    try {
                        const selRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/stock-locations/${selectedStockId}`);
                        if (selRes.ok) {
                            const selItem = await selRes.json();
                            if (selItem) nextOptions = [selItem, ...nextOptions];
                        }
                    } catch {}
                }
                setFilteredStockLocations(nextOptions || []);
            } else {
                // Append new data and filter duplicates
                const existingIds = new Set(filteredStockLocations.map((item: any) => item.id));
                const newData = (data.data || []).filter((item: any) => !existingIds.has(item.id));
                setFilteredStockLocations(prev => [...prev, ...newData]);
            }

            setHasMoreStockLocations(page < (data.totalPages || 1));
        } catch (error) {
            console.error('Error fetching stock locations:', error);
            if (reset || page === 1) {
                setFilteredStockLocations([]);
            }
        } finally {
            setLoadingStockLocation(false);
        }
    };

    const handleStockLocationSearch = (keyword: string) => {
        setStockLocationKeyword(keyword);
        setStockLocationPage(1);
        fetchStockLocations(1, keyword, true, selectedSaleOfficeId);
    };

    const handleLoadMoreStockLocations = () => {
        if (hasMoreStockLocations && !loadingStockLocation) {
            const nextPage = stockLocationPage + 1;
            setStockLocationPage(nextPage);
            fetchStockLocations(nextPage, stockLocationKeyword, false, selectedSaleOfficeId);
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

    const formatStockLocationOptions = () => {
        return filteredStockLocations.map((stockLocation) => ({
            id: stockLocation.id,
            value: stockLocation.id.toString(),
            label: `${stockLocation.site_short_code} - ${stockLocation.name_th} - ${stockLocation.name_en}`
        }));
    };

    const handleSaleOfficeChange = (value: string) => {
        const saleOfficeId = parseInt(value) || 0;
        setSelectedSaleOfficeId(value);
        setForm(prev => ({
            ...prev,
            stock_location_id: '' // Reset stock location when sale office changes
        }));

        // If cleared, fetch all sale offices without filter
        if (!value || value === '') {
            fetchSaleOffices(1, '', true);
        }
    };

    const handleStockLocationChange = (value: string) => {
        if (!value) {
            setForm(prev => ({ ...prev, stock_location_id: '' }));
            // refresh options for current sale office when cleared
            if (selectedSaleOfficeId) fetchStockLocations(1, '', true, selectedSaleOfficeId);
            return;
        }
        const stockLocationIdNum = parseInt(value) || 0;
        setForm(prev => ({
            ...prev,
            stock_location_id: stockLocationIdNum.toString()
        }));
    };

    const handleSaleOfficeSearch = (keyword: string) => {
        setSaleOfficeKeyword(keyword);
        setSaleOfficePage(1);
        fetchSaleOffices(1, keyword || '', true);
    };

    const handleLoadMoreSaleOffices = () => {
        if (hasMoreSaleOffices && !loadingSaleOffice) {
            const nextPage = saleOfficePage + 1;
            setSaleOfficePage(nextPage);
            fetchSaleOffices(nextPage, saleOfficeKeyword, false);
        }
    };


    // Set initial stock_location_id from selectedStockLocationId_search เพื่อกันการเปลี่ยน stock location ที่ไม่ต้องการ
    useEffect(() => {
        if (selectedStockLocationId_search && selectedStockLocationId_search !== '0') {
            const stockLocationId = parseInt(selectedStockLocationId_search) || 0;
            setForm(prev => ({
                ...prev,
                stock_location_id: stockLocationId.toString()
            }));
        }
    }, [selectedStockLocationId_search]);



    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        if (onStart) onStart();

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/locations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                    {
                        stock_location_id: parseInt(form.stock_location_id),
                        description: form.description,
                        name_en: form.name_en,
                        name_th: form.name_th,
                        site_short_code: form.site_short_code,
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
                                case 'Site short code already exists in this stock location': return t('siteShortCodeExists');
                                case 'Site short code must not exceed 50 characters': return t('siteShortCodeTooLong');
                                case 'Description must not exceed 200 characters': return t('descriptionTooLong');
                                case 'stock_location_id must be an integer number': return t('stockLocationIdInvalid');
                                case 'stock_location_id should not be empty': return t('stockLocationIdRequired');
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
            setForm({
                stock_location_id: selectedStockLocationId_search,
                site_short_code: '',
                name_th: '',
                name_en: '',
                description: '',
                status: true
            });
            onSuccess();
            onClose();
        } catch (err) {
            console.error('Create location error:', err);
            setError(err instanceof Error ? err.message : t('createError'));
            if (onError) onError();
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading) {
            setForm({
                stock_location_id: selectedStockLocationId_search,
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
                <h2 className="text-lg font-bold text-gray-800">{t('createNewLocation')}</h2>
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

                <div className="space-y-2 md:col-span-2">
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

                {/* Sale Office Filter */}
                <div className="space-y-2">
                    <label className="text-sm text-gray-600">{t('filterBySaleOffice')}</label>

                    {/* ใช้เพื่อค้นหา Stock Location ไม่ได้นำไปส่ง form เพื่อกันการเปลี่ยน sale office ที่ไม่ต้องการ */}
                    <PaginatedSelect
                        value={selectedSaleOfficeId}
                        placeholder={t('selectSaleOfficeFilter')}
                        disabled={loading || loadingSaleOffice}
                        options={formatSaleOfficeOptions()}
                        loading={loadingSaleOffice}
                        hasMore={hasMoreSaleOffices}
                        onValueChange={handleSaleOfficeChange}
                        onSearch={handleSaleOfficeSearch}
                        onLoadMore={handleLoadMoreSaleOffices}
                        className="w-full"
                    />
                </div>

                {/* Stock Location Filter */}
                <div className="space-y-2">
                    <label className="text-sm text-gray-600">{t('stockLocation')}</label>
                    <PaginatedSelect
                        value={form.stock_location_id}
                        placeholder={
                            !selectedSaleOfficeId
                                ? t('selectSaleOfficeFirst')
                                : filteredStockLocations.length === 0
                                    ? t('noStockLocationsFound')
                                    : t('selectStockLocation')
                        }
                        disabled={loading || loadingStockLocation || !selectedSaleOfficeId}
                        options={formatStockLocationOptions()}
                        loading={loadingStockLocation}
                        hasMore={hasMoreStockLocations}
                        onValueChange={handleStockLocationChange}
                        onSearch={handleStockLocationSearch}
                        onLoadMore={handleLoadMoreStockLocations}
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
                </div>

                <div className="space-y-2 md:col-span-2">
                    <label className="text-sm text-gray-600">{t('description')}</label>
                    <Input
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        disabled={loading}
                        placeholder={t('description')}
                        maxLength={100}
                        required
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
