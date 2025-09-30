import {ChangeUserPasswordDto} from "../dto/changeUserPassword.dto";
import catchError from "http-errors";
import {StatusCodes} from "http-status-codes";
import express, {Request, Response} from "express";
import prisma from "../db/prisma.db";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import {ResponseMessage} from "../utils/responseMessage.util";
import {ChangeUserNameDto} from "../dto/changeUserName.dto";
import {ChangeUserImageDto} from "../dto/changeUserImage.dto";
import {SignupUserDto} from "../dto/signupUser.dto";
import {Role, Token, TokenType, User} from "@prisma/client";
import {LoginUserDto} from "../dto/loginUser.dto";
import {AuthCreateEditParamUtil} from "../utils/AuthCreateEditParam.util";
import {tokenModel} from "./tokenJwt.model";
import {TokenExpireInParamUtil} from "../utils/TokenExpireInParam.util";
import {CookieParamUtil} from "../utils/CookieParam.util";
import {CreateTokenDto} from "../dto/createToken.dto";
import {TokenJwt} from "../utils/token.dto";
import {UserAuth} from "../utils/userAuth.dto";
import {employeeModel} from "./employee.model";


class AuthModel{

    ////----> Change user password model function
    async changeUserPassword(changeUserPasswordDto: ChangeUserPasswordDto){
        //----> Destructure the payload.
        const {email, password, confirmPassword, newPassword} = changeUserPasswordDto;

        //----> Check for match between new-password and confirm-password.
        if (!await this.checkForPasswordMatch(newPassword, confirmPassword)){
            throw catchError(StatusCodes.BAD_REQUEST, "Passwords do not match!");
        }

        //----> Check for existence of user.
        const user = await this.existUserByEmail(email, AuthCreateEditParamUtil.edit);

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
        const user = await this.existUserByEmail(email, AuthCreateEditParamUtil.edit);

        //----> Check for valid password.
        if (!await this.checkForValidPassword(password, user.password)){
            throw catchError(StatusCodes.UNAUTHORIZED, "Invalid credentials!");
        }

        //----> Get the employee info for this user.
        const employee = await employeeModel.getEmployeeByEmail(email);

        //----> Store the updated user-profile in the user database.
        await prisma.user.update({where: {email}, data : {...user, name: name !== undefined ? name: user.name}});

        //----> Update the name field on employee model.
        await prisma.employee.update({where: {email}, data : {...employee, name: name !== undefined ? name: user.name}});

        //----> Send back the response.
        return new ResponseMessage("Name has been changed successfully!", "success", StatusCodes.OK);

    }

    ////----> Change user image model function.
    async changeUserImage(changeUserImageDto: ChangeUserImageDto){
        //----> Destructure the payload.
        const {email, password, image} = changeUserImageDto;

        //----> Check for existence of user.
        const user = await this.existUserByEmail(email, AuthCreateEditParamUtil.edit);

        //----> Check for valid password.
        if (!await this.checkForValidPassword(password, user.password)){
            throw catchError(StatusCodes.UNAUTHORIZED, "Invalid credentials!");
        }


        //----> Get the employee info for this user.
        const employee = await employeeModel.getEmployeeByEmail(email);

        //----> Store the updated user-profile in the database.
        await prisma.user.update({where: {email}, data : {...user, image: image !== undefined ? image: user.image}});

        //----> Update the image field on employee model.
        await prisma.employee.update({where: {email}, data : {...employee, image: image !== undefined ? image: user.image}});

        //----> Send back the response.
        return new ResponseMessage("Image has been changed successfully!", "success", StatusCodes.OK);

    }

    ////----> Login user model function.
    async loginUser(loginDto: LoginUserDto){
        const {email, password} = loginDto;

        //----> Check for existence of user.
        const user = await this.existUserByEmail(email, AuthCreateEditParamUtil.edit);

        //----> Check for valid password.
        if (!await this.checkForValidPassword(password, user.password)){
            throw catchError(StatusCodes.UNAUTHORIZED, "Invalid credentials!");
        }

        //----> Send back the response.
        return user;
    }

    //----> Logout user function.
    async logoutUser(req: express.Request, res: express.Response){
        //----> Get the current user id.
        const {id} = req.user;
        //----> Get access token.
        const accessToken = this.getCookie(req, CookieParamUtil.accessToken);

        //----> Get the current valid token object.
        const validToken = (await tokenModel.findAllValidTokensByUserId(id)).find(token => token.accessToken  === accessToken); //&& token.userId === id);

        //----> Check for invalid token
        if (validToken.expired && validToken.revoked){
            throw catchError(StatusCodes.UNAUTHORIZED, "You have already logout!");
        }

        //----> Invalidate the valid token once the user logs out.
        validToken.revoked = true;
        validToken.expired = true;

        //----> Save the updated token value in the token database.
        await tokenModel.editToken(validToken, validToken.id);

        //----> Delete access-token and refresh-token.
        this.deleteCookie(res, CookieParamUtil.accessToken, CookieParamUtil.accessTokenPath)
        this.deleteCookie(res, CookieParamUtil.refreshToken, CookieParamUtil.refreshTokenPath)


        //----> Send back the response.
        return new ResponseMessage("Logout is successful!", "success", StatusCodes.OK);
    }

    ////----> Get current user function
    async getCurrentUser(email: string){
        //----> Check if user exist and return a valid user.
        return  await this.existUserByEmail(email, AuthCreateEditParamUtil.edit);
    }

