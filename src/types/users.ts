import { UserSaleOffice } from "./userSaleOffice";

export type User = {
    id: number;
    email: string;
    name: String
    permission_id: number
    password: String
    two_factor_secret?: String,
    user_sale_office: UserSaleOffice[];

};

