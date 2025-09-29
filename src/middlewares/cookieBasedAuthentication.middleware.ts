import {NextFunction, Request, Response} from "express";
import {cookieAuthHelperMiddleware} from "./cookieAuthHelper.middleware";

export function cookieBasedAuthenticationMiddleware(req: Request, _res: Response, next: NextFunction): void {
    //----> Get the cookie, validate it and set it on user object on request object.
    req.user = cookieAuthHelperMiddleware(req);

    //----> The token is valid.
    return next();
}