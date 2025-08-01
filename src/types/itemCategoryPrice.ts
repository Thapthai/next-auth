export interface ItemCategoryPrice {
    id: number;
    item_category_id: number;
    price: number;
    description: string;
    status: boolean;
    create_at?: string;
    update_at?: string;
    
    // Relations (if populated)
    item_category?: any;
}