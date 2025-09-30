import {NextFunction, Request, Response} from "express";
import {validateWithZodSchema} from "../validations/zodSchema.validation";
import catchError from "http-errors";
import {StatusCodes} from "http-status-codes";
import {ChangeUserImageDto} from "../dto/changeUserImage.dto";
import {changeUserImageSchema, signupUserSchema} from "../validations/auth.validation";
import {SignupUserDto} from "../dto/signupUser.dto";

export function signupUserMiddleware(req: Request, _res: Response, next: NextFunction)  {
    console.log("At point 1, In signupUserMiddleware, signUserDto : ", req.body);
    //----> Get the payload from request object.
    const signupDto = req.body as SignupUserDto;

    if (!validateWithZodSchema(signupUserSchema, signupDto)) {
        throw catchError(StatusCodes.BAD_REQUEST, "All fields are required!");
    }

    //----> All fields are valid
    console.log("At point 2, In signupUserMiddleware, signUserDto : ", req.body);
    return next();
}