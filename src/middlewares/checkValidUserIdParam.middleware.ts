import {NextFunction, Request, Response} from "express";
import {UuidTool} from "uuid-tool";
import catchError from "http-errors";
import {StatusCodes} from "http-status-codes";

export function checkValidUserIdParam(req: Request, _res: Response, next: NextFunction) {
    //----> Get the id from params object on request object.
    const {userId} = req.params;

    //----> Check for invalid id.
    if(!UuidTool.isUuid(userId)){
        throw catchError(StatusCodes.BAD_REQUEST, "Invalid id");
    }

    //----> Valid id.
    return next();
}