import {isAdminUser} from "../utils/isAdminUser.util";
import {Response, Request} from "express";
import catchError from "http-errors";
import {StatusCodes} from "http-status-codes";
import {employeeModel} from "../models/employee.model";
import {Employee} from "@prisma/client";


export class EmployeeController {
    ////----> Delete the employee controller function.
    static async deleteEmployeeById(req: Request, res: Response) {
        //----> Only admin can delete employee.
        if(!isAdminUser(req)){
            throw catchError(StatusCodes.FORBIDDEN, "You don't have permission to delete the employee!");
        }

        //----> Get the id from params object on request object.
        const {id} = req.params;

        //----> Delete the employee with the given id.
        const response = await employeeModel.deleteEmployeeById(id);

        //----> Send back the response.
        res.status(StatusCodes.OK).send(response);
    }

    ////----> Edit employee by id controller function.
    static async editEmployeeById(req: Request, res: Response) {
        //----> Get the id from params object on request object.
        const {id} = req.params;

        //----> Get the request payload from body object on request object.
        const employeeToEdit = req.body as Employee;

        //----> Edit employee with the given id.
        const response = await employeeModel.editEmployeeById(id, employeeToEdit, req);

        //----> Send back the response.
        res.status(StatusCodes.OK).send(response);
    }

    ////----> Fetch employee by id controller function.
    static async getEmployeeById(req: Request, res: Response) {
        //----> Get the id from params object on request object.
        const {id} = req.params;

        //----> Fetch the employee with the given id.
        const response = await employeeModel.getEmployeeById(id, req);

        //----> Send back the response.
        res.status(StatusCodes.OK).send(response);
    }

    ////----> Fetch all employees controller function.
    static async getAllEmployees(_req: Request, res: Response) {
        //----> Fetch all employees.
        const response = await employeeModel.getAllEmployees();

        //----> Send back the response.
        res.status(StatusCodes.OK).send(response);
    }
}