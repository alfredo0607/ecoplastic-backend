import dayjs from "dayjs";
import es from "dayjs/locale/es.js";
import express from "express";
import { body, validationResult } from "express-validator";
import connection from "../db.js";
import {
  errorFormatter,
  formatErrorResponse,
  formatErrorValidator,
  formatResponse,
} from "../helpers/errorFormatter.js";
import { NotificacionesUsers } from "../helpers/NotificacionesUsers.js";

const routerSolicitudes = express.Router();

routerSolicitudes.post(
  "/nueva_solicitud/:idEnvia/:idProducto",
  [
    body("mensaje").notEmpty().withMessage("El mensaje es obligatorio"),
    body("arrayProductInt")
      .isArray({ min: 1 })
      .withMessage(
        "La solicitud debe tener por lo menos un producti a intercambiar"
      ),
  ],
  async (req, res) => {
    const resultErrors = validationResult(req).formatWith(errorFormatter);
    if (!resultErrors.isEmpty()) {
      const errorResponse = formatErrorValidator(resultErrors);
      return res.status(422).json(formatResponse({}, errorResponse));
    }

    const newConnection = await connection.awaitGetConnection();
    await newConnection.awaitBeginTransaction();

    try {
      const { mensaje, arrayProductInt } = req.body;

      const { idEnvia, idProducto } = req.params;

      const day = dayjs().locale(es).format("YYYY/MM/DD HH:mm");

      const request = await newConnection.awaitQuery(
        `INSERT INTO solicitudes(mensaje, createDate, fk_idproductos, idusers_envia) VALUES(?, ?, ?, ?)`,
        [mensaje, day, idProducto, idEnvia]
      );

      const requestID = request.insertId;

      for (const iterator of arrayProductInt) {
        await newConnection.awaitQuery(
          `INSERT INTO producto_de_intercambio VALUES(?, ?)`,
          [requestID, iterator.id]
        );
      }

      const userProduct = await newConnection.awaitQuery(
        `SELECT usuario_idusers id FROM productos WHERE idproductos= ?`,
        [idProducto]
      );

      const io = req.app.get("socketio");

      NotificacionesUsers(
        io,
        userProduct,
        `/app/detail_solicitudes/${requestID}/user`,
        "notificaciones_nueva_solicitud_usuario",
        requestID,
        "nueva_solicitud",
        idEnvia,
        ""
      );

      await newConnection.awaitCommit();
      newConnection.release();

      return res
        .status(201)
        .json(formatResponse({ message: "Solicitud enviada con exito" }, ""));
    } catch (error) {
      console.log(error);
      await newConnection.awaitRollback();
      newConnection.release();
      const errorFormated = formatErrorResponse(error);
      return res.status(500).json(errorFormated);
    }
  }
);

routerSolicitudes.post(
  "/nuevo_mensaje/:idEnvia/:idSolicitud",
  [body("textoMensaje").notEmpty().withMessage("El mensaje es obligatorio")],
  async (req, res) => {
    const resultErrors = validationResult(req).formatWith(errorFormatter);
    if (!resultErrors.isEmpty()) {
      const errorResponse = formatErrorValidator(resultErrors);
      return res.status(422).json(formatResponse({}, errorResponse));
    }

    const newConnection = await connection.awaitGetConnection();
    await newConnection.awaitBeginTransaction();

    try {
      const { textoMensaje } = req.body;

      const { idEnvia, idSolicitud } = req.params;

      const day = dayjs().locale(es).format("YYYY/MM/DD HH:mm");

      const request = await newConnection.awaitQuery(
        `INSERT INTO mensajes_solicitud(fk_idSolicitud, textoMensaje, fechaMensaje, fk_idUsuarioEnvia) VALUES(?, ?, ?, ?)`,
        [idSolicitud, textoMensaje, day, idEnvia]
      );

      const userRequest = await newConnection.awaitQuery(
        `SELECT idusers_envia id, fk_idproductos FROM solicitudes WHERE idSolicitud= ?`,
        [idSolicitud]
      );

      const { id, fk_idproductos } = userRequest[0];

      const userProduct = await newConnection.awaitQuery(
        `SELECT usuario_idusers id FROM productos WHERE idproductos= ?`,
        [fk_idproductos]
      );

      const io = req.app.get("socketio");

      if (id === Number(idEnvia)) {
        NotificacionesUsers(
          io,
          userProduct,
          `/app/detail_solicitudes/${idSolicitud}/user`,
          "notificaciones_nueva_mensaje_solicitud_usuario",
          idSolicitud,
          "nueva_mensaje_solicitud",
          idEnvia,
          ""
        );
      } else {
        NotificacionesUsers(
          io,
          userRequest,
          `/app/detail_solicitudes/${idSolicitud}/user`,
          "notificaciones_nueva_mensaje_solicitud_usuario",
          idSolicitud,
          "nueva_mensaje_solicitud",
          idEnvia,
          ""
        );
      }

      await newConnection.awaitCommit();
      newConnection.release();

      return res
        .status(201)
        .json(formatResponse({ message: "Mensaje enviado con exito" }, ""));
    } catch (error) {
      console.log(error);
      await newConnection.awaitRollback();
      newConnection.release();
      const errorFormated = formatErrorResponse(error);
      return res.status(500).json(errorFormated);
    }
  }
);

