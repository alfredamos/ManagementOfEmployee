import {Request} from "express";
import {isAdminUser} from "./isAdminUser.util";
import catchError from "http-errors";
import {StatusCodes} from "http-status-codes";

export function ownershipAndAdminCheckUtil(req: Request, userIdOnResource: string) {
    //----> Get the user id from user object on request object.
    const {id: userIdFromContext, role} = req?.user;

    //----> Get admin user.
    const isAdmin = isAdminUser(req);

    //----> Same user.
    const isSameUser = sameUser(userIdOnResource, userIdFromContext);

    //----> Only owner or admin are allowed to view or perform action on resource.
    if (!isSameUser && !isAdmin) {
        throw catchError(StatusCodes.FORBIDDEN, "You don't have permission to view or perform this action.");
    }

    //----> You are allowed to view or perform action on resource.

}

function sameUser(userIdOne: string, userIdTwo: string) {
    return userIdOne.normalize() === userIdTwo.normalize();
}