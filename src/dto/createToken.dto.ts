import {TokenType} from "@prisma/client";

export class CreateTokenDto {
    constructor(public accessToken: string, public refreshToken: string, public expired: boolean, public revoked: boolean, public tokenType: TokenType, public userId: string) {}
}