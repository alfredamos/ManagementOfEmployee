import {Request, Response, NextFunction} from "express";
import {Role} from "@prisma/client";
import catchError from "http-errors";
import {StatusCodes} from "http-status-codes";
import {isAdminRoute} from "../utils/adminRoutes.util";
import {isPublicRoute} from "../utils/publicRoutes.util";

export function cookieBasedAdminRoleMiddleware(req: Request, _res: Response, next: NextFunction) {
    //----> Non admin routes.
    if (!isAdminRoute(req.url)) {
        return next();
    }

    //----> Get the current user role from the user-detail object on request object.
    const {role} = req.user;
    const isAdmin = role === Role.Admin;

    //----> Check for admin privilege.
    if (!isAdmin ) {
        throw catchError(StatusCodes.FORBIDDEN, "You don't have permission to view or perform this action.");
    }

    //----> User is an admin, move on.
    return next();
}