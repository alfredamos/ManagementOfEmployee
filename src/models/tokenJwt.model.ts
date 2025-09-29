import {Token} from "@prisma/client";
import prisma from "../db/prisma.db";
import catchError from "http-errors";
import {StatusCodes} from "http-status-codes";
import {ResponseMessage} from "../utils/responseMessage.util";

export class TokenJwtModel {
    ////----> Create token model function.
    async createToken(token: Token){
        //----> Insert the new token in the database.
        return prisma.token.create({data: {...token}});
    }

    ////----> Find token object by given access-token function.
    async findTokenByAccessToken(accessToken: string){
        const token = await prisma.token.findUnique({where: {accessToken: accessToken}});

        //----> Check for empty token.
        if(!token){
            throw catchError(StatusCodes.NOT_FOUND, "No token found with the given access token!");
        }

        //----> Send back the result.
        return token;
    }

    ////----> Find all valid tokens function.
    async findAllValidTokensByUserId(userId: string){
        //----> Retrieve all valid tokens.
        return prisma.token.findMany({where: {userId, expired: false, revoked: false}});
    }

    ////----> Revoke all valid tokens function.
    async revokeAllValidUserTokens(userId: string){
        //----> Retrieve all valid tokens.
        const validTokens = await this.findAllValidTokensByUserId(userId);

        //----> Invalidate all the valid tokens.
        const invalidatedTokens = validTokens.map(async (token) => {

                const updatedToken = ({...token, expired: true, revoked: true});

                return prisma.token.update({where:{id: updatedToken.id}, data: {...updatedToken}})

        })

        //----> Send back the response.
        return Promise.all(invalidatedTokens);
    }

    ////----> Delete all revoked tokens function.
    async deleteAllRevokedTokens(userId: string){
        //----> retrieve all revoked tokens.
        const revokedTokens = await this.revokeAllValidUserTokens(userId);

        //----> Collect all the ids of revoked tokens.
        const revokedTokenIds = revokedTokens.map((token) => token.id);

        //----> Delete all revoked tokens.
        const deltedTokens = await prisma.token.deleteMany({
            where: {
                id : {
                    in: revokedTokenIds,
                }
            }
        })

        //----> Verify that tokens are actually deleted.
        if (!deltedTokens?.count){
            throw catchError(StatusCodes.NOT_FOUND, "No token deleted!");
        }

        //----> Send back the response.
        return new ResponseMessage("All revoked tokens have been deleted successfully!", "success", StatusCodes.OK)
    }
}

export const tokenModel = new TokenJwtModel();