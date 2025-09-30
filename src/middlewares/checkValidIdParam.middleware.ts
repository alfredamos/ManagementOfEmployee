import {NextFunction, Request, Response} from "express";
import {UuidTool} from "uuid-tool";
import catchError from "http-errors";
import {StatusCodes} from "http-status-codes";

export function checkValidIdParam(req: Request, _res: Response, next: NextFunction) {
    //----> Get the id from params object on request object.
    const {id} = req.params;

    //----> Check for invalid id.
    if(!UuidTool.isUuid(id)){
        throw catchError(StatusCodes.BAD_REQUEST, "Invalid id");
    }

    //----> Valid id.
    return next();
}