routerSolicitudes.get("/get_mis_solicitud/:id", async (req, res) => {
  const resultErrors = validationResult(req).formatWith(errorFormatter);
  if (!resultErrors.isEmpty()) {
    const errorResponse = formatErrorValidator(resultErrors);
    return res.status(422).json(formatResponse({}, errorResponse));
  }

  const newConnection = await connection.awaitGetConnection();

  try {
    const { id } = req.params;

    const request = await newConnection.awaitQuery(
      `SELECT * FROM solicitudes WHERE idusers_envia= ? ORDER BY createDate DESC`,
      [id]
    );

    newConnection.release();

    return res
      .status(201)
      .json(
        formatResponse({ message: "Solicitud enviada con exito", request }, "")
      );
  } catch (error) {
    console.log(error);
    newConnection.release();
    const errorFormated = formatErrorResponse(error);
    return res.status(500).json(errorFormated);
  }
});

routerSolicitudes.get("/get_mis_solicitud_productos/:id", async (req, res) => {
  const resultErrors = validationResult(req).formatWith(errorFormatter);
  if (!resultErrors.isEmpty()) {
    const errorResponse = formatErrorValidator(resultErrors);
    return res.status(422).json(formatResponse({}, errorResponse));
  }

  const newConnection = await connection.awaitGetConnection();

  try {
    const { id } = req.params;

    const arrayResults = [];

    const request = await newConnection.awaitQuery(
      `SELECT * FROM productos WHERE usuario_idusers= ?`,
      [id]
    );

    if (!request[0]) {
      newConnection.release();
      return res
        .status(204)
        .json(formatResponse({}, `No se encontraron productos.`));
    }

    for (const iterator of request) {
      const { idproductos } = iterator;

      const requestProduct = await newConnection.awaitQuery(
        `SELECT * FROM solicitudes WHERE fk_idproductos= ? ORDER BY createDate DESC`,
        [idproductos]
      );

      for (let index = 0; index < requestProduct.length; index++) {
        arrayResults.push(requestProduct[index]);
      }
    }

    newConnection.release();

    return res.status(201).json(formatResponse({ request: arrayResults }, ""));
  } catch (error) {
    console.log(error);
    newConnection.release();
    const errorFormated = formatErrorResponse(error);
    return res.status(500).json(errorFormated);
  }
});

routerSolicitudes.get("/get_admin_solicitud/:idEmpresa", async (req, res) => {
  const resultErrors = validationResult(req).formatWith(errorFormatter);
  if (!resultErrors.isEmpty()) {
    const errorResponse = formatErrorValidator(resultErrors);
    return res.status(422).json(formatResponse({}, errorResponse));
  }

  const newConnection = await connection.awaitGetConnection();

  try {
    const { idEmpresa } = req.params;
    const arrayResults = [];

    const userOperator = await newConnection.awaitQuery(
      `SELECT * FROM usuario u
        INNER JOIN roles r
        ON r.idroles= u.roles_idroles
      WHERE u.empresa_idempresa= ? AND r.name_rol= ?`,
      [idEmpresa, "Operario"]
    );

    for (const iterator of userOperator) {
      const { idusers } = iterator;

      const request = await newConnection.awaitQuery(
        `SELECT * FROM solicitudes WHERE idusers_envia= ? ORDER BY createDate DESC`,
        [idusers]
      );

      for (let index = 0; index < request.length; index++) {
        arrayResults.push(request[index]);
      }
    }

    newConnection.release();

    return res
      .status(201)
      .json(formatResponse({ message: "", request: arrayResults }, ""));
  } catch (error) {
    console.log(error);
    newConnection.release();
    const errorFormated = formatErrorResponse(error);
    return res.status(500).json(errorFormated);
  }
});

