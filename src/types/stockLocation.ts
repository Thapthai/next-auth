export interface StockLocation {
    id: number;
    department_id: number;
    sale_office_id: number;
    site_short_code: number;
    description: string;
    status: boolean;
    create_at: string;
    update_at: string;
}

export interface CreateStockLocationData {
    department_id: number;
    sale_office_id: number;
    site_short_code: number;
    description: string;
    status: boolean;
}

export interface UpdateStockLocationData {
    department_id?: number;
    sale_office_id?: number;
    site_short_code?: number;
    description?: string;
    status?: boolean;
}