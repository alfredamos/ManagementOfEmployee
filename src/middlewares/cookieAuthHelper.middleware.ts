import { Request } from "express";
import {CookieParamUtil} from "../utils/CookieParam.util";
import catchError from "http-errors";
import {StatusCodes} from "http-status-codes";
import {authModel} from "../models/auth.model";

export function cookieAuthHelperMiddleware(req: Request) {
    //----> Get cookie.
    const accessToken = req.cookies[CookieParamUtil.accessToken];

    //----> Check for empty token.
    if (!accessToken) {
        throw catchError(StatusCodes.UNAUTHORIZED, "You do not have a valid token!");
    }

    //----> Validate token and send back the result.
    return authModel.validateUserToken(accessToken);
}