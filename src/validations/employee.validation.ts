import {z} from "zod";
import {Gender} from "@prisma/client";

export const employeeSchema = z.object({
    id: z.string(),
    address: z.string(),
    name: z.string(),
    email: z.string().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
    phone: z.string(),
    gender: z.enum(Gender),
    image: z.string(),
    dateOfBirth: z.string(),
})