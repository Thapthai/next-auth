export type MaterialType = {
    id: number;
    name_th: string;
    name_en: string;
    description: string;
    status: boolean;
    create_at: string;
    update_at: string;
    materials?: Material[];
}

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
}