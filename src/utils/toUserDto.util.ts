import {User} from "@prisma/client";
import {UserDto} from "../dto/user.dto";

export function toUserDto(user: User) {
    return new UserDto(user.id,user.email,user.name, user.role);
}