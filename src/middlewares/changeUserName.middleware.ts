import {NextFunction, Request, Response} from "express";
import {validateWithZodSchema} from "../validations/zodSchema.validation";
import catchError from "http-errors";
import {StatusCodes} from "http-status-codes";
import {ChangeUserNameDto} from "../dto/changeUserName.dto";
import {changeUserNameSchema} from "../validations/auth.validation";

export function changeUserNameMiddleware(req: Request, _res: Response, next: NextFunction)  {
    //----> Get the payload from request object.
    const changeUserNameDto = req.body as ChangeUserNameDto;

    if (!validateWithZodSchema(changeUserNameSchema, changeUserNameDto)) {
        throw catchError(StatusCodes.BAD_REQUEST, "All fields are !");
    }

    //----> All fields are valid
    return next();

}