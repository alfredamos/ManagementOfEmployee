import express from 'express';
import {AuthController} from "../controllers/auth.controller";

//----> Get router from express.
const router = express.Router();

router.route("/change-password").patch(AuthController.changeUserPassword);

router.route("/change-name").patch(AuthController.changeUserName);

router.route("/change-image").patch(AuthController.changeUserImage);

router.route("/me").get(AuthController.getCurrentUser);

router.route("/login").post(AuthController.loginUser);

router.route("/signup").post(AuthController.signupUser);

router.route("/refresh").post(AuthController.refreshUserToken)
