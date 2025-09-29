import {z} from "zod";

export const changeUserPasswordSchema = z.object({
    email: z.string().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
    password: z.string(),
    newPassword: z.string(),
    confirmPassword: z.string()
}).refine((values) => values.newPassword.normalize() === values.newPassword.normalize());

export const changeUserImageSchema = z.object({
    email: z.string().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
    password: z.string(),
    image: z.string(),
});

export const changeUserNameSchema = z.object({
    email: z.string().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
    password: z.string(),
    name: z.string(),
});