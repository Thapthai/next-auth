export interface StockLocation {
    id: number;
    department_id: number;
    sale_office_id: number;
    site_short_code: string;
    description: string | null;
    status: boolean;
    create_at: Date;
    update_at: Date;

    department: {
        department_code: string;
        name_th: string;
        name_en: string;
    };
    sale_office: {
        name_th: string;
        name_en: string;
    };
}

export interface CreateStockLocationData {
    department_id: number;
    sale_office_id: number;
    site_short_code: string;
    description?: string;
    status: boolean;
}

export interface UpdateStockLocationData {
    department_id?: number;
    sale_office_id?: number;
    site_short_code?: string;
    description?: string | null;
    status?: boolean;
}