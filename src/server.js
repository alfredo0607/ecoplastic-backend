import express from "express";
import swaggerUI from "swagger-ui-express";
import cors from "cors";
import http from "http";
import dotenv from "dotenv";
import docs from "./docs/index.js";
import { logger } from "./config.js";
import appRouter from "./router/index.js";
import "./db.js";
import morgan from "morgan";
import fileupload from "express-fileupload";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import { Server } from "socket.io";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(cors({ origin: "*" }));
app.use(fileupload());

// if (process.env.NODE_ENV === "development") {
app.use(morgan("dev"));
// }

const httpsServer = http.createServer(app);
const io = new Server(httpsServer, { cors: { origin: "*" } });

app.use(
  "/uploads",
  express.static(path.join(__dirname, "public", "uploads"), {
    fallthrough: false,
  })
);

httpsServer.listen(process.env.PORT, () => {
  logger.info(`Server is running on port: ${process.env.PORT}`);
  console.log(`Server is running on port: ${process.env.PORT}`);
});

app.use((req, res, next) => {
  if (req.secure) {
    res.redirect(`http://${req.headers.host}${req.url}`);
  } else next();
});

app.use("/api/v1", appRouter);
app.use("/", swaggerUI.serve, swaggerUI.setup(docs));

app.set("socketio", io);

io.on("connection", (socket) => {
  socket.join(`notificaciones ${socket.handshake.query.userID}`);
  console.log("Nuevo cliente: ", socket.id);
});

app.get("*", function (req, res) {
  res.status(404).send("Error 404 - Recurso no encontrado.");
});
