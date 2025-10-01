import express from 'express';
import {checkValidIdParam} from "../middlewares/checkValidIdParam.middleware";
import {EmployeeController} from "../controllers/employee.controller";
import {UserController} from "../controllers/user.controller";
import {cookieBasedAuthenticationMiddleware} from "../middlewares/cookieBasedAuthentication.middleware";
import {cookieBasedAdminRoleMiddleware} from "../middlewares/cookieBasedAdminRole.middleware";
import {employeeMiddleware} from "../middlewares/employee.middleware";


//----> Get router from express.
const router = express.Router();

//----> Check for valid id.
router.param("id", checkValidIdParam);

//----> Fetch all employees.
router.route("/")
    .get(EmployeeController.getAllEmployees);

//----> Delete user by id, get user by id and edit user by id routes.
router.route("/:id")
    .delete(EmployeeController.deleteEmployeeById)
    .get(EmployeeController.getEmployeeById)
    .patch(employeeMiddleware, EmployeeController.editEmployeeById);

export default router;