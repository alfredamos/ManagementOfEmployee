import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.route";
import notFoundRouteMiddleware from "./middlewares/notFoundrouteHandler.middleware";
import errorHandlerMiddleware from "./middlewares/errorHandler.middleware";

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

//----> Auth routes.
app.use("/api/auth", authRoutes);

app.use(notFoundRouteMiddleware);
app.use(errorHandlerMiddleware);

//----> Listening port.
app.listen(Port, () => console.log(`App is listening on ${Port}...`));
