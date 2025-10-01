import {NextFunction, Request, Response} from "express";
import catchError from "http-errors";
import {StatusCodes} from "http-status-codes";
import {Role} from "@prisma/client";

export function sameUserCheckMiddleware(req: Request, _res: Response, next: NextFunction){
   //----> Get the user id from params object on request object.
   const userIdFromParams = !!req?.params?.id ? req.params.id : req.params.userId;

   //----> Get the user id from the current login user detail.
   const {id :userIdFromContext, role} = req?.user;

   //----> Get the admin privilege.
    const isAdmin = role === Role.Admin;

  //----> Not same user and not admin.
  if ((userIdFromParams.normalize() !== userIdFromContext.normalize()) && !isAdmin) {
      throw catchError(StatusCodes.FORBIDDEN, "You don't have permission to view or perform this action!");
  }

  //----> You are permitted, move on.
  return next();
}