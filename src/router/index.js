import express from "express";
import authRouter from "../controller/authController.js";
import productRouter from "../controller/productController.js";
import usersRouter from "../controller/usersController.js";

const appRouter = express.Router();

appRouter.use("/users/auth", authRouter);
appRouter.use("/users", usersRouter);
appRouter.use("/producto", productRouter);

export default appRouter;
