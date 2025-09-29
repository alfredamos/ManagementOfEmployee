import {Response, Request, NextFunction} from "express";
import {ChangeUserPasswordDto} from "../dto/changeUserPassword.dto";
import {validateWithZodSchema} from "../validations/zodSchema.validation";
import {changeUserPasswordSchema} from "../validations/auth.validation";
import catchError from "http-errors";
import {StatusCodes} from "http-status-codes";

export function changeUserPasswordMiddleware(req: Request, _res: Response, next: NextFunction)  {
    //----> Get the payload from request object.
    const changeUserPasswordDto = req.body as ChangeUserPasswordDto;

    if (!validateWithZodSchema(changeUserPasswordSchema, changeUserPasswordDto)) {
        throw catchError(StatusCodes.BAD_REQUEST, "All fields are !");
    }

    //----> All fields are valid
    return next();

}