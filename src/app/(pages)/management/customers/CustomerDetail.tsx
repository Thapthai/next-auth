'use client';

import { useEffect, useState } from "react";
import { Customer } from "@/types/customer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { IconDeviceFloppy, IconX } from "@tabler/icons-react";
import { Loader2 } from "lucide-react";
import { PaginatedSelect } from "@/components/ui/paginated-select";
import { useTranslations } from "next-intl";

type Props = {
    customer: Customer | null;
    refresh: () => void;
    onClose: () => void;
};

export default function CustomerDetail({ customer, refresh, onClose }: Props) {

    const t = useTranslations("Customers.CustomerDetail");

    const [form, setForm] = useState({
        customer_group_id: "",
        site_short_code: "",
        name_th: "",
        name_en: "",
        sale_office_id: "",
        department_id: "",
        payment_type_id: "",
        address: "",
        tel: "",
        tax_no: "",
        tax_id: "",
        tax_id_type: "",
        remark: "",
        email: "",
        status: true,
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

    useEffect(() => {
        if (customer) {
            setForm({
                customer_group_id: customer.customer_group_id?.toString() || "",
                site_short_code: customer.site_short_code || "",
                name_th: customer.name_th || "",
                name_en: customer.name_en || "",
                sale_office_id: customer.sale_office_id?.toString() || "",
                department_id: customer.department_id?.toString() || "",
                payment_type_id: customer.payment_type_id?.toString() || "",
                address: customer.address || "",
                tel: customer.tel || "",
                tax_no: formatTaxNumber(customer.tax_no || ""),
                tax_id: formatTaxNumber(customer.tax_id || ""),
                tax_id_type: customer.tax_id_type || "",
                remark: customer.remark || "",
                email: customer.email || "",
                status: customer.status ?? true,
            });
        }
    }, [customer]);

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

    // Load initial data when component becomes visible
    useEffect(() => {
        if (customer) {
            fetchCustomerGroups(1, '', true);
            fetchSaleOffices(1, '', true);
            fetchPaymentTypes(1, '', true);
        }
    }, [customer]);

    // When sale office changes, reset department and fetch departments for that sale office
    useEffect(() => {
        // Reset department selection when sale office changes
        if (customer && form.sale_office_id !== customer.sale_office_id?.toString()) {
            setForm(prev => ({
                ...prev,
                department_id: ''
            }));
        }

        // Fetch departments for the selected sale office
        if (form.sale_office_id) {
            fetchDepartments(1, '', true, form.sale_office_id);
        } else {
            setDepartmentOptions([]);
        }
    }, [form.sale_office_id, customer]);

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
        fetchDepartments(1, keyword || '', true, form.sale_office_id);
    };

    const handleLoadMoreDepartments = () => {
        if (hasMoreDepartments && !loadingDepartments) {
            const nextPage = departmentPage + 1;
            setDepartmentPage(nextPage);
            fetchDepartments(nextPage, departmentKeyword, false, form.sale_office_id);
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
            setForm(prev => ({
                ...prev,
                [name]: formattedValue
            }));
        } else {
            setForm(prev => ({
                ...prev,
                [name]: value
            }));
        }


        if (name === 'tax_id') {
            const formattedValue = formatTaxNumber(value);
            setForm(prev => ({
                ...prev,
                [name]: formattedValue
            }));
        } else {
            setForm(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!customer) return;

        setLoading(true);
        setError(null);

        // Validate tax numbers have exactly 13 digits
        const taxNoDigits = form.tax_no.replace(/\D/g, '');
        const taxIdDigits = form.tax_id.replace(/\D/g, '');

        if (taxNoDigits.length !== 13) {
            setError(t('validation.taxNoRequired'));
            setLoading(false);
            return;
        }

        if (taxIdDigits.length !== 13) {
            setError('เลขประจำตัวต้องมี 13 หลักเท่านั้น');
            setLoading(false);
            return;
        }

        try {
            // Convert empty strings to undefined for optional fields
            const submitData = {
                ...form,
                customer_group_id: form.customer_group_id ? Number(form.customer_group_id) : undefined,
                sale_office_id: form.sale_office_id ? Number(form.sale_office_id) : undefined,
                department_id: form.department_id ? Number(form.department_id) : undefined,
                payment_type_id: form.payment_type_id ? Number(form.payment_type_id) : undefined,
                tax_no: form.tax_no.replace(/\D/g, ''),
                tax_id: form.tax_id.replace(/\D/g, ''),
                remark: form.remark || undefined,
            };

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/customers/${customer.id}`, {
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
                                case 'Email already exists':
                                    return 'อีเมลนี้มีอยู่ในระบบแล้ว';
                                case 'Site short code already exists':
                                    return 'รหัสไซต์นี้มีอยู่แล้ว';
                                case 'Site short code must not exceed 50 characters':
                                    return 'รหัสไซต์ต้องไม่เกิน 50 ตัวอักษร';
                                case 'Thai name must not exceed 100 characters':
                                    return 'ชื่อไทยต้องไม่เกิน 100 ตัวอักษร';
                                case 'English name must not exceed 100 characters':
                                    return 'ชื่ออังกฤษต้องไม่เกิน 100 ตัวอักษร';
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
            console.error('Update customer error:', err);
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

    if (!customer) return null;




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
                            value={form.site_short_code}
                            onChange={handleInputChange}
                            placeholder={t("placeholders.siteCode")}
                            required
                            disabled={loading}
                            maxLength={50}
                            className="w-full"
                        />
                        <div className="text-xs text-gray-500">
                            {form.site_short_code.length}/50 {t("validation.maxLength")}
                        </div>
                    </div>

                    {/* name_th */}
                    <div className="space-y-2">
                        <Label htmlFor="name_th" className="text-sm text-gray-600">{t("labels.nameTh")}</Label>
                        <Input
                            id="name_th"
                            name="name_th"
                            value={form.name_th}
                            onChange={handleInputChange}
                            placeholder={t("placeholders.nameTh")}
                            required
                            disabled={loading}
                            maxLength={100}
                            className="w-full"
                        />
                        <div className="text-xs text-gray-500">
                            {form.name_th.length}/100 {t("validation.maxLength")}
                        </div>
                    </div>

                    {/* name_en */}
                    <div className="space-y-2">
                        <Label htmlFor="name_en" className="text-sm text-gray-600">{t("labels.nameEn")}</Label>
                        <Input
                            id="name_en"
                            name="name_en"
                            value={form.name_en}
                            onChange={handleInputChange}
                            placeholder={t("placeholders.nameEn")}
                            required
                            disabled={loading}
                            maxLength={100}
                            className="w-full"
                        />
                        <div className="text-xs text-gray-500">
                            {form.name_en.length}/100 {t("validation.maxLength")}
                        </div>
                    </div>

                    {/* email */}
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm text-gray-600">{t("labels.email")}</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleInputChange}
                            placeholder={t("placeholders.email")}
                            required
                            disabled={loading}
                            maxLength={50}
                            className="w-full"
                        />
                        <div className="text-xs text-gray-500">
                            {form.email.length}/50 {t("validation.maxLength")}
                        </div>
                    </div>

                    {/* tel */}
                    <div className="space-y-2">
                        <Label htmlFor="tel" className="text-sm text-gray-600">{t("labels.phone")}</Label>
                        <Input
                            id="tel"
                            name="tel"
                            value={form.tel}
                            onChange={handleInputChange}
                            placeholder={t("placeholders.phone")}
                            required
                            disabled={loading}
                            maxLength={20}
                            className="w-full"
                        />
                        <div className="text-xs text-gray-500">
                            {form.tel.length}/20 {t("validation.maxLength")}
                        </div>
                    </div>

                    {/* tax_no */}
                    <div className="space-y-2">
                        <Label htmlFor="tax_no" className="text-sm text-gray-600">{t("labels.taxNo")}</Label>
                        <Input
                            id="tax_no"
                            name="tax_no"
                            value={form.tax_no}
                            onChange={handleInputChange}
                            placeholder={t("placeholders.taxNo")}
                            required
                            disabled={loading}
                            maxLength={13}
                            minLength={13}
                            className="w-full"
                        />
                        <div className="text-xs text-gray-500">
                            13 {t("validation.digits")} ({t("validation.format")})
                            {form.tax_no.replace(/\D/g, '').length < 13 && form.tax_no.length > 0 && (
                                <span className="text-red-500 block">{t('validation.required13Digits')}</span>
                            )}
                        </div>
                    </div>

                    {/* tax_id */}
                    <div className="space-y-2">
                        <Label htmlFor="tax_id" className="text-sm text-gray-600">
                            {form.tax_id_type === "individual" ? t("labels.national_id") : t("labels.tax_id")}
                        </Label>
                        <Input
                            id="tax_id"
                            name="tax_id"
                            value={form.tax_id}
                            onChange={handleInputChange}
                            placeholder={
                                form.tax_id_type === "individual" 
                                    ? t("placeholders.national_id")
                                    : form.tax_id_type === "juristic_person"
                                    ? t("placeholders.tax_id_juristic")
                                    : form.tax_id_type === "foreign_individual"
                                    ? t("placeholders.tax_id_foreign")
                                    : form.tax_id_type === "branch_office"
                                    ? t("placeholders.tax_id_branch")
                                    : t("placeholders.tax_id_default")
                            }
                            required
                            disabled={loading}
                            maxLength={17}
                            minLength={17}
                            className="w-full"
                        />
                        <div className="text-xs text-gray-500">
                            13 {t("validation.digits")} ({t("validation.format")})
                            {form.tax_id.replace(/\D/g, '').length < 13 && form.tax_id.length > 0 && (
                                <span className="text-red-500 block">
                                    {form.tax_id_type === "individual" 
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
                            value={form.tax_id_type}
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
                            onValueChange={(value) => setForm({ ...form, tax_id_type: value })}
                            onSearch={() => {}} // No search needed for static options
                            onLoadMore={() => {}} // No load more needed for static options
                            className="w-full"
                            showClearButton={false}
                        />
                        <div className="text-xs text-gray-500">
                            {form.tax_id_type === "individual" && t("tax_id_type.individual_description")}
                            {form.tax_id_type === "juristic_person" && t("tax_id_type.juristic_person_description")}
                            {form.tax_id_type === "foreign_individual" && t("tax_id_type.foreign_individual_description")}
                            {form.tax_id_type === "branch_office" && t("tax_id_type.branch_office_description")}
                        </div>
                    </div>

                    {/* customer_group_id */}
                    <div className="space-y-2">
                        <Label htmlFor="customer_group_id" className="text-sm text-gray-600">{t("labels.customerGroup")}</Label>
                        <PaginatedSelect
                            value={form.customer_group_id}
                            placeholder={t("placeholders.customerGroup")}
                            disabled={loading || loadingCustomerGroups}
                            options={formatCustomerGroupOptions()}
                            loading={loadingCustomerGroups}
                            hasMore={hasMoreCustomerGroups}
                            onValueChange={(value) => setForm({ ...form, customer_group_id: value })}
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
                            showClearButton={true}
                            clearButtonText={t("buttons.clear")}
                        />
                    </div>

                    {/* department_id */}
                    <div className="space-y-2">
                        <Label htmlFor="department_id" className="text-sm text-gray-600">{t("labels.department")}</Label>
                        <PaginatedSelect
                            value={form.department_id}
                            placeholder={
                                !form.sale_office_id
                                    ? t("placeholders.selectSaleOfficeFirst")
                                    : departmentOptions.length === 0 && !loadingDepartments
                                        ? t("placeholders.noDepartments")
                                        : t("placeholders.department")
                            }
                            disabled={loading || loadingDepartments || !form.sale_office_id}
                            options={formatDepartmentOptions()}
                            loading={loadingDepartments}
                            hasMore={hasMoreDepartments}
                            onValueChange={(value) => setForm({ ...form, department_id: value })}
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
                            value={form.payment_type_id}
                            placeholder={t("placeholders.paymentType")}
                            disabled={loading || loadingPaymentTypes}
                            options={formatPaymentTypeOptions()}
                            loading={loadingPaymentTypes}
                            hasMore={hasMorePaymentTypes}
                            onValueChange={(value) => setForm({ ...form, payment_type_id: value })}
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
                            value={form.address}
                            onChange={handleInputChange}
                            placeholder={t("placeholders.address")}
                            required
                            disabled={loading}
                            maxLength={100}
                            rows={3}
                            className="w-full border rounded px-2 py-1"
                        />
                        <div className="text-xs text-gray-500">
                            {form.address.length}/100 {t("validation.maxLength")}
                        </div>
                    </div>

                    {/* remark */}
                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="remark" className="text-sm text-gray-600">{t("labels.remark")}</Label>
                        <textarea
                            id="remark"
                            name="remark"
                            value={form.remark}
                            onChange={handleInputChange}
                            placeholder={t("placeholders.remark")}
                            disabled={loading}
                            maxLength={100}
                            rows={2}
                            className="w-full border rounded px-2 py-1"
                        />
                        <div className="text-xs text-gray-500">
                            {form.remark.length}/100 {t("validation.maxLength")}
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
                                {form.status ? t('status.active') : t('status.inactive')}
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
