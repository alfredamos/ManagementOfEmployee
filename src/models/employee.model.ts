import prisma from "../db/prisma.db";
import catchError from "http-errors";
import {StatusCodes} from "http-status-codes";
import {ResponseMessage} from "../utils/responseMessage.util";
import {Employee} from "@prisma/client";
import {Request} from "express";
import {ownershipAndAdminCheckUtil} from "../utils/ownershipAndAdminCheck.util";

class EmployeeModel{
    ////----> Delete employee by id function.
    async deleteEmployeeById(id: string){
        //----> Fetch employee with the given id.
        const employee = await this.existEmployeeById(id);

        //----> Delete the employee with the given id.
        await prisma.employee.delete({where : {id}});

        //----> Delete the user associated with the employee.
        await prisma.user.delete({where: {id: employee.userId}});

        //----> Send back the response.
        return new ResponseMessage("Employee  has been deleted successfully!", "success", StatusCodes.OK);

    }

    async editEmployeeById(id: string, employeeToEdit: Employee, req: Request){
        //----> Fetch the employee with the given id.
        const employee = await this.existEmployeeById(id);

        //----> Check for ownership or admin.
        ownershipAndAdminCheckUtil(req, employee.userId);

        //----> Fetch user associated with this employee.
        const user = await prisma.user.findUnique({where: {id: employeeToEdit.userId}})

        //----> Edit the employee.
        const editedEmployee = await prisma.employee.update({where : {id}, data: {...employeeToEdit, email: employee.email, userId: employee.userId}});

        //----> Edit name and image in user.
        await prisma.user.update({where: {id: user.id}, data:{...user, name: editedEmployee.name, image: editedEmployee.image}});

        //----> Send back the response.
        return new ResponseMessage("Employee edited successfully", "success", StatusCodes.OK);

    }

    ////----> Fetch employee by id function.
    async getEmployeeById(id: string, req: Request){
        //----> Fetch the employee with the given id.
        const employee = await this.existEmployeeById(id);

        //----> Check for ownership or admin.
        ownershipAndAdminCheckUtil(req, employee.userId);

        //----> send back the response.
        return employee;
    }

    ////----> Fetch all the employees function.
    async getAllEmployees(){
        //----> Fetch all the employees from database.
        const allEmployees = await prisma.employee.findMany({});

        //----> Check for existence of all-users.
        if (allEmployees?.length === 0) {
            throw catchError(StatusCodes.NOT_FOUND, "No employees fround in the database!");
        }

        //----> Send back the response.
        return allEmployees;
    }

    ////----> Fetch employee by email function.
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

    ////----> Fetch employee by email function.
    private async existEmployeeById(id: string){
        //----> Fetch the employee with the given id.
        const employee = await prisma.employee.findUnique({where: {id}});

        //----> Check for existence of employee.
        if (!employee) {
            throw catchError(StatusCodes.NOT_FOUND, "Employee doesn't exist for this id!");
        }

        //----> Send back the response.
        return employee;
    }
}

export const employeeModel = new EmployeeModel();