import express from 'express';
import {checkValidUserIdParam} from "../middlewares/checkValidUserIdParam.middleware";
import {TokenController} from "../controllers/token.controller";
import {sameUserCheckMiddleware} from "../middlewares/sameUserCheck.middleware";


//----> Get router from express.
const router = express.Router();

//----> Check for valid id.
router.param("userId", checkValidUserIdParam);

//----> Delete all invalid tokens route.
router.route("/all/delete-all")
    .delete(TokenController.deleteAllRevokedTokens);

//----> Delete all invalid tokens by user id route.
router.route("/delete-by-user-id/:userId")
    .delete(sameUserCheckMiddleware, TokenController.deleteAllRevokedTokensByUserId);

export default router;