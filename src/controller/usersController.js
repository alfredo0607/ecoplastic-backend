import dayjs from "dayjs";
import es from "dayjs/locale/es.js";
import express from "express";
import { body, check, validationResult } from "express-validator";
import connection from "../db.js";
import codeGenerator from "../helpers/codeGenerator.js";
import {
  errorFormatter,
  formatErrorResponse,
  formatErrorValidator,
  formatResponse,
} from "../helpers/errorFormatter.js";
import { sendEmail } from "../helpers/mailer.js";
import { getArrayWhereQueryUsers } from "../helpers/queriesHelper.js";
import uploadFile from "../helpers/uploadFile.js";
import { welcomeEmailTemplates } from "../helpers/welcomeEmailTemplates.js";
import isAdmin from "../utils/isAdmin.js";
import checkToken from "../utils/middlewares.js";

const usersRouter = express.Router();

const mimeTypes = [
  "application/msword",
  "application/vnd.ms-word.document.macroEnabled.12",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.template",
  "application/vnd.ms-word.template.macroEnabled.12",
  "application/pdf",
  "application/vnd.ms-powerpoint.template.macroEnabled.12",
  "application/vnd.openxmlformats-officedocument.presentationml.template",
  "application/vnd.ms-powerpoint.addin.macroEnabled.12",
  "application/vnd.openxmlformats-officedocument.presentationml.slideshow",
  "application/vnd.openxmlformats-officedocument.presentationml.slideshow",
  "application/vnd.ms-powerpoint.slideshow.macroEnabled.12",
  "application/vnd.ms-powerpoint",
  "application/vnd.ms-powerpoint.presentation.macroEnabled.12",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "text/plain",
  "text/csv",
  "application/json",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel.sheet.binary.macroEnabled.12",
  "application/vnd.ms-excel",
  "application/vnd.ms-excel.sheet.macroEnabled.12",
  "application/x-rar-compressed",
  "application/octet-stream",
  "application/zip",
  "application/octet-stream",
  "application/x-zip-compressed",
  "multipart/x-zip",
  "image/bmp",
  "image/gif",
  "image/jpeg",
  "image/png",
];

