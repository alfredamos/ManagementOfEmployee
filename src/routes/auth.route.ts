import express from 'express';
import {AuthController} from "../controllers/auth.controller";
import {changeUserImageMiddleware} from "../middlewares/changeUserImage.middleware";
import {changeUserPasswordMiddleware} from "../middlewares/changeUserPassword.middleware";
import {changeUserNameMiddleware} from "../middlewares/changeUserName.middleware";
import {signupUserMiddleware} from "../middlewares/signupUser.middleware";
import {loginUserMiddleware} from "../middlewares/loginUser.middleware";

//----> Get router from express.
const router = express.Router();

router.route("/change-password").patch(changeUserPasswordMiddleware, AuthController.changeUserPassword);

router.route("/change-name").patch(changeUserNameMiddleware, AuthController.changeUserName);

router.route("/change-image").patch(changeUserImageMiddleware, AuthController.changeUserImage);

router.route("/me").get(AuthController.getCurrentUser);

router.route("/login").post(loginUserMiddleware, AuthController.loginUser);

router.route("/logout").post(AuthController.logoutUser);

router.route("/signup").post(signupUserMiddleware, AuthController.signupUser);

router.route("/refresh").post(AuthController.refreshUserToken);

export default router;
