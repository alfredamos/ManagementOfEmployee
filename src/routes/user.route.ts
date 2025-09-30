import express from 'express';
import {checkValidIdParam} from "../middlewares/checkValidIdParam.middleware";
import {UserController} from "../controllers/user.controller";
import {sameUserCheckMiddleware} from "../middlewares/sameUserCheck.middleware";


//----> Get router from express.
const router = express.Router();

//----> Check for valid id.
router.param("id", checkValidIdParam);

//----> Get all users route.
router.route("/").get(UserController.getAllUsers);

//----> Get user by id and delete user by id routes
router.route("/:id")
    .delete(UserController.deleteUserById)
    .get(sameUserCheckMiddleware, UserController.getUserById);

export default router;