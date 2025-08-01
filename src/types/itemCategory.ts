export interface ItemCategory {
    id: number;
    name_th: string;
    name_en: string;
    material_id: number;
    sale_office_id: number;
    department_id: number;
    stock_location_id?: number;
    description?: string;
    status: boolean;
    create_at?: string;
    update_at?: string;
    
    // Relations (if populated)
    material?: any;
    sale_office?: any;
    department?: any;
}