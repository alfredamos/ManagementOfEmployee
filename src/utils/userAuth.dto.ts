import {Role} from "@prisma/client";

export class UserAuth {
    id: string;
    email: string;
    name: string;
    role: Role;
}