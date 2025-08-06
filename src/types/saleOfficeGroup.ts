export interface SaleOfficeGroup {
    id: number;
    name_th: string;
    name_en: string;
    description?: string;
    code?: string;
    sale_office_id: number;
    sale_office_group_type_id: number;
    status: boolean;
    create_at: string;
    update_at: string;
}

export interface CreateSaleOfficeGroupData {
    name_th: string;
    name_en: string;
    description?: string;
    code?: string;
    sale_office_id: number;
    sale_office_group_type_id: number;
    status: boolean;
}

export interface UpdateSaleOfficeGroupData {
    name_th?: string;
    name_en?: string;
    description?: string;
    code?: string;
    sale_office_id?: number;
    sale_office_group_type_id?: number;
    status?: boolean;
}