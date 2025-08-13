'use client';

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { IconX } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { PaginatedSelect } from "@/components/ui/paginated-select";
import { Switch } from "@/components/ui/switch";
import { Location } from "@/types/location";

interface LocationDetailProps {
    location: Location;
    isVisible: boolean;
    stockLocationData: any[];
    saleOfficeData: any[];
    onClose: () => void;
    onSuccess: () => void;
    onStart?: () => void;
    onError?: () => void;
}

export default function LocationDetail({
    location,
    isVisible,
    stockLocationData,
    saleOfficeData,
    onClose,
    onSuccess,
    onStart,
    onError
}: LocationDetailProps) {
    const t = useTranslations('Locations');
    const [form, setForm] = useState({
        sale_office_id: 0,
        stock_location_id: 0,
        site_short_code: '',
        name_th: '',
        name_en: '',
        description: '',
        status: true
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Sale Office states
    const [saleOfficeOptions, setSaleOfficeOptions] = useState<any[]>([]);
    const [loadingSaleOffices, setLoadingSaleOffices] = useState(false);
    const [saleOfficePage, setSaleOfficePage] = useState(1);
    const [saleOfficeKeyword, setSaleOfficeKeyword] = useState('');
    const [hasMoreSaleOffices, setHasMoreSaleOffices] = useState(true);
    const [saleOfficeItemsPerPage] = useState(10);
    const [selectedSaleOfficeId, setSelectedSaleOfficeId] = useState<string>('');

    // Stock Location states
    const [stockLocationOptions, setStockLocationOptions] = useState<any[]>([]);
    const [loadingStockLocations, setLoadingStockLocations] = useState(false);
    const [stockLocationPage, setStockLocationPage] = useState(1);
    const [stockLocationKeyword, setStockLocationKeyword] = useState('');
    const [hasMoreStockLocations, setHasMoreStockLocations] = useState(true);
    const [stockLocationItemsPerPage] = useState(10);

    useEffect(() => {
        if (location) {

            setForm({
                sale_office_id: location.stock_location.sale_office.id,
                stock_location_id: location.stock_location_id || 0,
                site_short_code: location.site_short_code?.toString() || '',
                name_th: location.name_th || '',
                name_en: location.name_en || '',
                description: location.description || '',
                status: location.status ?? true
            });

            setSelectedSaleOfficeId(location.stock_location.sale_office.id.toString());

            // Load stock locations for the selected sale office when component opens
            if (location.stock_location.sale_office.id > 0) {
                fetchStockLocations(1, '', true, location.stock_location.sale_office.id.toString());
            }
        }
    }, [location, stockLocationData]);

    useEffect(() => {
        if (isVisible) {
            fetchSaleOffices(1, '', true);
        }
    }, [isVisible]);

    useEffect(() => {
        if (selectedSaleOfficeId && saleOfficeOptions.length > 0) {
            const hasSelectedOffice = saleOfficeOptions.some((item: any) => item.id.toString() === selectedSaleOfficeId);
            if (!hasSelectedOffice) {
                // Fetch selected sale office separately
                fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sale-offices/${selectedSaleOfficeId}`)
                    .then(response => response.json())
                    .then(selectedOffice => {
                        if (selectedOffice) {
                            setSaleOfficeOptions(prev => [selectedOffice, ...prev]);
                        }
                    })
                    .catch(error => console.error('Error fetching selected sale office:', error));
            }
        }
    }, [selectedSaleOfficeId, saleOfficeOptions]);

    useEffect(() => {
        if (selectedSaleOfficeId) {
            fetchStockLocations(1, '', true, selectedSaleOfficeId);
        } else {
            setStockLocationOptions([]);
        }
    }, [selectedSaleOfficeId]);

    // Fetch sale office options with pagination and search
    const fetchSaleOffices = async (page = 1, keyword = '', reset = false) => {
        setLoadingSaleOffices(true);
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
            setLoadingSaleOffices(false);
        }
    };

    const handleSaleOfficeSearch = (keyword: string) => {
        setSaleOfficeKeyword(keyword);
        setSaleOfficePage(1);
        fetchSaleOffices(1, keyword, true);
    };

    const handleLoadMoreSaleOffices = () => {
        if (hasMoreSaleOffices && !loadingSaleOffices) {
            const nextPage = saleOfficePage + 1;
            setSaleOfficePage(nextPage);
            fetchSaleOffices(nextPage, saleOfficeKeyword);
        }
    };

    const formatSaleOfficeOptions = () => {
        // ใช้ saleOfficeOptions หากมีข้อมูล ไม่งั้นใช้ saleOfficeData prop เก่า
        const dataToUse = saleOfficeOptions.length > 0 ? saleOfficeOptions : saleOfficeData;

        return dataToUse.map((office: any) => ({
            id: office.id,
            value: office.id.toString(),
            label: `${office.sale_office_code} - ${office.name_th} - ${office.name_en}`
        }));
    };



    const handleSaleOfficeChange = (value: string) => {
        const saleOfficeId = parseInt(value) || 0;
        setSelectedSaleOfficeId(value);
        setForm({
            ...form,
            sale_office_id: saleOfficeId,
            stock_location_id: 0 // Reset stock location when sale office changes
        });

        // If cleared, fetch all sale offices and clear stock locations
        if (!value || value === '') {
            fetchSaleOffices(1, '', true);
            setStockLocationOptions([]);
        }
    };



    // Fetch stock location options with pagination and search
    const fetchStockLocations = async (page = 1, keyword = '', reset = false, saleOfficeId = selectedSaleOfficeId) => {
        setLoadingStockLocations(true);
        try {
            let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/stock-locations/pagination-with-search?page=${page}&pageSize=${stockLocationItemsPerPage}&keyword=${keyword}`;
            if (saleOfficeId) {
                url += `&sale_office_id=${saleOfficeId}`;
            }
            const response = await fetch(url);
            const data = await response.json();

            if (reset || page === 1) {
                setStockLocationOptions(data.data || []);

                // If we have a selected stock location ID, make sure it's in the options
                if (form.stock_location_id > 0 && data.data) {
                    const hasSelectedLocation = data.data.some((item: any) => item.id === form.stock_location_id);
                    if (!hasSelectedLocation) {
                        // Use stockLocationData prop as fallback first
                        const selectedFromProp = stockLocationData.find(sl => sl.id === form.stock_location_id);
                        if (selectedFromProp) {
                            setStockLocationOptions(prev => [selectedFromProp, ...prev]);
                        }
                    }
                }
            } else {
                // Append new data and filter duplicates
                const existingIds = new Set(stockLocationOptions.map((item: any) => item.id));
                const newData = (data.data || []).filter((item: any) => !existingIds.has(item.id));
                setStockLocationOptions(prev => [...prev, ...newData]);
            }

            setHasMoreStockLocations(page < (data.totalPages || 1));
        } catch (error) {
            console.error('Error fetching stock locations:', error);
            if (reset || page === 1) {
                setStockLocationOptions([]);
            }
        } finally {
            setLoadingStockLocations(false);
        }
    };

    const handleStockLocationSearch = (keyword: string) => {
        setStockLocationKeyword(keyword);
        setStockLocationPage(1);
        fetchStockLocations(1, keyword, true, selectedSaleOfficeId);
    };

    const handleLoadMoreStockLocations = () => {
        if (hasMoreStockLocations && !loadingStockLocations) {
            const nextPage = stockLocationPage + 1;
            setStockLocationPage(nextPage);
            fetchStockLocations(nextPage, stockLocationKeyword, false, selectedSaleOfficeId);
        }
    };

    const formatStockLocationOptions = () => {
        // ใช้ stockLocationOptions หากมีข้อมูล ไม่งั้นใช้ stockLocationData prop เก่า
        const dataToUse = stockLocationOptions.length > 0 ? stockLocationOptions : stockLocationData;

        return dataToUse.map((stockLocation: any) => ({
            id: stockLocation.id,
            value: stockLocation.id.toString(),
            label: `${stockLocation.site_short_code} - ${stockLocation.name_th} - ${stockLocation.name_en}`
        }));
    };

    // Handle stock location change
    const handleStockLocationChange = (value: string) => {
        const stockLocationId = parseInt(value) || 0;
        setForm({
            ...form,
            stock_location_id: stockLocationId,
        });
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        if (onStart) onStart();


        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/locations/${location.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                    {
                        stock_location_id: form.stock_location_id,
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
                let errorMessage = t('saveError');

                if (res.status === 409 || res.status === 400) {
                    if (errorData.message && Array.isArray(errorData.message)) {
                        const translatedMessages = errorData.message.map((msg: string) => {
                            switch (msg) {
                                case 'Site short code already exists in this stock location': return t('siteShortCodeExists');
                                case 'Site short code must not exceed 50 characters': return t('siteShortCodeTooLong');
                                case 'Description must not exceed 200 characters': return t('descriptionTooLong');
                                default: return msg;
                            }
                        });
                        errorMessage = translatedMessages.join(', ');
                    } else {
                        errorMessage = errorData.message || t('saveError');
                    }
                }

                throw new Error(errorMessage);
            }

            onSuccess();
            onClose();
        } catch (err) {
            console.error('Update location error:', err);
            setError(err instanceof Error ? err.message : t('saveError'));
            if (onError) onError();
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading) {
            onClose();
        }
    };

    if (!isVisible) return null;

    return (
        <div className="mt-6 p-4 border rounded shadow bg-white space-y-3">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-800">{t('editLocation')}</h2>
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
                        maxLength={50}
                    />
                    <div className="text-xs text-gray-500">
                        {form.site_short_code.length}/50 ตัวอักษร
                    </div>
                </div>

                {/* Sale Office */}
                <div className="space-y-2">
                    <label className="text-sm text-gray-600">Sale Office</label>
                    <PaginatedSelect
                        value={form.sale_office_id > 0 ? form.sale_office_id.toString() : ''}
                        placeholder={t('selectSaleOffice')}
                        disabled={loading || loadingSaleOffices}
                        options={formatSaleOfficeOptions()}
                        loading={loadingSaleOffices}
                        hasMore={hasMoreSaleOffices}
                        onValueChange={handleSaleOfficeChange}
                        onSearch={handleSaleOfficeSearch}
                        onLoadMore={handleLoadMoreSaleOffices}
                        className="w-full"
                    />
                </div>



                {/* Stock Location */}
                <div className="space-y-2">
                    <label className="text-sm text-gray-600">{t('stockLocation')}</label>
                    <PaginatedSelect
                        value={form.stock_location_id > 0 ? form.stock_location_id.toString() : ''}
                        placeholder={
                            !selectedSaleOfficeId
                                ? t('selectSaleOfficeFirst')
                                : stockLocationOptions.length === 0
                                    ? t('noStockLocationsFound')
                                    : t('selectStockLocation')
                        }
                        disabled={loading || loadingStockLocations || !selectedSaleOfficeId}
                        options={formatStockLocationOptions()}
                        loading={loadingStockLocations}
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
                    />
                    <div className="text-xs text-gray-500">
                        {form.description.length}/100 ตัวอักษร
                    </div>
                </div>


                <div className="flex items-center justify-between md:col-span-2">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">
                            {t('status')}
                        </span>
                        <Switch
                            checked={form.status}
                            onCheckedChange={(checked) => setForm({ ...form, status: checked })}
                            disabled={loading}
                        />
                        <span className="text-sm text-gray-600">
                            {form.status ? t('active') : t('inactive')}
                        </span>
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
