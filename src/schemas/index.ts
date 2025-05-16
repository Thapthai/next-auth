import * as z from "zod";

export const LoginSchema = z.object({
    email: z.string().email({
        message: "กรุณากรอก Email"
    }),
    password: z.string().min(6, {
        message: "กรุณากรอกรหัสผ่านอย่างน้อย 6 ตัว"
    }),
})


export const RegisterSchema = z.object({
    email: z.string().email({
        message: "กรุณากรอก Email"
    }),
    password: z.string().min(6, {
        message: "กรุณากรอกรหัสผ่านอย่างน้อย 6 ตัว"
    }),
    name: z.string().min(4, {
        message: "กรูณาใส่ชื่ออย่างน้อย 4 ตัว"
    }),
})


export const ForgetPasswordSchema = z.object({
    email: z.string().email({
        message: "กรุณากรอก Email"
    }),
})



export const ResetPasswordSchema = z
    .object({
        password: z.string().min(6, {
            message: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร',
        }),
        conPassword: z.string().min(6, {
            message: 'กรุณายืนยันรหัสผ่านให้ถูกต้อง',
        }),
    })
    .refine((data) => data.password === data.conPassword, {
        path: ['conPassword'],
        message: 'รหัสผ่านไม่ตรงกัน',
    });

export const UserSettingsSchema = z.object({
    name: z.string().min(1, "กรุณากรอกชื่อ"),
    password: z.string().min(6, "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร").optional(),
    is_two_factor_enabled: z.boolean(),
});