usersRouter.post(
  "/register_users_operator",
  [
    body("cedula").notEmpty().withMessage("La cedula es un campo obligatorio"),
    body("email").notEmpty().withMessage("El correo es un campo obligatorio"),
    body("email").isEmail().withMessage("Ingrese un correo valido"),
    body("barrio").notEmpty().withMessage("El barrio es un campo obligatorio"),
    body("phone").notEmpty().withMessage("El celular es un campo obligatorio"),
    body("ciudad").notEmpty().withMessage("La ciudad es un campo obligatorio"),
    body("direccion")
      .notEmpty()
      .withMessage("La direccion es un campo obligatorio"),
    body("fecha_nacimiento")
      .notEmpty()
      .withMessage("La fecha de nacimiento es un campo obligatorio"),
    body("genero").notEmpty().withMessage("El genero es un campo obligatorio"),
    body("nombre").notEmpty().withMessage("El nombre es un campo obligatorio"),
    body("localida")
      .notEmpty()
      .withMessage("La localidad es un campo obligatorio"),
    body("businessID")
      .notEmpty()
      .withMessage("El ID de la empresa es obligatorio"),
  ],
  isAdmin,
  async (req, res) => {
    const resultErrors = validationResult(req).formatWith(errorFormatter);
    if (!resultErrors.isEmpty()) {
      const errorResponse = formatErrorValidator(resultErrors);
      return res.status(422).json(formatResponse({}, errorResponse));
    }

    const newConnection = await connection.awaitGetConnection();
    await newConnection.awaitBeginTransaction();

    try {
      const {
        cedula,
        email,
        nombre,
        genero,
        barrio,
        phone,
        ciudad,
        localida,
        direccion,
        fecha_nacimiento,
        businessID,
        adicionales,
        numero,
        tipoNumero,
        nota,
      } = req.body;

      const existUsers = await newConnection.awaitQuery(
        `SELECT * FROM usuario  WHERE cedula= ?`,
        [cedula]
      );

      if (existUsers[0]) {
        newConnection.release();
        return res
          .status(422)
          .json(
            formatResponse(
              {},
              `El numero de cedula ${cedula} ya se encuentra registrado.`
            )
          );
      }

      const existEmail = await newConnection.awaitQuery(
        `SELECT * FROM usuario  WHERE email= ?`,
        [email]
      );

      if (existEmail[0]) {
        newConnection.release();
        return res
          .status(422)
          .json(
            formatResponse({}, `El correo ${email} ya se encuentra registrado.`)
          );
      }

      const existRol = await newConnection.awaitQuery(
        `SELECT * FROM roles WHERE name_rol= ?`,
        ["Operario"]
      );

      if (!existRol[0]) {
        newConnection.release();
        return res
          .status(422)
          .json(
            formatResponse(
              {},
              `Hubo un error, por favor consultar los roles en la base de datos.`
            )
          );
      }

      const rolID = existRol[0].idroles;

      const fechanc = dayjs(fecha_nacimiento).locale(es).format("YYYY-MM-DD");

      const usersInsert = await newConnection.awaitQuery(
        `INSERT INTO usuario(cedula, nombre, genero, email, phone, fecha_nacimiento, userImage, estadoUsuario, empresa_idempresa, roles_idroles)
         VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          cedula,
          nombre,
          genero,
          email,
          phone,
          fechanc,
          null,
          1,
          businessID,
          rolID,
        ]
      );

      const usersID = usersInsert.insertId;

      const day = dayjs().locale(es).format("YYYY-MM-DD HH:mm");

      await newConnection.awaitQuery(
        `INSERT INTO usuario_auth(usuario_idusers, password, fecha_registro) VALUES(?, ?, ?)`,
        [usersID, null, day]
      );

      await newConnection.awaitQuery(
        `INSERT INTO informacion_ubicacion(fk_idusers, ciudad, localida, barrio, direccion, adicionales) VALUES(?, ?, ?, ?, ?, ?)`,
        [usersID, ciudad, localida, barrio, direccion, adicionales]
      );

      if (numero !== "" && tipoNumero !== "") {
        await newConnection.awaitQuery(
          `INSERT INTO contacto_emergencia(usuario_idusers, nombre, celular) VALUES(?, ?, ?)`,
          [usersID, tipoNumero, numero]
        );
      }

      if (nota !== "") {
        await newConnection.awaitQuery(
          `INSERT INTO notas_usuario(fk_idusers, nota) VALUES(?, ?)`,
          [usersID, nota]
        );
      }

      const users = await newConnection.awaitQuery(
        `SELECT * FROM usuario  WHERE idusers= ?`,
        [usersID]
      );

      await sendEmail(
        email,
        `${nombre} Bienvenid@ a la familia EcoPlastic`,
        `
        ${nombre} Te damos la bienvenid@ a la familia EcoPlastic, para nosotros es un honor que nos ayudes en esta lucha contra el cambio climático,
        desde tu cuenta podrás intercambiar los desechos de las materias prima de tu empresa con otras empresas de la familia EcoPlastic.
        Puedes activar cuenta con tu numero de cedula:

     `,
        welcomeEmailTemplates(nombre)
      );

      await newConnection.awaitCommit();
      newConnection.release();

      return res.status(201).json(
        formatResponse(
          {
            message: "Usuario registrado con exito",
            user: users,
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

usersRouter.post("/obtener_usuarios", isAdmin, async (req, res) => {
  if (!req.query.page || !req.query.limit) {
    return res.status(422).json({
      errores: "Debes incluir el número de página y el limite de registros",
      data: "",
    });
  }

  const newConnection = await connection.awaitGetConnection();

  try {
    const { page, limit } = req.query;

    const limitParsed = parseInt(limit) || 20;
    const pageParsed = parseInt(page) || 0;
    const offset = pageParsed > 0 ? pageParsed * limitParsed : 0;

    const { filter } = req.body;

    const where = getArrayWhereQueryUsers(filter);

    const [{ totalUsuarios }] = await newConnection.awaitQuery(
      `SELECT COUNT(*) totalUsuarios FROM usuario u 
        INNER JOIN roles r
        ON r.idroles=u.roles_idroles
        ${where}
      `
    );

    const results = await newConnection.awaitQuery(
      `SELECT * FROM usuario u
        INNER JOIN roles r
       ON r.idroles=u.roles_idroles
        ${where}
        ORDER BY 
          u.estadoUsuario DESC,
          u.nombre ASC
        LIMIT ?, ?
      `,
      [offset, limitParsed]
    );

    newConnection.release();

    return res.status(200).json({
      errores: "",
      data: {
        usuarios: results,
        total: totalUsuarios,
      },
    });
  } catch (error) {
    console.log(error);
    newConnection.release();
  }
});

usersRouter.post(
  "/obtener_usuarios_excel",
  isAdmin,
  checkToken,
  async (req, res) => {
    const newConnection = await connection.awaitGetConnection();

    try {
      let response = [];
      let where = "";

      const { dataFilters } = req.body;

      if (dataFilters) where = getArrayWhereQueryUsers(dataFilters);

      const usersBasic = await newConnection.awaitQuery(
        `SELECT u.cedula, u.nombre, u.genero, u.email, u.phone, u.fecha_nacimiento, iu.ciudad, 
        iu.barrio, iu.direccion, iu.adicionales FROM usuario u
          INNER JOIN informacion_ubicacion iu
          ON iu.fk_idusers= u.idusers
          INNER JOIN roles r
          ON r.idroles= u.roles_idroles
        ${where}
      `
      );

      response.push({ title: "Información Básica", data: usersBasic });

      newConnection.release();

      return res.status(200).json({
        errores: "",
        data: {
          message: "Resultados obtenidos con exito",
          results: response,
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

usersRouter.put(
  "/actualizar_estado_usuario/:userID",
  isAdmin,
  async (req, res) => {
    const resultErrors = validationResult(req).formatWith(errorFormatter);
    if (!resultErrors.isEmpty()) {
      const errorResponse = formatErrorValidator(resultErrors);
      return res.status(422).json(formatResponse({}, errorResponse));
    }

    const newConnection = await connection.awaitGetConnection();

    try {
      const { userID } = req.params;
      const { newState } = req.body;

      await newConnection.awaitQuery(
        `UPDATE usuario SET estadoUsuario= ? WHERE idusers= ? `,
        [newState, userID]
      );

      newConnection.release();

      const message =
        newState === 1
          ? "Usuario Habilitado con éxito"
          : "Usuario bloqueado con éxito";

      return res.status(201).json(formatResponse({ message: message }, ""));
    } catch (error) {
      console.log(error);
      newConnection.release();
      const errorFormated = formatErrorResponse(error);
      return res.status(500).json(errorFormated);
    }
  }
);

usersRouter.get("/obtener_info_direccion/:id", async (req, res) => {
  const resultErrors = validationResult(req).formatWith(errorFormatter);
  if (!resultErrors.isEmpty()) {
    const errorResponse = formatErrorValidator(resultErrors);
    return res.status(422).json(formatResponse({}, errorResponse));
  }

  const newConnection = await connection.awaitGetConnection();

  try {
    const { id } = req.params;

    const response = await newConnection.awaitQuery(
      `SELECT * FROM informacion_ubicacion  WHERE fk_idusers= ?`,
      [id]
    );

    newConnection.release();

    return res.status(201).json(
      formatResponse(
        {
          response: response[0],
        },
        ""
      )
    );
  } catch (error) {
    newConnection.release();
    const errorFormated = formatErrorResponse(error);
    return res.status(500).json(errorFormated);
  }
});

usersRouter.get("/obtener_informacion_contacto/:id", async (req, res) => {
  const resultErrors = validationResult(req).formatWith(errorFormatter);
  if (!resultErrors.isEmpty()) {
    const errorResponse = formatErrorValidator(resultErrors);
    return res.status(422).json(formatResponse({}, errorResponse));
  }

  const newConnection = await connection.awaitGetConnection();

  try {
    const { id } = req.params;

    const response = await newConnection.awaitQuery(
      `SELECT * FROM contacto_emergencia  WHERE usuario_idusers= ?`,
      [id]
    );

    newConnection.release();

    return res.status(201).json(
      formatResponse(
        {
          total: response.length,
          registros: response,
        },
        ""
      )
    );
  } catch (error) {
    newConnection.release();
    const errorFormated = formatErrorResponse(error);
    return res.status(500).json(errorFormated);
  }
});

usersRouter.post(
  "/subir_foto_usuario/:seccionFoto/:userID",
  checkToken,
  async (req, res) => {
    const resultErrors = validationResult(req).formatWith(errorFormatter);
    if (!resultErrors.isEmpty()) {
      const errorResponse = formatErrorValidator(resultErrors);
      return res.status(422).json(formatResponse({}, errorResponse));
    }

    if (!req.files || Object.keys(req.files).length === 0) {
      return res
        .status(422)
        .json(
          formatResponse(
            {},
            "No se encontro ningún archivo para subir, por favor envia un archivo."
          )
        );
    }

    if (!req.files.archivo) {
      return res
        .status(422)
        .json(
          formatResponse(
            {},
            "El parametro nombre de la petición debe ser 'archivo' para su correcto procesamiento."
          )
        );
    }

    if (
      req.params.seccionFoto !== "perfil" &&
      req.params.seccionFoto !== "empresarial"
    ) {
      return res
        .status(422)
        .json(
          formatResponse(
            {},
            "El parametro es incorrecto, solo existen dos opciones validas: 'perfil' y 'empresarial'."
          )
        );
    }

    const newConnection = await connection.awaitGetConnection();

    try {
      const archivo = req.files.archivo;

      if (archivo.mimetype.split("/")[0] !== "image") {
        newConnection.release();
        return res
          .status(422)
          .json(
            formatResponse(
              {},
              "El archivo debe ser de tipo imagen, de lo contrario no se almacenara el archivo"
            )
          );
      }

      const arrayFile = archivo.name.split(".");

      const nombreServidor = codeGenerator.generarNombreArchivo(
        archivo.md5,
        arrayFile[arrayFile.length - 1]
      );
      const extension = archivo.mimetype.split("/")[1];

      if (req.params.seccionFoto === "perfil") {
        await archivo.mv(
          `${process.cwd()}/src/public/uploads/images/imagenes_usuarios/${nombreServidor}`
        );
      } else {
        await archivo.mv(
          `${process.cwd()}/src/public/uploads/images/corporativas/${nombreServidor}`
        );
      }

      try {
        if (req.params.seccionFoto === "perfil") {
          const existUsers = await newConnection.awaitQuery(
            `SELECT idusers FROM usuario WHERE idusers = ?`,
            [req.params.userID]
          );

          if (!existUsers[0]) {
            newConnection.release();
            return res
              .status(422)
              .json(
                formatResponse(
                  {},
                  "El ID de usuario no existe en la base de datos, asegurate de enviar un ID existente."
                )
              );
          }
        } else {
          const existempresa = await newConnection.awaitQuery(
            `SELECT * FROM empresa WHERE idempresa = ?`,
            [req.params.userID]
          );

          if (!existempresa[0]) {
            newConnection.release();
            return res
              .status(422)
              .json(
                formatResponse(
                  {},
                  "El ID de la empresa no existe en la base de datos, asegurate de enviar un ID existente."
                )
              );
          }
        }

        let nombreReferenciaArchivo = "";

        if (req.params.seccionFoto === "perfil") {
          nombreReferenciaArchivo = "archivos_user_image";
        } else {
          nombreReferenciaArchivo = "archivos_imagen_corporativa_usuario";
        }

        const file = await uploadFile(
          nombreServidor,
          archivo.name,
          archivo.size,
          extension,
          req.params.userID,
          nombreReferenciaArchivo
        );

        if (file === 0) {
          newConnection.release();
          return res
            .status(422)
            .json(
              formatResponse(
                {},
                `Hubo un error al intentar subir el archivo, por favor volver a intentarlo.`
              )
            );
        }

        if (req.params.seccionFoto === "perfil") {
          await newConnection.awaitQuery(
            `UPDATE usuario SET userImage = ? WHERE idusers = ?`,
            [file, req.params.userID]
          );
        } else {
          await newConnection.awaitQuery(
            `UPDATE empresa SET imageUrl = ? WHERE idempresa = ?`,
            [file, req.params.userID]
          );
        }

        newConnection.release();

        res.status(201).json({
          errores: "",
          data: {
            seccionFoto: req.params.seccionFoto,
            message: "Archivo subido con exito.",
            nombreArchivo: nombreServidor,
          },
        });
      } catch (error) {
        console.log(error);
        newConnection.release();
        const errorFormated = formatErrorResponse(error);
        return res.status(500).json(errorFormated);
      }
    } catch (error) {
      newConnection.release();
      console.log(error);
      res.status(500).json({ errores: error, data: "" });
      return;
    }
  }
);

usersRouter.get("/get-user-detail/:id", async (req, res) => {
  const resultErrors = validationResult(req).formatWith(errorFormatter);
  if (!resultErrors.isEmpty()) {
    const errorResponse = formatErrorValidator(resultErrors);
    return res.status(422).json(formatResponse({}, errorResponse));
  }

  const newConnection = await connection.awaitGetConnection();

  try {
    const { id } = req.params;

    const usersDetails = await newConnection.awaitQuery(
      `SELECT u.idusers, u.cedula, u.nombre, u.genero, u.email, u.phone, u.estadoUsuario, u.userImage, u.fecha_nacimiento, r.name_rol, iu.ciudad, 
      iu.localida, iu.barrio, iu.direccion, iu.adicionales, e.idempresa, e.nit, e.nombre_empresa, e.email emailEmpresa,
      ia.direccion direccionEmpresa, ia.pais paisEmpresa, ia.ciudad ciudadEmpresa, ia.telefono telefonoEmpresa
       FROM usuario u
        INNER JOIN informacion_ubicacion iu
        ON iu.fk_idusers = u.idusers
        INNER JOIN empresa e
        ON e.idempresa = u.empresa_idempresa
        INNER JOIN informacion_adicional ia
        ON ia.empresa_idempresa = e.idempresa
        INNER JOIN roles r
        ON r.idroles = u.roles_idroles
       WHERE idusers= ?`,
      [id]
    );

    if (!usersDetails[0]) {
      newConnection.release();
      return res
        .status(422)
        .json(
          formatResponse(
            {},
            `El usuario no se encuentra en la base de datos, comprueba que el ID de usuario es correcto.`
          )
        );
    }

    const emg = await newConnection.awaitQuery(
      `SELECT * FROM contacto_emergencia WHERE usuario_idusers= ?`,
      [id]
    );

    const auth = await newConnection.awaitQuery(
      `SELECT * FROM usuario_auth WHERE usuario_idusers= ?`,
      [id]
    );

    newConnection.release();

    const last_login = auth && auth[0] ? auth[0].lastLogin : null;

    return res.status(201).json(
      formatResponse(
        {
          emg: emg && emg[0] ? emg[0] : null,
          usersDetails:
            usersDetails && usersDetails[0]
              ? { ...usersDetails[0], lastLogin: last_login }
              : null,
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
});

usersRouter.put(
  "/update-user-detail/:id",
  [
    body("cedula").notEmpty().withMessage("La cedula es un campo obligatorio"),
    body("nombre").notEmpty().withMessage("El nombre es un campo obligatorio"),
    body("genero").notEmpty().withMessage("El genero es un campo obligatorio"),
    body("email").notEmpty().withMessage("El correo es un campo obligatorio"),
    body("email").isEmail().withMessage("Ingrese un email valido"),
    body("phone").notEmpty().withMessage("El celular es un campo obligatorio"),
    body("ciudad").notEmpty().withMessage("Laciudad es un campo obligatorio"),
    body("localida")
      .notEmpty()
      .withMessage("La localida es un campo obligatorio"),
    body("barrio").notEmpty().withMessage("El barrio es un campo obligatorio"),
    body("direccion")
      .notEmpty()
      .withMessage("La direccion es un campo obligatorio"),
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
      const { id } = req.params;
      const {
        cedula,
        nombre,
        genero,
        email,
        phone,
        fecha_nacimiento,
        ciudad,
        localida,
        barrio,
        direccion,
        adicionales,
      } = req.body;

      const usersDetails = await newConnection.awaitQuery(
        `SELECT * FROM usuario u
        INNER JOIN informacion_ubicacion iu
        ON iu.fk_idusers = u.idusers
       WHERE idusers= ?`,
        [id]
      );

      if (!usersDetails[0]) {
        newConnection.release();
        return res
          .status(422)
          .json(
            formatResponse(
              {},
              `El usuario no se encuentra en la base de datos, comprueba que el ID de usuario es correcto.`
            )
          );
      }

      const day = dayjs(fecha_nacimiento).locale(es).format("YYYY-MM-DD");

      await newConnection.awaitQuery(
        `UPDATE usuario SET cedula= ?, nombre= ?, genero= ?, email= ?, phone= ?, fecha_nacimiento= ? WHERE idusers= ? `,
        [cedula, nombre, genero, email, phone, day, id]
      );

      await newConnection.awaitQuery(
        `UPDATE informacion_ubicacion SET ciudad= ?, localida= ?, barrio= ?, direccion= ?, adicionales= ? WHERE fk_idusers= ?`,
        [ciudad, localida, barrio, direccion, adicionales, id]
      );

      await newConnection.awaitCommit();
      newConnection.release();

      return res.status(201).json(
        formatResponse(
          {
            message: "Registros actualizados con exito",
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

usersRouter.get("/get-business/:id", async (req, res) => {
  const resultErrors = validationResult(req).formatWith(errorFormatter);
  if (!resultErrors.isEmpty()) {
    const errorResponse = formatErrorValidator(resultErrors);
    return res.status(422).json(formatResponse({}, errorResponse));
  }

  const newConnection = await connection.awaitGetConnection();

  try {
    const { id } = req.params;

    const response = await newConnection.awaitQuery(
      `SELECT * FROM empresa e
        INNER JOIN informacion_adicional ia
        ON ia.empresa_idempresa= e.idempresa 
        WHERE e.idempresa= ?`,
      [id]
    );

    newConnection.release();

    return res.status(201).json(
      formatResponse(
        {
          response: response[0],
        },
        ""
      )
    );
  } catch (error) {
    newConnection.release();
    const errorFormated = formatErrorResponse(error);
    return res.status(500).json(errorFormated);
  }
});

usersRouter.put(
  "/update-business-detail/:userID/:businessID",
  [
    body("nit").notEmpty().withMessage("eL nit es un campo obligatorio"),
    body("nombre").notEmpty().withMessage("El nombre es un campo obligatorio"),
    body("email").notEmpty().withMessage("El correo es un campo obligatorio"),
    body("email").isEmail().withMessage("Ingrese un email valido"),
    body("phone").notEmpty().withMessage("El celular es un campo obligatorio"),
    body("ciudad").notEmpty().withMessage("Laciudad es un campo obligatorio"),
    body("direccion")
      .notEmpty()
      .withMessage("La direccion es un campo obligatorio"),
    body("pais").notEmpty().withMessage("El pai es un campo obligatorio"),
  ],
  isAdmin,
  async (req, res) => {
    const resultErrors = validationResult(req).formatWith(errorFormatter);
    if (!resultErrors.isEmpty()) {
      const errorResponse = formatErrorValidator(resultErrors);
      return res.status(422).json(formatResponse({}, errorResponse));
    }

    const newConnection = await connection.awaitGetConnection();
    await newConnection.awaitBeginTransaction();

    try {
      const { userID, businessID } = req.params;
      const { nit, nombre, email, direccion, pais, ciudad, phone } = req.body;

      const usersDetails = await newConnection.awaitQuery(
        `SELECT * FROM usuario u
        INNER JOIN empresa e
        ON e.idempresa = u.empresa_idempresa
       WHERE u.idusers= ? AND e.idempresa= ?`,
        [userID, businessID]
      );

      if (!usersDetails[0]) {
        newConnection.release();
        return res
          .status(422)
          .json(
            formatResponse(
              {},
              `El usuario no se encuentra en la base de datos, comprueba que el ID de usuario es correcto.`
            )
          );
      }

      await newConnection.awaitQuery(
        `UPDATE empresa SET nit= ?, nombre_empresa= ?, email= ? WHERE idempresa= ? `,
        [nit, nombre, email, businessID]
      );

      await newConnection.awaitQuery(
        `UPDATE informacion_adicional SET direccion= ?, pais= ?, ciudad= ?, telefono= ? WHERE empresa_idempresa= ?`,
        [direccion, pais, ciudad, phone, businessID]
      );

      await newConnection.awaitCommit();
      newConnection.release();

      return res.status(201).json(
        formatResponse(
          {
            message: "Registros actualizados con exito",
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

usersRouter.put(
  "/actualizar_info_base_usuario/:id",
  [
    body("cedula").notEmpty().withMessage("La cedula es un campo obligatorio"),
    body("nombre").notEmpty().withMessage("El nombre es un campo obligatorio"),
    body("genero").notEmpty().withMessage("El genero es un campo obligatorio"),
    body("email").notEmpty().withMessage("El correo es un campo obligatorio"),
    body("email").isEmail().withMessage("Ingrese un email valido"),
    body("phone").notEmpty().withMessage("El celular es un campo obligatorio"),
    body("fecha_nacimiento")
      .notEmpty()
      .withMessage("Fecha de nacimeinto es un campo obligatorio"),
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
      const { id } = req.params;
      const { cedula, nombre, genero, email, phone, fecha_nacimiento } =
        req.body;

      const usersDetails = await newConnection.awaitQuery(
        `SELECT * FROM usuario WHERE idusers= ?`,
        [id]
      );

      if (!usersDetails[0]) {
        newConnection.release();
        return res
          .status(422)
          .json(
            formatResponse(
              {},
              `El usuario no se encuentra en la base de datos, comprueba que el ID de usuario es correcto.`
            )
          );
      }

      const day = dayjs(fecha_nacimiento).locale(es).format("YYYY-MM-DD");

      await newConnection.awaitQuery(
        `UPDATE usuario SET cedula= ?, nombre= ?, genero= ?, email= ?, phone= ?, fecha_nacimiento= ? WHERE idusers= ? `,
        [cedula, nombre, genero, email, phone, day, id]
      );

      await newConnection.awaitCommit();
      newConnection.release();

      return res
        .status(201)
        .json(
          formatResponse(
            { message: "Registros actualizados con exito", usuarioID: id },
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

usersRouter.put(
  "/registrar_informacion_direccion/:id",
  [
    body("ciudad").notEmpty().withMessage("Laciudad es un campo obligatorio"),
    body("localida")
      .notEmpty()
      .withMessage("La localida es un campo obligatorio"),
    body("barrio").notEmpty().withMessage("El barrio es un campo obligatorio"),
    body("direccion")
      .notEmpty()
      .withMessage("La direccion es un campo obligatorio"),
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
      const { id } = req.params;
      const { ciudad, localida, barrio, direccion, adicionales } = req.body;

      const usersDetails = await newConnection.awaitQuery(
        `SELECT * FROM usuario u
        INNER JOIN informacion_ubicacion iu
        ON iu.fk_idusers = u.idusers
       WHERE idusers= ?`,
        [id]
      );

      if (!usersDetails[0]) {
        newConnection.release();
        return res
          .status(422)
          .json(
            formatResponse(
              {},
              `El usuario no se encuentra en la base de datos, comprueba que el ID de usuario es correcto.`
            )
          );
      }

      await newConnection.awaitQuery(
        `UPDATE informacion_ubicacion SET ciudad= ?, localida= ?, barrio= ?, direccion= ?, adicionales= ? WHERE fk_idusers= ?`,
        [ciudad, localida, barrio, direccion, adicionales, id]
      );

      await newConnection.awaitCommit();
      newConnection.release();

      return res.status(201).json(
        formatResponse(
          {
            message: "Registros actualizados con exito",
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

usersRouter.post(
  "/registrar_informacion_direccion_admin/:idusers/:idempresa",
  [
    body("ciudad").notEmpty().withMessage("La ciudad es un campo obligatorio"),
    body("localida")
      .notEmpty()
      .withMessage("La localida es un campo obligatorio"),
    body("barrio").notEmpty().withMessage("El barrio es un campo obligatorio"),
    body("direccion")
      .notEmpty()
      .withMessage("La direccion es un campo obligatorio"),

    body("ciudade")
      .notEmpty()
      .withMessage("La ciudad de la empresa es un campo obligatorio"),
    body("ciudade")
      .notEmpty()
      .withMessage("La ciudad de la empresa es un campo obligatorio"),
    body("paise")
      .notEmpty()
      .withMessage("El pais de la empresa es un campo obligatorio"),
    body("phonee")
      .notEmpty()
      .withMessage("El celular de la empresa es un campo obligatorio"),
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
      const { idusers, idempresa } = req.params;
      const {
        ciudad,
        localida,
        barrio,
        direccion,
        adicionales,

        direccione,
        paise,
        ciudade,
        phonee,
      } = req.body;

      const usersDetails = await newConnection.awaitQuery(
        `SELECT * FROM usuario  WHERE idusers= ?`,
        [idusers]
      );

      if (!usersDetails[0]) {
        newConnection.release();
        return res
          .status(422)
          .json(
            formatResponse(
              {},
              `El usuario no se encuentra en la base de datos, comprueba que el ID de usuario es correcto.`
            )
          );
      }

      const usersUbicacion = await newConnection.awaitQuery(
        `SELECT * FROM informacion_ubicacion  WHERE fk_idusers= ?`,
        [idusers]
      );

      if (usersUbicacion[0]) {
        await newConnection.awaitQuery(
          `UPDATE informacion_ubicacion SET ciudad= ?, localida= ?, barrio= ?, direccion= ?, adicionales= ? WHERE fk_idusers= ?`,
          [ciudad, localida, barrio, direccion, adicionales, idusers]
        );
      } else {
        await newConnection.awaitQuery(
          `INSERT INTO informacion_ubicacion VALUES(?, ?, ?, ?, ?, ?)`,
          [idusers, ciudad, localida, barrio, direccion, adicionales]
        );
      }

      const empresaUbicacion = await newConnection.awaitQuery(
        `SELECT * FROM informacion_adicional  WHERE empresa_idempresa= ?`,
        [idempresa]
      );

      if (empresaUbicacion[0]) {
        await newConnection.awaitQuery(
          `UPDATE informacion_adicional SET direccion= ?, pais= ?, ciudad= ?, telefono= ? WHERE empresa_idempresa= ?`,
          [direccione, paise, ciudade, phonee, idempresa]
        );
      } else {
        await newConnection.awaitQuery(
          `INSERT INTO informacion_adicional VALUES(?, ?, ?, ?, ?)`,
          [idempresa, direccione, paise, ciudade, phonee]
        );
      }

      await newConnection.awaitCommit();
      newConnection.release();

      return res.status(201).json(
        formatResponse(
          {
            message: "Registros actualizados con exito",
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

usersRouter.post(
  "/subir_archivo_explorador_archivos/:userID",
  [
    check("referencia", "El nombre de la referencia es obligatorio")
      .not()
      .isEmpty(),
    check("directorio", "El nombre de la referencia es obligatorio")
      .not()
      .isEmpty(),
    check("favorito", "Este campo es obligatorio").not().isEmpty(),
    check("compartido", "Este campo es obligatorio").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errores: errors.array(), data: "" });
    }

    const newConnection = await connection.awaitGetConnection();
    await newConnection.awaitBeginTransaction();

    try {
      const { referencia, favorito, directorio } = req.body;
      const { archivos } = req.files;
      const { userID } = req.params;

      let filesArray = [];
      let filesResponse = [];

      if (!Array.isArray(archivos)) filesArray = [archivos];
      else filesArray = archivos;

      for (const archivo of filesArray) {
        const arrayFile = archivo.name.split(".");
        const nombreServidor = codeGenerator.generarNombreArchivo(
          archivo.md5,
          arrayFile[arrayFile.length - 1]
        );
        const extension = arrayFile[arrayFile.length - 1];

        if (!mimeTypes.includes(archivo.mimetype)) {
          newConnection.release();
          return res.status(422).json({
            errores: `El tipo de archivo de: ${archivo.name} no esta permitido, operacion cancelada`,
            data: "",
          });
        }

        const rutaArchivo = `uploads/${directorio}/${nombreServidor}`;
        const rutaCompleta = `${process.cwd()}/src/public/uploads/${directorio}/${nombreServidor}`;

        const isImage =
          archivo.mimetype.split("/")[0] === "image" ||
          archivo.mimetype.split("/")[0] === "video"
            ? 1
            : 0;

        await archivo.mv(rutaCompleta);

        const file = await uploadFile(
          nombreServidor,
          archivo.name,
          archivo.size,
          extension,
          parseInt(userID),
          referencia
        );

        if (file === 0) {
          newConnection.release();
          return res
            .status(422)
            .json(
              formatResponse(
                {},
                `Hubo un error al intentar subir el archivo, por favor volverlo a intentar.`
              )
            );
        }

        const idArchivo = await newConnection.awaitQuery(
          `SELECT MAX(fk_idArchivo) idArchivo FROM ref_archivos_adjuntos WHERE seccionReferencia = ? AND idReferencia = ?`,
          [referencia, parseInt(userID)]
        );

        await newConnection.awaitQuery(
          `INSERT INTO explorador_archivos_usuario VALUES(?, ?, ?, ?, ?, ?)`,
          [
            parseInt(idArchivo[0].idArchivo),
            parseInt(userID),
            rutaArchivo,
            parseInt(favorito),
            isImage,
            0,
          ]
        );

        const fileInfo = await newConnection.awaitQuery(
          `SELECT nombreCliente, fechaCreado FROM archivos_adjuntos WHERE idArchivo = ?`,
          [idArchivo[0].idArchivo]
        );

        const fileInfoResponse = {
          id: idArchivo[0].idArchivo,
          icon: extension,
          fileName: fileInfo[0].nombreCliente,
          serverName: `https://ecoplastic.herokuapp.com/${rutaArchivo}`,
          thumnail: String(extension).toUpperCase(),
          isImage: isImage,
          date: fileInfo[0].fechaCreado,
          selected: false,
          favorite: parseInt(favorito),
        };

        filesResponse = [...filesResponse, fileInfoResponse];
      }

      await newConnection.awaitCommit();
      newConnection.release();

      return res.status(200).json({
        errores: "",
        data: {
          message: "archivo subido con exito",
          registro: filesResponse,
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

usersRouter.post("/obtener_archivos_usuario/:userID", async (req, res) => {
  const resultErrors = validationResult(req).formatWith(errorFormatter);
  if (!resultErrors.isEmpty()) {
    const errorResponse = formatErrorValidator(resultErrors);
    return res.status(422).json(formatResponse({}, errorResponse));
  }

  const newConnection = await connection.awaitGetConnection();

  try {
    let offset = 0;
    let whereQuery = "";
    let hasNextPage = false;

    const { userID } = req.params;
    const { page, limit, q, shared } = req.query;
    const { extensions } = req.body;

    if (parseInt(page) > 0) offset = page * parseInt(limit);

    if (q && q !== "") {
      if (whereQuery.startsWith("AND"))
        whereQuery += ` (a.nombreCliente LIKE '%${q}%')`;
      else whereQuery += `AND (a.nombreCliente LIKE '%${q}%')`;
    }

    if (extensions && extensions.length > 0) {
      let subQuery;

      const validExtensions = extensions.filter((ext) => ext !== "FAVORITOS");

      if (extensions.includes("FAVORITOS"))
        subQuery = `${q !== "" ? "AND " : ""}e.favorito = 1 AND (`;
      else subQuery = `${q !== "" ? "AND " : ""}(`;

      for (const ext of validExtensions) {
        subQuery += `a.extensionArchivo LIKE '%${ext}%' OR `;
      }

      subQuery = subQuery.substring(0, subQuery.length - 4);

      subQuery += ")";

      if (whereQuery.startsWith("AND")) whereQuery += ` ${subQuery}`;
      else whereQuery += `AND ${subQuery}`;
    }

    const total = await newConnection.awaitQuery(
      `SELECT COUNT(*) totalRegistros 
        FROM explorador_archivos_usuario e
        INNER JOIN archivos_adjuntos a
          ON a.idArchivo = e.fk_idArchivo
        WHERE e.fk_userID = ? AND e.esCompartido = ? ${whereQuery}
      `,
      [parseInt(userID), parseInt(shared)]
    );

    const results = await newConnection.awaitQuery(
      `SELECT a.nombreCliente fileName, a.nombreServidor, a.fechaCreado date, a.extensionArchivo icon,
          e.fk_idArchivo id, e.rutaCompleta, e.favorito favorite, e.isImage, e.esCompartido shared
        
        FROM explorador_archivos_usuario e
        INNER JOIN archivos_adjuntos a
          ON a.idArchivo = e.fk_idArchivo
        WHERE e.fk_userID = ? AND e.esCompartido = ? ${whereQuery}
        ORDER BY a.fechaCreado DESC
        LIMIT ?, ?
      `,
      [parseInt(userID), parseInt(shared), offset, parseInt(limit)]
    );

    newConnection.release();

    const formatedFiles = results.map((item) => ({
      ...item,
      icon: item.nombreServidor.split(".")[1],
      thumnail: String(item.nombreServidor.split(".")[1]).toUpperCase(),
      selected: false,
      serverName: `https://ecoplastic.herokuapp.com/${item.rutaCompleta}`,
    }));

    if (parseInt(total[0].totalRegistros) > offset + formatedFiles.length)
      hasNextPage = true;
    else hasNextPage = false;

    return res.status(200).json({
      errores: "",
      data: {
        options: formatedFiles,
        total: total[0].totalRegistros,
        hasNextPage,
      },
    });
  } catch (error) {
    console.log(error);
    newConnection.release();
    const errorFormated = formatErrorResponse(error);
    return res.status(500).json(errorFormated);
  }
});

export default usersRouter;
