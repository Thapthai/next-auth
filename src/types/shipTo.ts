export interface ShipTo {
    id: number;
    ship_to_code: string;
    sale_office_customer_id: number;
    description?: string;
    status: boolean;
    create_at: Date;
    update_at: Date;
    sale_office_customer?: {
        id: number;
        customer: {
            id: number;
            name_th: string;
            name_en: string;
            site_short_code: string;
        };
        sale_office: {
            id: number;
            name_th: string;
            sale_office_code: string;
        };
    };
}
