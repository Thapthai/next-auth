export interface SaleOfficeGroupType {
    id: number;
    level: string;
    group: string;
    type: string;
    status: boolean;
    create_at: string;
    update_at: string;
}

export interface CreateSaleOfficeGroupTypeData {
    level: string;
    group: string;
    type: string;
    status: boolean;
}

export interface UpdateSaleOfficeGroupTypeData {
    level?: string;
    group?: string;
    type?: string;
    status?: boolean;
}