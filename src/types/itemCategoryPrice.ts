export type ItemCategoryPrice = {
    id: number;
    item_category_id: number;
    price: number;
    description: string;
    status: boolean;
    create_at: string;
    update_at: string;
    item_category?: ItemCategory;
}

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
}