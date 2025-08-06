export type FactorySaleOffice = {
    id: number;
    sale_office_id: number;
    factory_id: number;
    status: boolean;
    create_at?: string;
    update_at?: string;
    // Relations
    sale_office?: {
        id: number;
        site_office_name_th: string;
        site_office_name_en: string;
        site_code: string;
    };
    factory?: {
        id: number;
        name_th: string;
        name_en: string;
    };
};