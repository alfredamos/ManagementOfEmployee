import {ChangeUserPasswordDto} from "../dto/changeUserPassword.dto";
import catchError from "http-errors";
import {StatusCodes} from "http-status-codes";
import prisma from "../db/prisma.db";
import * as bcrypt from "bcryptjs";
import {ResponseMessage} from "../utils/responseMessage.util";
import {ChangeUserNameDto} from "../dto/changeUserName.dto";
import {ChangeUserImageDto} from "../dto/changeUserImage.dto";
import {SignupDto} from "../dto/signup.dto";
import {Role} from "@prisma/client";

class AuthModel{

    ////----> Change user password model function
    async changeUserPassword(changeUserPasswordDto: ChangeUserPasswordDto){
        //----> Destructure the payload.
        const {email, password, confirmPassword, newPassword} = changeUserPasswordDto;

        //----> Check for match between new-password and confirm-password.
        if (!this.checkForPasswordMatch(newPassword, confirmPassword)){
            throw catchError(StatusCodes.BAD_REQUEST, "Passwords do not match!");
        }

        //----> Check for existence of user.
        const user = await this.existUserByEmail(email);

        //----> Check for valid password.
        if (!await this.checkForValidPassword(password, user.password)){
            throw catchError(StatusCodes.UNAUTHORIZED, "Invalid credentials!");
        }

        //----> Hash the new-password.
        const hashedPassword = await bcrypt.hash(newPassword, 12);

        //----> Store the updated password in the database.
        await prisma.user.update({where : {email}, data: {...user, password: hashedPassword}});

        //----> Send back the response.
        return new ResponseMessage("Password has been changed successfully!", "success", StatusCodes.OK);
    }

    ////----> Change user name model function.
    async changeUserName(changeUserNameDto: ChangeUserNameDto){
        //----> Destructure the payload.
        const {email, password, name} = changeUserNameDto;

        //----> Check for existence of user.
        const user = await this.existUserByEmail(email);

        //----> Check for valid password.
        if (!await this.checkForValidPassword(password, user.password)){
            throw catchError(StatusCodes.UNAUTHORIZED, "Invalid credentials!");
        }

        //----> Store the updated user-profile in the database.
        await prisma.user.update({where: {email}, data : {...user, name: name !== undefined ? name: user.name}});

        //----> Send back the response.
        return new ResponseMessage("Name has been changed successfully!", "success", StatusCodes.OK);

    }

    ////----> Change user image model function.
    async changeUserImage(changeUserImageDto: ChangeUserImageDto){
        //----> Destructure the payload.
        const {email, password, image} = changeUserImageDto;

        //----> Check for existence of user.
        const user = await this.existUserByEmail(email);

        //----> Check for valid password.
        if (!await this.checkForValidPassword(password, user.password)){
            throw catchError(StatusCodes.UNAUTHORIZED, "Invalid credentials!");
        }

        //----> Store the updated user-profile in the database.
        await prisma.user.update({where: {email}, data : {...user, image: image !== undefined ? image: user.image}});

        //----> Send back the response.
        return new ResponseMessage("Name has been changed successfully!", "success", StatusCodes.OK);

    }

    ////----> Signup model function.
    async signupUser(signupDto: SignupDto){
        //----> Destructure the payload.
        const {email, password, confirmPassword, role, image, name, ...rest} = signupDto;

        //----> Check for password match between password and confirm-password.
        if (!this.checkForPasswordMatch(password, confirmPassword)) throw catchError(StatusCodes.BAD_REQUEST)

        //----> Check for existence of user.
        const user = await this.existUserByEmail(email);
        if (user) throw catchError(StatusCodes.UNAUTHORIZED, "Invalid credentials!");

        //----> Hash password.
        const hashedPassword = await bcrypt.hash(password, 12);

        //----> Save the new user in the user database.
        const newUser = await prisma.user.create({ data: {email, name, role: Role.User, password: hashedPassword, image }});

        //----> Calculate the age.
        const age = new Date()?.getFullYear() - new Date(rest.dateOfBirth)?.getFullYear();

        //----> Save the employee data in the employee database.
        await prisma.employee.create({ data: {...rest, email, name, image, age, dateOfBirth: new Date(rest.dateOfBirth).toISOString(), userId: newUser.id}});

        //----> Send back the response.
        return new ResponseMessage("Signup is successfully!", "success", StatusCodes.OK);
    }

    ////----> Check for password match function.
    private checkForPasswordMatch(passwordOne: string, passwordTwo: string){
        return passwordOne.normalize() === passwordOne.normalize();
    }

    ////----> Check for valid password function.
    private async checkForValidPassword(rawPassword: string, encodePassword: string){
       return await bcrypt.compare(rawPassword, encodePassword);
    }

    ////----> Check for user existence function.
    private async existUserByEmail(email: string){
        //----> Fetch user from database.
        const user = await prisma.user.findUnique({where: {email}});

        //----> Check for user existence.
        if (!user){
            throw catchError(StatusCodes.UNAUTHORIZED, "Invalid credentials!");
        }

        //----> Send back the fetched user.
        return user;
    }
}

export const authModel = new AuthModel();