import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.route";
import notFoundRouteMiddleware from "./middlewares/notFoundrouteHandler.middleware";
import errorHandlerMiddleware from "./middlewares/errorHandler.middleware";
import {cookieBasedAuthenticationMiddleware} from "./middlewares/cookieBasedAuthentication.middleware";
import {cookieBasedAdminRoleMiddleware} from "./middlewares/cookieBasedAdminRole.middleware";

dotenv.config();

//----> Initialize express app.
const app = express();

//----> Get the port number from environment from file.
const Port = process.env.PORT || 5000;

//----> Parse cookie.
app.use(cookieParser());

//----> Activate cors.
app.use(
    cors({
        credentials: true,
        origin: ["http://localhost:4200", "http://localhost:5173"],
    })
);

//----> Not url encoded
app.use(express.urlencoded({ extended: false }));

//----> Allow json
app.use(express.json());

//----> Jwt cookie based authentication middleware.
app.use(cookieBasedAuthenticationMiddleware);

//----> Admin cookie based middleware.
app.use(cookieBasedAdminRoleMiddleware);

//----> Auth routes.
app.use("/api/auth", authRoutes);

app.use(notFoundRouteMiddleware);
app.use(errorHandlerMiddleware);

//----> Listening port.
app.listen(Port, () => console.log(`App is listening on ${Port}...`));
