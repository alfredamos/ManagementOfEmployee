import {Request, Response} from "express";
import { StatusCodes } from "http-status-codes";

function notFoundRouteMiddleware(req: Request, res: Response){
    res.status(StatusCodes.NOT_FOUND).json({message: `This route : ${req.url} does not exist!`})
}

export default notFoundRouteMiddleware;