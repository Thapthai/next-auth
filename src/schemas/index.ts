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