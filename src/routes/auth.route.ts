import express from 'express';
import {AuthController} from "../controllers/auth.controller";
import {cookieBasedAuthenticationMiddleware} from "../middlewares/cookieBasedAuthentication.middleware";
import {changeUserImageMiddleware} from "../middlewares/changeUserImage.middleware";
import {changeUserPasswordMiddleware} from "../middlewares/changeUserPassword.middleware";
import {changeUserNameMiddleware} from "../middlewares/changeUserName.middleware";

//----> Get router from express.
const router = express.Router();

router.route("/change-password").patch(changeUserPasswordMiddleware, cookieBasedAuthenticationMiddleware, AuthController.changeUserPassword);

router.route("/change-name").patch(changeUserNameMiddleware, cookieBasedAuthenticationMiddleware, AuthController.changeUserName);

router.route("/change-image").patch(changeUserImageMiddleware, cookieBasedAuthenticationMiddleware, AuthController.changeUserImage);

router.route("/me").get(cookieBasedAuthenticationMiddleware, AuthController.getCurrentUser);

router.route("/login").post(AuthController.loginUser);

router.route("/signup").post(AuthController.signupUser);

router.route("/refresh").post(AuthController.refreshUserToken);

export default router;
