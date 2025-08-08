export interface StockLocation {
    id: number;
    sale_office_id: number;
    site_short_code: string;
    description: string | null;
    status: boolean;
    create_at: Date;
    update_at: Date;

    sale_office: {
        name_th: string;
        name_en: string;
        sale_office_code: string;
    };
}

export interface CreateStockLocationData {
    sale_office_id: number;
    site_short_code: string;
    description?: string;
    status: boolean;
}

export interface UpdateStockLocationData {
    sale_office_id?: number;
    site_short_code?: string;
    description?: string | null;
    status?: boolean;
}