import {NextFunction, Request, Response} from "express";
import {validateWithZodSchema} from "../validations/zodSchema.validation";
import catchError from "http-errors";
import {StatusCodes} from "http-status-codes";
import {loginUserSchema} from "../validations/auth.validation";
import {LoginUserDto} from "../dto/loginUser.dto";

export function loginUserMiddleware(req: Request, _res: Response, next: NextFunction)  {
    //----> Get the payload from request object.
    const loginUserDto = req.body as LoginUserDto;

    if (!validateWithZodSchema(loginUserSchema, loginUserDto)) {
        throw catchError(StatusCodes.BAD_REQUEST, "All fields are required!");
    }

    //----> All fields are valid
    return next();
}