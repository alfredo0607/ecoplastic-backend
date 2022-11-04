import express from "express";
import { validationResult } from "express-validator";
import connection from "../db.js";
import {
  errorFormatter,
  formatErrorResponse,
  formatErrorValidator,
  formatResponse,
} from "../helpers/errorFormatter.js";

const notificacionesRouter = express.Router();

notificacionesRouter.get(
  "/get_notificaciones_user/:userID",
  async (req, res) => {
    const resultErrors = validationResult(req).formatWith(errorFormatter);
    if (!resultErrors.isEmpty()) {
      const errorResponse = formatErrorValidator(resultErrors);
      return res.status(422).json(formatResponse({}, errorResponse));
    }

    const newConnection = await connection.awaitGetConnection();

    try {
      const { userID } = req.params;

      const total = await newConnection.awaitQuery(
        `SELECT COUNT(*) totalNotificaciones FROM notificaciones_usuario n WHERE n.fk_userID = ? 
      AND n.estadoNotificacion= ?`,
        [userID, 0]
      );

      const notificationsPqr = await newConnection.awaitQuery(
        `SELECT n.idNotificacion, n.referenciaLink, n.estadoNotificacion,
      n.idReferencia, n.nombreTipo type, n.fechaNotificacion, ue.nombre nombreEnvia, ue.userImage avatar, e.nombre_empresa
      FROM notificaciones_usuario n
      INNER JOIN usuario ue
        ON ue.idusers = n.fk_idSender
        INNER JOIN empresa e
        ON e.idempresa = ue.empresa_idempresa
      WHERE n.fk_userID = ?
      ORDER BY n.idNotificacion DESC
    `,
        [userID]
      );

      newConnection.release();

      return res.status(201).json(
        formatResponse(
          {
            total: total[0].totalNotificaciones,
            notifications: notificationsPqr,
          },
          ""
        )
      );
    } catch (error) {
      console.log(error);
      newConnection.release();
      const errorFormated = formatErrorResponse(error);
      return res.status(500).json(errorFormated);
    }
  }
);

notificacionesRouter.put(
  "/update_notificaciones_usuario/:idNotificaciones",
  async (req, res) => {
    const resultErrors = validationResult(req).formatWith(errorFormatter);
    if (!resultErrors.isEmpty()) {
      const errorResponse = formatErrorValidator(resultErrors);
      return res.status(422).json(formatResponse({}, errorResponse));
    }

    const newConnection = await connection.awaitGetConnection();

    try {
      const { idNotificaciones } = req.params;

      await newConnection.awaitQuery(
        `UPDATE notificaciones_usuario SET estadoNotificacion= ? WHERE idNotificacion= ?`,
        [1, idNotificaciones]
      );

      newConnection.release();

      return res.status(200).json({
        errores: "",
        data: {
          message: "",
        },
      });
    } catch (error) {
      console.log(error);
      newConnection.release();
      const errorFormated = formatErrorResponse(error);
      return res.status(500).json(errorFormated);
    }
  }
);

export default notificacionesRouter;
