import {NextFunction, Request, Response} from "express";
import {validateWithZodSchema} from "../validations/zodSchema.validation";
import catchError from "http-errors";
import {StatusCodes} from "http-status-codes";
import {ChangeUserImageDto} from "../dto/changeUserImage.dto";
import {changeUserImageSchema} from "../validations/auth.validation";

export function changeUserImageMiddleware(req: Request, _res: Response, next: NextFunction)  {
    //----> Get the payload from request object.
    const changeUserImageDto = req.body as ChangeUserImageDto;

    if (!validateWithZodSchema(changeUserImageSchema, changeUserImageDto)) {
        throw catchError(StatusCodes.BAD_REQUEST, "All fields are !");
    }

    //----> All fields are valid
    return next();
}