routerSolicitudes.get(
  "/get_solicitud_detalle/:idSolicitud/:tipo",
  async (req, res) => {
    const resultErrors = validationResult(req).formatWith(errorFormatter);
    if (!resultErrors.isEmpty()) {
      const errorResponse = formatErrorValidator(resultErrors);
      return res.status(422).json(formatResponse({}, errorResponse));
    }

    const newConnection = await connection.awaitGetConnection();

    try {
      const { idSolicitud, tipo } = req.params;

      if (tipo === "user") {
        const solicitudBase = await newConnection.awaitQuery(
          `SELECT s.idSolicitud solicitudID, s.estado, s.createDate, s.mensaje, s.idusers_envia, s.fk_idproductos, 
            (SELECT textoMensaje FROM mensajes_solicitud WHERE fk_idSolicitud = s.idSolicitud ORDER BY fechaMensaje ASC LIMIT 1) descripcion
            FROM solicitudes s
            WHERE s.idSolicitud = ?
          `,
          [idSolicitud]
        );

        const { fk_idproductos, solicitudID, idusers_envia } = solicitudBase[0];

        const productoSolicitud = await newConnection.awaitQuery(
          `SELECT idproductos, titulo, cover, usuario_idusers FROM productos WHERE idproductos = ?
          `,
          [fk_idproductos]
        );

        const { usuario_idusers } = productoSolicitud[0];

        const productoIntercambio = await newConnection.awaitQuery(
          `SELECT idproductos, titulo, cover FROM producto_de_intercambio  pdi
            INNER JOIN productos p
            ON p.idproductos = pdi.productos_idproductos
          WHERE pdi.solicitudes_idSolicitud = ?
            `,
          [solicitudID]
        );

        const userEnvia = await newConnection.awaitQuery(
          `SELECT u.nombre, u.userImage, e.nombre_empresa FROM usuario u
            INNER JOIN empresa e
            ON e.idempresa= u.empresa_idempresa
          WHERE u.idusers = ?
            `,
          [idusers_envia]
        );

        const userGestiona = await newConnection.awaitQuery(
          `SELECT u.nombre, u.userImage, e.nombre_empresa FROM usuario u
              INNER JOIN empresa e
              ON e.idempresa= u.empresa_idempresa
            WHERE u.idusers = ?
              `,
          [usuario_idusers]
        );

        const getPedido = await newConnection.awaitQuery(
          `SELECT * FROM pedido  WHERE fk_idSolicitud = ?
              `,
          [solicitudID]
        );

        newConnection.release();

        return res.status(201).json({
          errores: "",
          data: {
            solicitud: {
              ...solicitudBase[0],
              productoSolicitud: productoSolicitud,
              productoIntercambio: productoIntercambio,
              userEnvia,
              userGestiona,
              pedido: getPedido && getPedido[0] ? getPedido[0] : null,
            },
          },
        });
      }

      newConnection.release();

      return res
        .status(201)
        .json(formatResponse({ message: "Solicitud enviada con exito" }, ""));
    } catch (error) {
      console.log(error);
      newConnection.release();
      const errorFormated = formatErrorResponse(error);
      return res.status(500).json(errorFormated);
    }
  }
);

