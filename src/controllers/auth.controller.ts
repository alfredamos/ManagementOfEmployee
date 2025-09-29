import { Request, Response } from "express";
import {ChangeUserPasswordDto} from "../dto/changeUserPassword.dto";
import {authModel} from "../models/auth.model";
import {StatusCodes} from "http-status-codes";
import {ChangeUserNameDto} from "../dto/changeUserName.dto";
import {ChangeUserImageDto} from "../dto/changeUserImage.dto";
import {SignupDto} from "../dto/signup.dto";

export class AuthController {
    ////----> Change password controller function.
    static async changeUserPassword(req: Request, res: Response) {
        //----> Get the change password payload from request.
        const changeUserPasswordDto = req.body as ChangeUserPasswordDto;

        //----> Store the change in password into the database.
        const response = await authModel.changeUserPassword(changeUserPasswordDto);

        //----> Send back the response.
        res.status(StatusCodes.OK).json(response);
    }

    ////----> Change name controller function.
    static async changeUserName(req: Request, res: Response) {
        //----> Get the change password payload from request.
        const changeUserNameDto = req.body as ChangeUserNameDto;

        //----> Store the change in name into the database.
        const response = await authModel.changeUserName(changeUserNameDto);

        //----> Send back the response.
        res.status(StatusCodes.OK).json(response);
    }

    ////----> Change image controller function.
    static async changeUserImage(req: Request, res: Response) {
        //----> Get the change image payload from request.
        const changeUserImageDto = req.body as ChangeUserImageDto;

        //----> Store the change in image into the database.
        const response = await authModel.changeUserImage(changeUserImageDto);

        //----> Send back the response.
        res.status(StatusCodes.OK).json(response);
    }

    ////----> Signup controller function
    static async signupUser(req: Request, res: Response) {
        //----> Get the signup payload from request.
        const signupDto: SignupDto = req.body as SignupDto;

        //----> Save the new user and the new employee into the database.
        const response = await authModel.signupUser(signupDto);

        //----> Send back the response.
        res.status(StatusCodes.CREATED).json(response);
    }
}