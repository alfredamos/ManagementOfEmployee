import {Gender, Role} from "@prisma/client";

export class SignupUserDto {
    name: string;
    address: string;
    email: string;
    image: string;
    phone: string;
    gender: Gender;
    password:    string;
    confirmPassword:  string;
    dateOfBirth: Date;
    role: Role;
}