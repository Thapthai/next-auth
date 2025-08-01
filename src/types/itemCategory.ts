export type ItemCategory = {
    id: number;
    type_id: number;
    sale_office_id: number;
    department_id: number;
    stock_location_id: number;
    description: string;
    status: boolean;
    create_at: string;
    update_at: string;
    item_category_prices?: ItemCategoryPrice[];
    items?: Item[];
}

export type ItemCategoryPrice = {
    id: number;
    item_category_id: number;
    price: number;
    description: string;
    status: boolean;
    create_at: string;
    update_at: string;
}

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
}