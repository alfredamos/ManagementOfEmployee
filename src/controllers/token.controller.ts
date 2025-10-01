import {Request, Response} from "express";
import {tokenModel} from "../models/tokenJwt.model";
import {StatusCodes} from "http-status-codes";

export class TokenController{
    ////----> Delete all invalid tokens controller function.
    static async deleteAllRevokedTokensByUserId(req: Request, res: Response){
        //----> Get the user id from params object on request object.
        const {userId} = req.params;

        //----> Delete all invalid tokens.
        const response = await tokenModel.deleteAllRevokedTokensByUserId(userId);

        //----> Send back response.
        res.status(StatusCodes.OK).send(response);
    }

    ////----> Delete all invalid tokens controller function.
    static async deleteAllRevokedTokens(_req: Request, res: Response){
        //----> Delete all invalid tokens.
        const response = await tokenModel.deleteAllRevokedTokens();

        //----> Send back response.
        res.status(StatusCodes.OK).send(response);
    }
}