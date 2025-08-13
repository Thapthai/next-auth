export interface Location {
    id: number;
    stock_location_id: number;
    site_short_code: string;
    name_th: string;
    name_en: string;
    description: string | null;
    status: boolean;
    create_at: Date;
    update_at: Date;

    stock_location: {
        id: number;
        site_short_code: string;
        description: string | null;
        sale_office_id: number;
        sale_office: {
            id: number;
            name_th: string;
            name_en: string;
            sale_office_code: string;
        };
    };
}

export interface CreateLocationData {
    stock_location_id: number;
    site_short_code: string;
    name_th: string;
    name_en: string;
    description?: string;
    status: boolean;
}

export interface UpdateLocationData {
    stock_location_id?: number;
    site_short_code?: string;
    name_th?: string;
    name_en?: string;
    description?: string | null;
    status?: boolean;
}
