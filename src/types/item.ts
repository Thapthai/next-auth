export type Item = {
    id: number;
    material_id?: number;
    saleoffice_id?: number;
    department_id?: number;
    item_category_id?: number;
    stock_location_id?: number;
    name_th?: string;
    name_en?: string;
    status?: boolean;
    create_at?: Date;
    update_at?: Date;
}