    ///----> Login function.
    async getLoginAccess(res: Response, user: User){
        //----> Revoke all valid tokens.
        await tokenModel.revokeAllValidUserTokens(user.id);

        //----> Get access and refresh tokens and set access and refresh cookies and return access token.
        return this.getTokensAndSetCookies(user, res);
    }

    ////----> Get cookie function.
    getCookie = (req: Request, tokenName: string) => {
        try{
            return req?.cookies[tokenName];
        }catch(err){
            throw catchError(StatusCodes.UNAUTHORIZED, "You do not have a valid token!");
        }

    }

    ////----> Refresh token function.
    async refreshUserToken(req: Request, res: Response){
        //----> Get refresh token.
        const refreshToken = this.getCookie(req, CookieParamUtil.refreshToken);

        //----> Parse the refresh-token and check for validity of token.
        const userAuth = this.validateUserToken(refreshToken)

        //----> Get the last valid token and check its validity.
        const validToken = (await tokenModel.findAllValidTokensByUserId(userAuth.id)).find(token => token.refreshToken && userAuth.id);
        if (!validToken) {
            throw catchError(StatusCodes.UNAUTHORIZED, "Invalid credentials!");
        }

        //----> Revoked all tokens.
        await tokenModel.revokeAllValidUserTokens(userAuth.id);

        //----> Get access and refresh tokens and set access and refresh cookies and return access token.
        return this.getTokensAndSetCookies(userAuth, res);
    }

    ////----> Validate token function.
    validateUserToken = (token: string) => {
        //----> Check for empty token.
        if(!token) {
            throw catchError(
                StatusCodes.UNAUTHORIZED,
                "Invalid credentials!"
            );
        }

        //----> Verify the jwt-token
        try {
            return jwt?.verify(token, process.env.JWT_TOKEN_KEY!) as TokenJwt;
        }catch(err) {
            throw catchError(StatusCodes.UNAUTHORIZED, "Invalid credentials!");
        }

    }

    ////----> Signup model function.
    async signupUser(signupDto: SignupUserDto){
        //----> Destructure the payload.
        const {email, password, confirmPassword, role, image, name, ...rest} = signupDto;

        //----> Check for password match between password and confirm-password.
        if (! await this.checkForPasswordMatch(password, confirmPassword)) {
            throw catchError(StatusCodes.BAD_REQUEST)
        }

        //----> Check for existence of user.
        await this.existUserByEmail(email, AuthCreateEditParamUtil.create);

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
    private checkForPasswordMatch = async (passwordOne: string, passwordTwo: string) => {
        return passwordOne.normalize() === passwordTwo.normalize();
    }

    ////----> Check for valid password function.
    private checkForValidPassword = async (rawPassword: string, encodePassword: string)=> {
       return await bcrypt.compare(rawPassword, encodePassword);
    }

    ////----> Check for user existence function.
    private existUserByEmail = async (email: string, mode: string) => {
        //----> Fetch user from database.
        const user = await prisma.user.findUnique({where: {email}});

        //----> Check for user existence create mode.
        if (!!user && mode === AuthCreateEditParamUtil.create) {
            throw catchError(StatusCodes.UNAUTHORIZED, "Invalid credentials!");
        }

        //----> Check for user existence mode is edit.
        if (!user && mode === AuthCreateEditParamUtil.edit) {
            throw catchError(StatusCodes.UNAUTHORIZED, "Invalid credentials!");
        }

        //----> Send back the fetched user.
        return user;
    }

    /////----> Get access and refresh tokens and set access and refresh cookies.
    private getTokensAndSetCookies = async (user: UserAuth, res: Response) => {
        //----> Generate access token.
        const accessToken = await this.generateToken(user.id, user.name, user.email, user.role, TokenExpireInParamUtil.accessTokenExpireIn);
        //----> Set access token cookie.
        this.setCookie(res, CookieParamUtil.accessToken, accessToken, CookieParamUtil.accessTokenPath, CookieParamUtil.accessTokenMaxAge);

        //----> Generate refresh token.
        const refreshToken = await this.generateToken(user.id, user.name, user.email, user.role, TokenExpireInParamUtil.refreshTokenExpireIn);
        //----> Set refresh token cookie.
        this.setCookie(res, CookieParamUtil.refreshToken, refreshToken, CookieParamUtil.refreshTokenPath, CookieParamUtil.refreshTokenMaxAge);

        //----> create new token object.
        const newToken = this.makeNewToken(accessToken, refreshToken, user.id) as Token;
        await tokenModel.createToken(newToken);

        //----> send back the response.
        return accessToken;
    }

    ////----> Set cookie function.
    private setCookie = (res: Response, cookieName: string, cookieValue: string, cookiePath: string, maxAge: number) => {
        res.cookie(cookieName, cookieValue, {
            httpOnly: true,
            secure: false,
            path: cookiePath,
            maxAge
        })
    }

    ////----> create new token object.
    private makeNewToken = (accessToken: string, refreshToken: string, userId: string) => {
        return new CreateTokenDto(accessToken, refreshToken, false, false, TokenType.Bearer, userId);
    }

    ////----> Generate json web token function.
    private generateToken = async (id: string, name: string, email: string, role: Role, expiresIn: number)=>{
        return jwt.sign(
            {
                id,
                name,
                role,
                email
            },
            process.env.JWT_TOKEN_KEY!,
            {expiresIn}
        );
    }

    ////----> Delete cookie function.
    deleteCookie = (res: Response, cookieName: string, cookiePath: string) => {
        res.clearCookie(cookieName, { path: cookiePath, secure: false, httpOnly: true });
    }


}

export const authModel = new AuthModel();