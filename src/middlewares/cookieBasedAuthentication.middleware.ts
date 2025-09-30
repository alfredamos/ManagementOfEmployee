import {NextFunction, Request, Response} from "express";
import {cookieAuthHelperMiddleware} from "./cookieAuthHelper.middleware";
import {isPublicRoute} from "../utils/publicRoutes.util";
import {isAdminRoute} from "../utils/adminRoutes.util";

export function cookieBasedAuthenticationMiddleware(req: Request, _res: Response, next: NextFunction): void {
    //----> Public routes.
    if (isPublicRoute(req?.url)) {
        return next();
    }

    //----> Get the cookie, validate it and set it on user object on request object.
    req.user = cookieAuthHelperMiddleware(req);

    //----> The token is valid.
    return next();
}