routerSolicitudes.get(
  "/obtener_mensajes_solicitud/:idSolicitud",
  async (req, res) => {
    const newConnection = await connection.awaitGetConnection();

    try {
      let offset = 0;
      let mensajesResponse = [];
      let hasNextPage = false;

      const { idSolicitud } = req.params;
      const { page, limit } = req.query;

      if (parseInt(page) < 1) {
        offset = 0;
      } else {
        offset = parseInt(page) * 10;
      }

      const totalMensajes = await newConnection.awaitQuery(
        `SELECT COUNT(*) totalMensajes FROM mensajes_solicitud WHERE fk_idSolicitud = ?`,
        [idSolicitud]
      );

      const mensajesSolicitud = await newConnection.awaitQuery(
        `SELECT m.fk_idSolicitud idSolicitud, m.idMensaje, m.textoMensaje, m.fechaMensaje, m.fk_idUsuarioEnvia idSender,
          u.nombre nombreUsuarioEnvia, u.userImage imagenUsuarioEnvia
          FROM mensajes_solicitud m
          INNER JOIN usuario u
            ON u.idusers = m.fk_idUsuarioEnvia
          WHERE m.fk_idSolicitud = ?
          ORDER BY m.idMensaje DESC
          LIMIT ?, ?
        `,
        [idSolicitud, 0, parseInt(10)]
      );

      if (
        parseInt(totalMensajes[0].totalMensajes) >
        parseInt(offset + parseInt(mensajesSolicitud.length))
      )
        hasNextPage = true;
      else hasNextPage = false;

      for (const mensaje of mensajesSolicitud) {
        const usuarioEnvia = await newConnection.awaitQuery(
          `SELECT idusers_envia FROM solicitudes WHERE idSolicitud = ?`,
          [mensaje.idSolicitud]
        );

        if (mensaje.textoMensaje.includes("File:System_AutoMessages")) {
          const fileInfo = await newConnection.awaitQuery(
            `SELECT aa.nombreServidor, aa.nombreCliente, aa.pesoArchivo, aa.extensionArchivo, aa.fechaCreado
              FROM archivos_adjuntos aa
              INNER JOIN ref_archivos_adjuntos ra
                ON aa.idArchivo = ra.f_idArchivo
              WHERE ra.seccionReferencia = 'archivos_mensajes_solicitud_adjunto' AND ra.idReferencia = ?
              ORDER BY aa.idArchivo DESC
              LIMIT 1
            `,
            [mensaje.idMensaje]
          );

          mensajesResponse.push({
            ...mensaje,
            senderCreator:
              parseInt(mensaje.idSender) ===
              parseInt(usuarioEnvia[0].fk_usuarioEnvia)
                ? true
                : false,
            system: false,
            file: true,
            fileInfo: fileInfo[0],
          });
        } else if (
          mensaje.textoMensaje.includes("System:System_AutoMessages")
        ) {
          mensajesResponse.push({
            ...mensaje,
            textoMensaje: mensaje.textoMensaje.replace(
              "System:System_AutoMessages ",
              ""
            ),
            senderCreator:
              parseInt(mensaje.idSender) ===
              parseInt(usuarioEnvia[0].fk_usuarioEnvia)
                ? true
                : false,
            system: true,
            file: false,
            fileInfo: null,
          });
        } else {
          mensajesResponse.push({
            ...mensaje,
            senderCreator:
              parseInt(mensaje.idSender) ===
              parseInt(usuarioEnvia[0].fk_usuarioEnvia)
                ? true
                : false,
            system: false,
            file: false,
            fileInfo: null,
          });
        }
      }

      newConnection.release();

      return res.status(200).json({
        errores: "",
        data: {
          message: `Se encontraron un total de: ${totalMensajes[0].totalMensajes} mensajes`,
          total: totalMensajes[0].totalMensajes,
          messages: mensajesResponse,
          hasNextPage: hasNextPage,
        },
      });
    } catch (error) {
      console.log(error);
      newConnection.release();
      let errors = {
        code: error.code,
        errno: error.errno,
        message: error.sqlMessage,
        state: error.sqlState,
      };

      return res.status(500).json({ errores: errors, data: "" });
    }
  }
);

