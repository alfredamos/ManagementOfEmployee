import {Gender} from "@prisma/client";

export class EmployeeDto{
    id: string;
    address: string;
    name: string;
    email: string;
    phone: string;
    gender: Gender;
    image: string;
    dateOfBirth:string;

}