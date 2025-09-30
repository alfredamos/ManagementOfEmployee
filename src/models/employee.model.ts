import prisma from "../db/prisma.db";
import catchError from "http-errors";
import {StatusCodes} from "http-status-codes";

class EmployeeModel{
    async getEmployeeByEmail(email: string){
        //----> Fetch the employee with the given email.
        const employee = await prisma.employee.findUnique({where: {email}});

        //----> Check for existence of employee.
        if (!employee) {
            throw catchError(StatusCodes.NOT_FOUND, "Employee doesn't exist for this email!");
        }

        //----> Send back the response.
        return employee;
    }
}

export const employeeModel = new EmployeeModel();