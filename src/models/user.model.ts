import prisma from "../db/prisma.db";
import catchError from "http-errors";
import {StatusCodes} from "http-status-codes";
import {ResponseMessage} from "../utils/responseMessage.util";
import {toUserDto} from "../utils/toUserDto.util";

class UserModel {
    ////----> Delete user model function.
    async deleteUser(id: string) {
        //----> Fetch user with the given id.
        const user = await this.existUserById(id);

        //----> Delete first the employee before deleting the user.
        await prisma.employee.delete({where: {userId: user.id}})

        //----> Delete the user with the given id.
        await prisma.user.delete({where: {id: id}});

        //----> Send back the response.
        return new ResponseMessage("User has been deleted successfully", "success", StatusCodes.OK);
    }

    ////----> Get one user by id function.
    async getUserById(id: string) {
        //----> Fetch user with the given id from database.
        return this.existUserById(id);
    }

    ////----> Get all users function.
    async getAllUsers() {
        //----> Fetch all users from database.
        const users = await prisma.user.findMany({}) ?? [];

        //----> Check for empty users.
        if (users.length === 0) {
            throw catchError(StatusCodes.NOT_FOUND, "No users found in the database.");
        }

        //----> Send back response.
        return users.map(user => toUserDto(user));
    }

    ////----> Exist user by id function.
    private existUserById = async (id: string) => {
        //----> Fetch user with the given id from database.
        const user = await prisma.user.findUnique({ where: { id } });

        //----> Check for existence user.
        if (!user) {
            throw catchError(StatusCodes.NOT_FOUND, `User with id ${id} not found`);
        }

        //----> Send back result.
        return user;
    }
}

export const userModel = new UserModel();
