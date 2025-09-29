import {Role} from "@prisma/client";

export class TokenJwt {
    id!: string;
    name!: string;
    role!: Role;
    email!: string;
}