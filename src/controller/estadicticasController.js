import express, { query } from "express";
import { validationResult } from "express-validator";
import connection from "../db.js";
import {
  errorFormatter,
  formatErrorResponse,
  formatErrorValidator,
  formatResponse,
} from "../helpers/errorFormatter.js";

const estadicticasRouter = express.Router();

estadicticasRouter.get("/get_estadisticas/:iduser", async (req, res) => {
  const resultErrors = validationResult(req).formatWith(errorFormatter);
  if (!resultErrors.isEmpty()) {
    const errorResponse = formatErrorValidator(resultErrors);
    return res.status(422).json(formatResponse({}, errorResponse));
  }

  if (
    !req.query.type ||
    (req.query.type !== "user" && req.query.type !== "admin")
  ) {
    return res
      .status(422)
      .json(
        formatResponse(
          {},
          `El type es un campo obligatorio, seleccione entre user/admin.`
        )
      );
  }

  const newConnection = await connection.awaitGetConnection();

  try {
    const { iduser } = req.params;
    const { type } = req.query;
    const arrayResults = [];

    if (type === "user") {
      const numPublicaciones = await newConnection.awaitQuery(
        `SELECT COUNT(*) totalPublicaciones FROM productos WHERE usuario_idusers= ?`,
        [iduser]
      );

      const numSolicitudes = await newConnection.awaitQuery(
        `SELECT COUNT(*) totalPublicaciones FROM solicitudes WHERE idusers_envia= ?`,
        [iduser]
      );

      const numRechazadas = await newConnection.awaitQuery(
        `SELECT COUNT(*) totalPublicaciones FROM solicitudes s
            INNER JOIN productos p
            ON p.idproductos= s.fk_idproductos
            INNER JOIN usuario u
            ON u.idusers= p.usuario_idusers
        WHERE u.idusers= ? AND s.estado= ?`,
        [iduser, "Rechazada"]
      );

      const numAprobada = await newConnection.awaitQuery(
        `SELECT COUNT(*) totalPublicaciones FROM solicitudes s
            INNER JOIN productos p
            ON p.idproductos= s.fk_idproductos
            INNER JOIN usuario u
            ON u.idusers= p.usuario_idusers
        WHERE u.idusers= ? AND s.estado= ?`,
        [iduser, "Aprobada"]
      );

      newConnection.release();

      return res.status(201).json(
        formatResponse(
          {
            message: "",
            numPublicaciones: numPublicaciones[0].totalPublicaciones,
            numSolicitudes: numSolicitudes[0].totalPublicaciones,
            numRechazadas: numRechazadas[0].totalPublicaciones,
            numAprobada: numAprobada[0].totalPublicaciones,
          },
          ""
        )
      );
    }

    if (type === "admin") {
      const empresaExit = await newConnection.awaitQuery(
        `SELECT * FROM empresa WHERE idempresa= ?`,
        [iduser]
      );

      if (!empresaExit[0]) {
        newConnection.release();
        return res
          .status(422)
          .json(
            formatResponse(
              {},
              `La empresa no se encuentra en la base de datos, comprueba que el ID de la empresa es correcto.`
            )
          );
      }

      const numPublicaciones = await newConnection.awaitQuery(
        `SELECT COUNT(*) totalPublicaciones FROM productos p
        INNER JOIN usuario u
        ON u.idusers = p.usuario_idusers
        INNER JOIN empresa e
        ON e.idempresa = u.empresa_idempresa
        INNER JOIN roles r
        ON r.idroles= u.roles_idroles
        WHERE u.empresa_idempresa= ? AND r.name_rol= ?`,
        [iduser, "Operario"]
      );

      const numSolicitudes = await newConnection.awaitQuery(
        `SELECT COUNT(*) totalPublicaciones FROM solicitudes s
        INNER JOIN usuario u
        ON u.idusers = s.idusers_envia
        INNER JOIN empresa e
        ON e.idempresa = u.empresa_idempresa
        INNER JOIN roles r
        ON r.idroles= u.roles_idroles
        WHERE u.empresa_idempresa= ? AND r.name_rol= ?`,
        [iduser, "Operario"]
      );

      const numRechazadas = await newConnection.awaitQuery(
        `SELECT COUNT(*) totalPublicaciones FROM solicitudes s
            INNER JOIN productos p
            ON p.idproductos= s.fk_idproductos
            INNER JOIN usuario u
            ON u.idusers= p.usuario_idusers
            INNER JOIN empresa e
            ON e.idempresa = u.empresa_idempresa
            INNER JOIN roles r
            ON r.idroles= u.roles_idroles
        WHERE u.empresa_idempresa= ? AND r.name_rol= ? AND s.estado= ?`,
        [iduser, "Operario", "Rechazada"]
      );

      const numAprobada = await newConnection.awaitQuery(
        `SELECT COUNT(*) totalPublicaciones FROM solicitudes s
            INNER JOIN productos p
            ON p.idproductos= s.fk_idproductos
            INNER JOIN usuario u
            ON u.idusers= p.usuario_idusers
            INNER JOIN empresa e
            ON e.idempresa = u.empresa_idempresa
            INNER JOIN roles r
            ON r.idroles= u.roles_idroles
        WHERE u.empresa_idempresa= ? AND r.name_rol= ? AND s.estado= ?`,
        [iduser, "Operario", "Aprobada"]
      );

      newConnection.release();

      return res.status(201).json(
        formatResponse(
          {
            message: "",
            numPublicaciones: numPublicaciones[0].totalPublicaciones,
            numSolicitudes: numSolicitudes[0].totalPublicaciones,
            numRechazadas: numRechazadas[0].totalPublicaciones,
            numAprobada: numAprobada[0].totalPublicaciones,
          },
          ""
        )
      );
    }
  } catch (error) {
    console.log(error);
    newConnection.release();
    const errorFormated = formatErrorResponse(error);
    return res.status(500).json(errorFormated);
  }
});

export default estadicticasRouter;
