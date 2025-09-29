import {Role} from "@prisma/client";

export class UserDto{
    constructor(public id: string, public email: string, public name: string, public role: Role) {}
}