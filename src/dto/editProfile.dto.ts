import {Gender} from "@prisma/client";

export class EditProfileDto {
    name: string;
    address: string;
    email: string;
    image: string;
    phone: string;
    password: string;
    gender: Gender;
    dateOfBirth: Date;
}