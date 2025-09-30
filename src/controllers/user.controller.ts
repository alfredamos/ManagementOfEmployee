import {Response, Request} from "express";
import {userModel} from "../models/user.model";
import {StatusCodes} from "http-status-codes";
import {Role} from "@prisma/client";
import catchError from "http-errors";
import {isAdminUser} from "../utils/isAdminUser.util";

export class UserController{
    ////----> Delete user controller function.
    static async deleteUserById(req: Request, res: Response){
        //----> Only admin can delete.
        if (!isAdminUser(req)){
            throw catchError(StatusCodes.FORBIDDEN, "You are not permitted to perform this action!");
        }

        //----> Get id from params object on request object.
        const { id } = req.params;

        //----> Delete the user with the given id from database.
        const response = await userModel.deleteUser(id);

        //----> Send back the response.
        res.status(StatusCodes.OK).json(response);
    }

    ////----> Get one user by id controller function.
    static async getUserById(req: Request, res: Response){
        //----> Get id from params object on request object.
        const { id } = req.params;

        //----> Fetch the user with the given id from database.
        const response = await userModel.getUserById(id);

        //----> Send back the response.
        res.status(StatusCodes.OK).json(response);
    }

    ////----> Get all users controller function.
    static async getAllUsers(_req: Request, res: Response){
        //----> Fetch all users from database.
        const response = await userModel.getAllUsers();

        //----> Send back the response.
        res.status(StatusCodes.OK).json(response);
    }


}