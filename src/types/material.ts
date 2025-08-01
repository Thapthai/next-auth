export type Material = {
    id: number;
    material_code: string;
    material_name_th: string;
    material_name_en: string;
    long_meterial_name: string;
    material_type_id: number;
    sap_sale_id?: number;
    description: string;
    status: boolean;
    create_at: string;
    update_at: string;
    material_types?: MaterialType;
    sap_sale?: SapSale;
    items?: Item[];
}

export type MaterialType = {
    id: number;
    description: string;
    status: boolean;
    create_at: string;
    update_at: string;
}

export type SapSale = {
    id: number;
    code: string;
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