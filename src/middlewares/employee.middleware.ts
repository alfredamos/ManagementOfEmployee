import {NextFunction, Request, Response} from "express";
import {EmployeeDto} from "../dto/employee.dto";
import {validateWithZodSchema} from "../validations/zodSchema.validation";
import {employeeSchema} from "../validations/employee.validation";
import catchError from "http-errors";
import {StatusCodes} from "http-status-codes";

export function employeeMiddleware(req: Request, res: Response, next: NextFunction){
    //----> Get the employee payload from the body object on request object.
    const employeeDto = req.body as EmployeeDto;

    //----> Validate the payload.
    if (!validateWithZodSchema(employeeSchema, employeeDto)){
        throw catchError(StatusCodes.BAD_REQUEST, "All fields are required!");
    }

    //----> Move on, all validated.
    return next();

}