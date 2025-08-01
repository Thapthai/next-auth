export type Item = {
    id: number;
    material_id?: number;
    saleoffice_id: number;
    department_id: number;
    item_category_id?: number;
    stock_location_id: number;
    rfid_number?: string;
    name_th?: string;
    name_en?: string;
    status: boolean;
    create_at: string;
    update_at: string;
    item_category?: {
        id: number;
        name: string;
        description?: string;
        status: boolean;
    };
    material?: {
        id: number;
        material_code: string;
        material_name_th: string;
        material_name_en: string;
        description: string;
        status: boolean;
    };
}