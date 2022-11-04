import express from "express";
import authRouter from "../controller/authController.js";
import estadicticasRouter from "../controller/estadicticasController.js";
import notificacionesRouter from "../controller/NotificacionesController.js";
import productRouter from "../controller/productController.js";
import routerSolicitudes from "../controller/solicitudesController.js";
import usersRouter from "../controller/usersController.js";

const appRouter = express.Router();

appRouter.use("/users/auth", authRouter);
appRouter.use("/users", usersRouter);
appRouter.use("/producto", productRouter);
appRouter.use("/solicitudes", routerSolicitudes);
appRouter.use("/estadisticas", estadicticasRouter);
appRouter.use("/notificaciones", notificacionesRouter);

export default appRouter;
