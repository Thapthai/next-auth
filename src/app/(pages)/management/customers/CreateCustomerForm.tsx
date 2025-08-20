'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconDeviceFloppy, IconX } from "@tabler/icons-react";
import { Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { PaginatedSelect } from "@/components/ui/paginated-select";
import { useTranslations } from "next-intl";


interface CreateCustomerFormProps {
    isVisible: boolean;
    onClose: () => void;
    onSuccess: () => void;
    onStart?: () => void;
    onError?: () => void;
}

export default function CreateCustomerForm({ isVisible, onClose, onSuccess, onStart, onError }: CreateCustomerFormProps) {
    const t = useTranslations("Customers.CreateCustomerForm");

    const [formData, setFormData] = useState({
        customer_group_id: '',
        site_short_code: '',
        name_th: '',
        name_en: '',
        sale_office_id: '',
        department_id: '',
        payment_type_id: '',
        address: '',
        tel: '',
        tax_no: '',
        tax_id: '',
        tax_id_type: '',
        remark: '',
        email: '',
        status: true
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Customer Groups options
    const [customerGroupOptions, setCustomerGroupOptions] = useState<any[]>([]);
    const [loadingCustomerGroups, setLoadingCustomerGroups] = useState(false);
    const [customerGroupPage, setCustomerGroupPage] = useState(1);
    const [customerGroupKeyword, setCustomerGroupKeyword] = useState('');
    const [hasMoreCustomerGroups, setHasMoreCustomerGroups] = useState(true);
    const [customerGroupItemsPerPage] = useState(10);

    // Sale Offices options
    const [saleOfficeOptions, setSaleOfficeOptions] = useState<any[]>([]);
    const [loadingSaleOffices, setLoadingSaleOffices] = useState(false);
    const [saleOfficePage, setSaleOfficePage] = useState(1);
    const [saleOfficeKeyword, setSaleOfficeKeyword] = useState('');
    const [hasMoreSaleOffices, setHasMoreSaleOffices] = useState(true);
    const [saleOfficeItemsPerPage] = useState(10);

    // Departments options (depends on sale office)
    const [departmentOptions, setDepartmentOptions] = useState<any[]>([]);
    const [loadingDepartments, setLoadingDepartments] = useState(false);
    const [departmentPage, setDepartmentPage] = useState(1);
    const [departmentKeyword, setDepartmentKeyword] = useState('');
    const [hasMoreDepartments, setHasMoreDepartments] = useState(true);
    const [departmentItemsPerPage] = useState(10);

    // Payment Types options
    const [paymentTypeOptions, setPaymentTypeOptions] = useState<any[]>([]);
    const [loadingPaymentTypes, setLoadingPaymentTypes] = useState(false);
    const [paymentTypePage, setPaymentTypePage] = useState(1);
    const [paymentTypeKeyword, setPaymentTypeKeyword] = useState('');
    const [hasMorePaymentTypes, setHasMorePaymentTypes] = useState(true);
    const [paymentTypeItemsPerPage] = useState(10);

    // Fetch Customer Groups with pagination and search
    const fetchCustomerGroups = async (page = 1, keyword = '', reset = false) => {
        setLoadingCustomerGroups(true);
        try {
            const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/customer-groups/pagination-with-search?page=${page}&pageSize=${customerGroupItemsPerPage}&keyword=${keyword}`;
            const response = await fetch(url);
            const data = await response.json();

            if (reset || page === 1) {
                setCustomerGroupOptions(data.data || []);
            } else {
                const existingIds = new Set(customerGroupOptions.map((item: any) => item.id));
                const newData = (data.data || []).filter((item: any) => !existingIds.has(item.id));
                setCustomerGroupOptions(prev => [...prev, ...newData]);
            }

            setHasMoreCustomerGroups(page < (data.totalPages || 1));
        } catch (error) {
            console.error('Error fetching customer groups:', error);
            if (reset || page === 1) {
                setCustomerGroupOptions([]);
            }
        } finally {
            setLoadingCustomerGroups(false);
        }
    };

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

    // Fetch Departments with pagination and search (filtered by sale office)
    const fetchDepartments = async (page = 1, keyword = '', reset = false, saleOfficeId?: string) => {
        if (!saleOfficeId) {
            setDepartmentOptions([]);
            return;
        }

        setLoadingDepartments(true);
        try {
            let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/departments/sale-offices?page=${page}&pageSize=${departmentItemsPerPage}&keyword=${keyword}&saleOfficeId=${saleOfficeId}`;
            const response = await fetch(url);
            const data = await response.json();

            if (reset || page === 1) {
                setDepartmentOptions(data.items || []);
            } else {
                const existingIds = new Set(departmentOptions.map((item: any) => item.id));
                const newData = (data.items || []).filter((item: any) => !existingIds.has(item.id));
                setDepartmentOptions(prev => [...prev, ...newData]);
            }

            // Calculate pagination info from total and items
            const totalPages = data.total ? Math.ceil(data.total / departmentItemsPerPage) : 1;
            setHasMoreDepartments(page < totalPages);
        } catch (error) {
            console.error('Error fetching departments:', error);
            if (reset || page === 1) {
                setDepartmentOptions([]);
            }
        } finally {
            setLoadingDepartments(false);
        }
    };

    // Fetch Payment Types with pagination and search  
    const fetchPaymentTypes = async (page = 1, keyword = '', reset = false) => {
        setLoadingPaymentTypes(true);
        try {
            const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/payment-types/pagination-with-search?page=${page}&pageSize=${paymentTypeItemsPerPage}&keyword=${keyword}`;
            const response = await fetch(url);
            const data = await response.json();

            if (reset || page === 1) {
                setPaymentTypeOptions(data.data || []);
            } else {
                const existingIds = new Set(paymentTypeOptions.map((item: any) => item.id));
                const newData = (data.data || []).filter((item: any) => !existingIds.has(item.id));
                setPaymentTypeOptions(prev => [...prev, ...newData]);
            }

            setHasMorePaymentTypes(page < (data.totalPages || 1));
        } catch (error) {
            console.error('Error fetching payment types:', error);
            if (reset || page === 1) {
                setPaymentTypeOptions([]);
            }
        } finally {
            setLoadingPaymentTypes(false);
        }
    };

    // Load initial data when component mounts
    useEffect(() => {
        if (isVisible) {
            fetchCustomerGroups(1, '', true);
            fetchSaleOffices(1, '', true);
            fetchPaymentTypes(1, '', true);
        }
    }, [isVisible]);

    // When sale office changes, reset department and fetch departments for that sale office
    useEffect(() => {
        // Reset department selection when sale office changes
        setFormData(prev => ({
            ...prev,
            department_id: ''
        }));

        // Fetch departments for the selected sale office
        if (formData.sale_office_id) {
            fetchDepartments(1, '', true, formData.sale_office_id);
        } else {
            setDepartmentOptions([]);
        }
    }, [formData.sale_office_id]);

    // Handle Customer Group search and pagination
    const handleCustomerGroupSearch = (keyword: string) => {
        setCustomerGroupKeyword(keyword);
        setCustomerGroupPage(1);
        fetchCustomerGroups(1, keyword || '', true);
    };

    const handleLoadMoreCustomerGroups = () => {
        if (hasMoreCustomerGroups && !loadingCustomerGroups) {
            const nextPage = customerGroupPage + 1;
            setCustomerGroupPage(nextPage);
            fetchCustomerGroups(nextPage, customerGroupKeyword, false);
        }
    };

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

    // Handle Department search and pagination
    const handleDepartmentSearch = (keyword: string) => {
        setDepartmentKeyword(keyword);
        setDepartmentPage(1);
        fetchDepartments(1, keyword || '', true, formData.sale_office_id);
    };

    const handleLoadMoreDepartments = () => {
        if (hasMoreDepartments && !loadingDepartments) {
            const nextPage = departmentPage + 1;
            setDepartmentPage(nextPage);
            fetchDepartments(nextPage, departmentKeyword, false, formData.sale_office_id);
        }
    };

    // Handle Payment Type search and pagination
    const handlePaymentTypeSearch = (keyword: string) => {
        setPaymentTypeKeyword(keyword);
        setPaymentTypePage(1);
        fetchPaymentTypes(1, keyword || '', true);
    };

    const handleLoadMorePaymentTypes = () => {
        if (hasMorePaymentTypes && !loadingPaymentTypes) {
            const nextPage = paymentTypePage + 1;
            setPaymentTypePage(nextPage);
            fetchPaymentTypes(nextPage, paymentTypeKeyword, false);
        }
    };

    // Format options for PaginatedSelect
    const formatCustomerGroupOptions = () => {
        return customerGroupOptions.map((group: any) => ({
            id: group.id,
            value: group.id.toString(),
            label: `${group.name_th} - ${group.name_en}`
        }));
    };

    const formatSaleOfficeOptions = () => {
        return saleOfficeOptions.map((office: any) => ({
            id: office.id,
            value: office.id.toString(),
            label: `${office.sale_office_code} - ${office.name_th}`
        }));
    };

    const formatDepartmentOptions = () => {
        return departmentOptions.map((department: any) => ({
            id: department.id,
            value: department.id.toString(),
            label: `${department.department_code} - ${department.name_th}`
        }));
    };

    const formatPaymentTypeOptions = () => {
        return paymentTypeOptions.map((type: any) => ({
            id: type.id,
            value: type.id.toString(),
            label: `${type.name_th} - ${type.name_en}`
        }));
    };

    // Format tax number to 0-0000-00000-00-0 pattern
    const formatTaxNumber = (value: string) => {
        // Remove all non-digit characters
        const digits = value.replace(/\D/g, '');

        // Limit to 13 digits
        const limitedDigits = digits.slice(0, 13);

        // Apply formatting based on length
        if (limitedDigits.length === 0) return '';
        if (limitedDigits.length <= 1) return limitedDigits;
        if (limitedDigits.length <= 5) return `${limitedDigits[0]}-${limitedDigits.slice(1)}`;
        if (limitedDigits.length <= 10) return `${limitedDigits[0]}-${limitedDigits.slice(1, 5)}-${limitedDigits.slice(5)}`;
        if (limitedDigits.length <= 12) return `${limitedDigits[0]}-${limitedDigits.slice(1, 5)}-${limitedDigits.slice(5, 10)}-${limitedDigits.slice(10)}`;
        return `${limitedDigits[0]}-${limitedDigits.slice(1, 5)}-${limitedDigits.slice(5, 10)}-${limitedDigits.slice(10, 12)}-${limitedDigits.slice(12)}`;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        // Special handling for tax_no field
        if (name === 'tax_no') {
            const formattedValue = formatTaxNumber(value);
            setFormData(prev => ({
                ...prev,
                [name]: formattedValue
            }));
        } else if (name === 'tax_id') {
            const formattedValue = formatTaxNumber(value);
            setFormData(prev => ({
                ...prev,
                [name]: formattedValue
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (onStart) onStart();

        // Validate tax numbers have exactly 13 digits
        const taxNoDigits = formData.tax_no.replace(/\D/g, '');
        const taxIdDigits = formData.tax_id.replace(/\D/g, '');

        if (taxNoDigits.length !== 13) {
            setError(t('validation.taxNoRequired'));
            setLoading(false);
            return;
        }

        if (taxIdDigits.length !== 13) {
            setError(t('validation.taxIdRequired'));
            setLoading(false);
            return;
        }

        try {
            // Convert empty strings to undefined for optional fields
            const submitData = {
                ...formData,
                customer_group_id: formData.customer_group_id ? Number(formData.customer_group_id) : undefined,
                sale_office_id: formData.sale_office_id ? Number(formData.sale_office_id) : undefined,
                department_id: formData.department_id ? Number(formData.department_id) : undefined,
                payment_type_id: formData.payment_type_id ? Number(formData.payment_type_id) : undefined,
                tax_no: formData.tax_no.replace(/\D/g, ''), // Remove dashes for API
                tax_id: formData.tax_id.replace(/\D/g, ''), // Remove dashes for API
                remark: formData.remark || undefined,
            };

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/customers`, {
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
                                case 'Email already exists':
                                    return 'อีเมลนี้มีอยู่ในระบบแล้ว';
                                case 'Site short code already exists':
                                    return 'รหัสไซต์นี้มีอยู่แล้ว';
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
                customer_group_id: '',
                site_short_code: '',
                name_th: '',
                name_en: '',
                sale_office_id: '',
                department_id: '',
                payment_type_id: '',
                address: '',
                tel: '',
                tax_no: '',
                tax_id: '',
                tax_id_type: '',
                remark: '',
                email: '',
                status: true
            });
            onSuccess();
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : t('errors.createFailed'));
            if (onError) onError();
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading) {
            setFormData({
                customer_group_id: '',
                site_short_code: '',
                name_th: '',
                name_en: '',
                sale_office_id: '',
                department_id: '',
                payment_type_id: '',
                address: '',
                tel: '',
                tax_no: '',
                tax_id: '',
                tax_id_type: '',
                remark: '',
                email: '',
                status: true
            });
            setError(null);
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

                    {/* site_short_code */}
                    <div className="space-y-2">
                        <Label htmlFor="site_short_code" className="text-sm text-gray-600">{t("labels.siteCode")}</Label>
                        <Input
                            id="site_short_code"
                            name="site_short_code"
                            value={formData.site_short_code}
                            onChange={handleInputChange}
                            placeholder={t("placeholders.siteCode")}
                            required
                            disabled={loading}
                            maxLength={50}
                            className="w-full border rounded px-2 py-1"
                        />
                        <div className="text-xs text-gray-500">
                            {formData.site_short_code.length}/50 {t("validation.maxLength")}
                        </div>
                    </div>

                    {/* name_th */}
                    <div className="space-y-2">
                        <Label htmlFor="name_th" className="text-sm text-gray-600">{t("labels.nameTh")}</Label>
                        <Input
                            id="name_th"
                            name="name_th"
                            value={formData.name_th}
                            onChange={handleInputChange}
                            placeholder={t("placeholders.nameTh")}
                            required
                            disabled={loading}
                            maxLength={100}
                            className="w-full border rounded px-2 py-1"
                        />
                        <div className="text-xs text-gray-500">
                            {formData.name_th.length}/100 {t("validation.maxLength")}
                        </div>
                    </div>

                    {/* name_en */}
                    <div className="space-y-2">
                        <Label htmlFor="name_en" className="text-sm text-gray-600">{t("labels.nameEn")}</Label>
                        <Input
                            id="name_en"
                            name="name_en"
                            value={formData.name_en}
                            onChange={handleInputChange}
                            placeholder={t("placeholders.nameEn")}
                            required
                            disabled={loading}
                            maxLength={100}
                            className="w-full border rounded px-2 py-1"
                        />
                        <div className="text-xs text-gray-500">
                            {formData.name_en.length}/100 {t("validation.maxLength")}
                        </div>
                    </div>

                    {/* email */}
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm text-gray-600">{t("labels.email")}</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder={t("placeholders.email")}
                            required
                            disabled={loading}
                            className="w-full border rounded px-2 py-1"
                        />
                    </div>

                    {/* tel */}
                    <div className="space-y-2">
                        <Label htmlFor="tel" className="text-sm text-gray-600">{t("labels.phone")}</Label>
                        <Input
                            id="tel"
                            name="tel"
                            value={formData.tel}
                            onChange={handleInputChange}
                            placeholder={t("placeholders.phone")}
                            required
                            disabled={loading}
                            maxLength={20}
                            className="w-full border rounded px-2 py-1"
                        />
                        <div className="text-xs text-gray-500">
                            {formData.tel.length}/20 {t("validation.maxLength")}
                        </div>
                    </div>

                    {/* tax_no */}
                    <div className="space-y-2">
                        <Label htmlFor="tax_no" className="text-sm text-gray-600">{t("labels.taxNo")}</Label>
                        <Input
                            id="tax_no"
                            name="tax_no"
                            value={formData.tax_no}
                            onChange={handleInputChange}
                            placeholder={t("placeholders.taxNo")}
                            required
                            disabled={loading}
                            maxLength={17}
                            minLength={17}
                            className="w-full border rounded px-2 py-1"
                        />
                        <div className="text-xs text-gray-500">
                            13 {t("validation.digits")} ({t("validation.format")})
                            {formData.tax_no.replace(/\D/g, '').length < 13 && formData.tax_no.length > 0 && (
                                <span className="text-red-500 block">{t('validation.required13Digits')}</span>
                            )}
                        </div>
                    </div>

                    {/* tax_id */}
                    <div className="space-y-2">
                        <Label htmlFor="tax_id" className="text-sm text-gray-600">
                            {formData.tax_id_type === "individual" ? t("labels.national_id") : t("labels.tax_id")}
                        </Label>
                        <Input
                            id="tax_id"
                            name="tax_id"
                            value={formData.tax_id}
                            onChange={handleInputChange}
                            placeholder={
                                formData.tax_id_type === "individual"
                                    ? t("placeholders.national_id")
                                    : formData.tax_id_type === "juristic_person"
                                        ? t("placeholders.tax_id_juristic")
                                        : formData.tax_id_type === "foreign_individual"
                                            ? t("placeholders.tax_id_foreign")
                                            : formData.tax_id_type === "branch_office"
                                                ? t("placeholders.tax_id_branch")
                                                : t("placeholders.tax_id_default")
                            }
                            required
                            disabled={loading}
                            maxLength={17}
                            minLength={17}
                            className="w-full border rounded px-2 py-1"
                        />
                        <div className="text-xs text-gray-500">
                            13 {t("validation.digits")} ({t("validation.format")})
                            {formData.tax_id.replace(/\D/g, '').length < 13 && formData.tax_id.length > 0 && (
                                <span className="text-red-500 block">
                                    {formData.tax_id_type === "individual"
                                        ? t("validation.national_id_required")
                                        : t("validation.tax_id_required")
                                    }
                                </span>
                            )}
                        </div>
                    </div>

                    {/* tax_id_type */}
                    <div className="space-y-2">
                        <Label htmlFor="tax_id_type" className="text-sm text-gray-600">{t("labels.taxIdType")}</Label>
                        <PaginatedSelect
                            value={formData.tax_id_type}
                            placeholder={t("tax_id_type.select")}
                            disabled={loading}
                            options={[
                                {
                                    id: 1,
                                    value: "individual",
                                    label: t("tax_id_type.individual")
                                },
                                {
                                    id: 2,
                                    value: "juristic_person",
                                    label: t("tax_id_type.juristic_person")
                                },
                                {
                                    id: 3,
                                    value: "foreign_individual",
                                    label: t("tax_id_type.foreign_individual")
                                },
                                {
                                    id: 4,
                                    value: "branch_office",
                                    label: t("tax_id_type.branch_office")
                                }
                            ]}
                            loading={false}
                            hasMore={false}
                            onValueChange={(value) => setFormData({ ...formData, tax_id_type: value })}
                            onSearch={() => { }} // No search needed for static options
                            onLoadMore={() => { }} // No load more needed for static options
                            className="w-full"
                            showClearButton={false}
                        />
                        <div className="text-xs text-gray-500">
                            {formData.tax_id_type === "individual" && t("tax_id_type.individual_description")}
                            {formData.tax_id_type === "juristic_person" && t("tax_id_type.juristic_person_description")}
                            {formData.tax_id_type === "foreign_individual" && t("tax_id_type.foreign_individual_description")}
                            {formData.tax_id_type === "branch_office" && t("tax_id_type.branch_office_description")}
                        </div>
                    </div>

                    {/* customer_group_id */}
                    <div className="space-y-2">
                        <Label htmlFor="customer_group_id" className="text-sm text-gray-600">{t("labels.customerGroup")}</Label>
                        <PaginatedSelect
                            value={formData.customer_group_id}
                            placeholder={t("placeholders.customerGroup")}
                            disabled={loading || loadingCustomerGroups}
                            options={formatCustomerGroupOptions()}
                            loading={loadingCustomerGroups}
                            hasMore={hasMoreCustomerGroups}
                            onValueChange={(value) => setFormData({ ...formData, customer_group_id: value })}
                            onSearch={handleCustomerGroupSearch}
                            onLoadMore={handleLoadMoreCustomerGroups}
                            className="w-full"
                            showClearButton={true}
                            clearButtonText={t("buttons.clear")}
                        />
                    </div>

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
                            showClearButton={true}
                            clearButtonText={t("buttons.clear")}
                        />
                    </div>

                    {/* department_id */}
                    <div className="space-y-2">
                        <Label htmlFor="department_id" className="text-sm text-gray-600">{t("labels.department")}</Label>
                        <PaginatedSelect
                            value={formData.department_id}
                            placeholder={
                                !formData.sale_office_id
                                    ? t("placeholders.selectSaleOfficeFirst")
                                    : departmentOptions.length === 0 && !loadingDepartments
                                        ? t("placeholders.noDepartments")
                                        : t("placeholders.department")
                            }
                            disabled={loading || loadingDepartments || !formData.sale_office_id}
                            options={formatDepartmentOptions()}
                            loading={loadingDepartments}
                            hasMore={hasMoreDepartments}
                            onValueChange={(value) => setFormData({ ...formData, department_id: value })}
                            onSearch={handleDepartmentSearch}
                            onLoadMore={handleLoadMoreDepartments}
                            className="w-full"
                            showClearButton={true}
                            clearButtonText={t("buttons.clear")}
                        />
                    </div>

                    {/* payment_type_id */}
                    <div className="space-y-2">
                        <Label htmlFor="payment_type_id" className="text-sm text-gray-600">{t("labels.paymentType")}</Label>
                        <PaginatedSelect
                            value={formData.payment_type_id}
                            placeholder={t("placeholders.paymentType")}
                            disabled={loading || loadingPaymentTypes}
                            options={formatPaymentTypeOptions()}
                            loading={loadingPaymentTypes}
                            hasMore={hasMorePaymentTypes}
                            onValueChange={(value) => setFormData({ ...formData, payment_type_id: value })}
                            onSearch={handlePaymentTypeSearch}
                            onLoadMore={handleLoadMorePaymentTypes}
                            className="w-full"
                            showClearButton={true}
                            clearButtonText={t("buttons.clear")}
                        />
                    </div>

                    {/* address */}
                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="address" className="text-sm text-gray-600">{t("labels.address")}</Label>
                        <textarea
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            placeholder={t("placeholders.address")}
                            required
                            disabled={loading}
                            maxLength={100}
                            rows={3}
                            className="w-full border rounded px-2 py-1"
                        />
                        <div className="text-xs text-gray-500">
                            {formData.address.length}/100 {t("validation.maxLength")}
                        </div>
                    </div>

                    {/* remark */}
                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="remark" className="text-sm text-gray-600">{t("labels.remark")}</Label>
                        <textarea
                            id="remark"
                            name="remark"
                            value={formData.remark}
                            onChange={handleInputChange}
                            placeholder={t("placeholders.remark")}
                            disabled={loading}
                            maxLength={100}
                            rows={2}
                            className="w-full border rounded px-2 py-1"
                        />
                        <div className="text-xs text-gray-500">
                            {formData.remark.length}/100 {t("validation.maxLength")}
                        </div>
                    </div>

                    {/* status */}
                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="status" className="text-sm text-gray-600">สถานะ</Label>
                        <div className="flex items-center gap-2">
                            <Switch
                                id="status"
                                name="status"
                                onCheckedChange={(checked) => setFormData({ ...formData, status: checked })}
                                disabled={loading}
                                checked={formData.status}
                            />
                            <span className="text-sm text-gray-600">
                                {formData.status ? t('status.active') : t('status.inactive')}
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
