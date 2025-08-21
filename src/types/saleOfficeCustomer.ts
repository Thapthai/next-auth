export interface SaleOfficeCustomer {
    id: number;
    sale_office_id: number;
    customer_id: number;
    status: boolean;
    create_at: Date;
    update_at: Date;
    sale_office?: {
        id: number;
        name_th: string;
        sale_office_code: string;
    };
    customer?: {
        id: number;
        name_th: string;
        name_en: string;
        site_short_code: string;
        email: string;
        phone: string;
    };
}
