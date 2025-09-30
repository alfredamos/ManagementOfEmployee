import express from 'express';
import {AuthController} from "../controllers/auth.controller";
import {changeUserImageMiddleware} from "../middlewares/changeUserImage.middleware";
import {changeUserPasswordMiddleware} from "../middlewares/changeUserPassword.middleware";
import {changeUserNameMiddleware} from "../middlewares/changeUserName.middleware";
import {signupUserMiddleware} from "../middlewares/signupUser.middleware";
import {loginUserMiddleware} from "../middlewares/loginUser.middleware";

//----> Get router from express.
const router = express.Router();

//----> Change password route.
router.route("/change-password").patch(changeUserPasswordMiddleware, AuthController.changeUserPassword);

//----> Change name route.
router.route("/change-name").patch(changeUserNameMiddleware, AuthController.changeUserName);

//----> Change image route.
router.route("/change-image").patch(changeUserImageMiddleware, AuthController.changeUserImage);

//----> Get current user route.
router.route("/me").get(AuthController.getCurrentUser);

//----> Login user route.
router.route("/login").post(loginUserMiddleware, AuthController.loginUser);

//----> Logout user route.
router.route("/logout").post(AuthController.logoutUser);

//----> Signup user route.
router.route("/signup").post(signupUserMiddleware, AuthController.signupUser);

//----> Refresh user token route.
router.route("/refresh").post(AuthController.refreshUserToken);

export default router;
