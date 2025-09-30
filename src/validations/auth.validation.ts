import {z} from "zod";
import {Gender, Role} from "@prisma/client";

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

export const loginUserSchema = z.object({
    email: z.string().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
    password: z.string(),
})

export const signupUserSchema = z.object({
    address: z.string(),
    name: z.string(),
    email: z.string().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
    phone: z.string(),
    image: z.string(),
    gender: z.enum(Gender),
    dateOfBirth: z.string(),
    password: z.string(),
    confirmPassword: z.string(),
    role: z.enum(Role),
}).refine((values) => values.password.normalize() === values.confirmPassword.normalize());