routerSolicitudes.post(
  "/aprobar_solicitud/:idsolicitud",
  [
    body("pais")
      .notEmpty()
      .withMessage("El pais de entrega es un campo obligatorio"),
    body("dep")
      .notEmpty()
      .withMessage("El departamento de entrega es un campo obligatorio"),
    body("city")
      .notEmpty()
      .withMessage("La ciudad de entrega es un campo obligatorio"),
    body("adre")
      .notEmpty()
      .withMessage("La direccion de entrega es un campo obligatorio"),
    body("nameR")
      .notEmpty()
      .withMessage("El nombre del responsable es un campo obligatorio"),
    body("phone")
      .notEmpty()
      .withMessage("El celular del responsable es un campo obligatorio"),
    body("mensaje")
      .notEmpty()
      .withMessage("El mensaje es un campo obligatorio"),
  ],
  async (req, res) => {
    const resultErrors = validationResult(req).formatWith(errorFormatter);
    if (!resultErrors.isEmpty()) {
      const errorResponse = formatErrorValidator(resultErrors);
      return res.status(422).json(formatResponse({}, errorResponse));
    }

    const newConnection = await connection.awaitGetConnection();
    await newConnection.awaitBeginTransaction();

    try {
      const { pais, dep, city, adre, nameR, phone, mensaje } = req.body;

      const { idsolicitud } = req.params;

      const exitSolicitud = await newConnection.awaitQuery(
        `SELECT * FROM solicitudes WHERE idSolicitud= ?`,
        [idsolicitud]
      );

      if (!exitSolicitud[0]) {
        newConnection.release();
        return res
          .status(422)
          .json(
            formatResponse(
              {},
              `La solicitud no se encuentra en la base de datos, comprueba que el ID de la solicitud es correcto.`
            )
          );
      }

      const newpwdido = await newConnection.awaitQuery(
        `INSERT INTO pedido(fk_idSolicitud, pais, departamento, ciudad, direccion, nombreResponsable, celularResponsable, mensaje) VALUES(?, ?, ?, ?, ?, ?, ?, ?)`,
        [idsolicitud, pais, dep, city, adre, nameR, phone, mensaje]
      );

      await newConnection.awaitQuery(
        `UPDATE solicitudes SET estado= ? WHERE idSolicitud= ?`,
        ["Aprobada", idsolicitud]
      );

      const pedidoSolicitud = await newConnection.awaitQuery(
        `SELECT * FROM pedido WHERE fk_idSolicitud= ?`,
        [idsolicitud]
      );

      const userSolicitud = await newConnection.awaitQuery(
        `SELECT idusers_envia id FROM solicitudes WHERE idSolicitud= ?`,
        [idsolicitud]
      );

      const io = req.app.get("socketio");

      NotificacionesUsers(
        io,
        userSolicitud,
        `/app/detail_solicitudes/${idsolicitud}/user`,
        "notificaciones_aprobar_solicitud_usuario",
        idsolicitud,
        "nueva_aprobar_solicitud",
        userSolicitud[0].id,
        ""
      );

      await newConnection.awaitCommit();
      newConnection.release();

      return res.status(201).json(
        formatResponse(
          {
            message: "Solicitud aprobada con exito",
            pedido: pedidoSolicitud[0],
            status: "Aprobada",
          },
          ""
        )
      );
    } catch (error) {
      console.log(error);
      await newConnection.awaitRollback();
      newConnection.release();
      const errorFormated = formatErrorResponse(error);
      return res.status(500).json(errorFormated);
    }
  }
);

routerSolicitudes.put("/rechazar_solicitud/:idsolicitud", async (req, res) => {
  const resultErrors = validationResult(req).formatWith(errorFormatter);
  if (!resultErrors.isEmpty()) {
    const errorResponse = formatErrorValidator(resultErrors);
    return res.status(422).json(formatResponse({}, errorResponse));
  }

  const newConnection = await connection.awaitGetConnection();
  await newConnection.awaitBeginTransaction();

  try {
    const { idsolicitud } = req.params;

    const exitSolicitud = await newConnection.awaitQuery(
      `SELECT * FROM solicitudes WHERE idSolicitud= ?`,
      [idsolicitud]
    );

    if (!exitSolicitud[0]) {
      newConnection.release();
      return res
        .status(422)
        .json(
          formatResponse(
            {},
            `La solicitud no se encuentra en la base de datos, comprueba que el ID de la solicitud es correcto.`
          )
        );
    }

    await newConnection.awaitQuery(
      `UPDATE solicitudes SET estado= ? WHERE idSolicitud= ?`,
      ["Rechazada", idsolicitud]
    );

    const userSolicitud = await newConnection.awaitQuery(
      `SELECT idusers_envia id FROM solicitudes WHERE idSolicitud= ?`,
      [idsolicitud]
    );

    const io = req.app.get("socketio");

    NotificacionesUsers(
      io,
      userSolicitud,
      `/app/detail_solicitudes/${idsolicitud}/user`,
      "notificaciones_rechazar_solicitud_usuario",
      idsolicitud,
      "nueva_rechazar_solicitud",
      userSolicitud[0].id,
      ""
    );

    await newConnection.awaitCommit();
    newConnection.release();

    return res
      .status(201)
      .json(
        formatResponse(
          { message: "Solicitud rechazada con exito", status: "Rechazada" },
          ""
        )
      );
  } catch (error) {
    console.log(error);
    await newConnection.awaitRollback();
    newConnection.release();
    const errorFormated = formatErrorResponse(error);
    return res.status(500).json(errorFormated);
  }
});

export default routerSolicitudes;
