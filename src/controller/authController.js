import dayjs from "dayjs";
import es from "dayjs/locale/es.js";
import express from "express";
import connection from "../db.js";
import * as bcrypt from "bcrypt";
import { body, validationResult } from "express-validator";
import {
  errorFormatter,
  formatErrorResponse,
  formatErrorValidator,
  formatResponse,
} from "../helpers/errorFormatter.js";
import { sendEmail } from "../helpers/mailer.js";
import templateEmailPassRecovery from "../helpers/emailTemplates.js";
import checkToken from "../utils/middlewares.js";
import codeGenerator from "../helpers/codeGenerator.js";
import { welcomeEmailTemplates } from "../helpers/welcomeEmailTemplates.js";

const authRouter = express.Router();

authRouter.post("/check_nit/:nit", async (req, res) => {
  const resultErrors = validationResult(req).formatWith(errorFormatter);
  if (!resultErrors.isEmpty()) {
    const errorResponse = formatErrorValidator(resultErrors);
    return res.status(422).json(formatResponse({}, errorResponse));
  }

  const newConnection = await connection.awaitGetConnection();

  try {
    const { nit } = req.params;

    const exitEmpresa = await newConnection.awaitQuery(
      `SELECT nit FROM empresa WHERE nit = ?`,
      [nit]
    );

    if (exitEmpresa[0]) {
      newConnection.release();
      return res.status(200).json(
        formatResponse(
          {
            message: "Se obtuvo un registro.",
            registrado: true,
          },
          ""
        )
      );
    }

    if (!exitEmpresa[0]) {
      newConnection.release();
      return res.status(200).json(
        formatResponse(
          {
            message: "No se encontrarón registros",
            registrado: false,
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

authRouter.post("/check_cedula/:cedula", async (req, res) => {
  const resultErrors = validationResult(req).formatWith(errorFormatter);
  if (!resultErrors.isEmpty()) {
    const errorResponse = formatErrorValidator(resultErrors);
    return res.status(422).json(formatResponse({}, errorResponse));
  }

  const newConnection = await connection.awaitGetConnection();

  try {
    const { cedula } = req.params;

    const exitCedula = await newConnection.awaitQuery(
      `SELECT cedula FROM usuario WHERE cedula = ?`,
      [cedula]
    );

    if (exitCedula[0]) {
      newConnection.release();
      return res.status(200).json(
        formatResponse(
          {
            message: "Se obtuvo un registro.",
            registrado: true,
          },
          ""
        )
      );
    }

    if (!exitCedula[0]) {
      newConnection.release();
      return res.status(200).json(
        formatResponse(
          {
            message: `No se encontró un usuario relacionado con la cédula ${cedula}`,
            registrado: false,
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

authRouter.post("/check_email/:email", async (req, res) => {
  const resultErrors = validationResult(req).formatWith(errorFormatter);
  if (!resultErrors.isEmpty()) {
    const errorResponse = formatErrorValidator(resultErrors);
    return res.status(422).json(formatResponse({}, errorResponse));
  }

  const newConnection = await connection.awaitGetConnection();

  try {
    const { email } = req.params;

    const exitEmail = await newConnection.awaitQuery(
      `SELECT email FROM usuario WHERE email = ?`,
      [email]
    );

    if (exitEmail[0]) {
      newConnection.release();
      return res.status(200).json(
        formatResponse(
          {
            message: "Se obtuvo un registro.",
            registrado: true,
          },
          ""
        )
      );
    }

    if (!exitEmail[0]) {
      newConnection.release();
      return res.status(200).json(
        formatResponse(
          {
            message: "No se encontrarón registros",
            registrado: false,
          },
          ""
        )
      );
    }

    newConnection.release();
  } catch (error) {
    console.log(error);
    newConnection.release();
    const errorFormated = formatErrorResponse(error);
    return res.status(500).json(errorFormated);
  }
});

authRouter.post(
  "/register-empresa",
  [
    body("nit").notEmpty().withMessage("El Nit es un campo obligatorio"),
    body("nombre_empresa")
      .notEmpty()
      .withMessage("El Nombre de la empresa es un campo obligatorio"),
    body("email")
      .notEmpty()
      .withMessage("El email de la empresaaaa es un campo obligatorio"),
    body("email").isEmail().withMessage("Por favor ingrese un Email valido"),
    body("cedula").notEmpty().withMessage("La Cedula es un campo obligatorio"),
    body("nombre").notEmpty().withMessage("El Nombre es un campo obligatorio"),
    body("emailUsers")
      .notEmpty()
      .withMessage("El Email del usuario es un campo obligatorio"),
    body("emailUsers")
      .isEmail()
      .withMessage("Por favor ingrese un Email valido"),
    body("password")
      .notEmpty()
      .withMessage("La cotraseña es un campo obligatorio"),
    body("pregunta1")
      .notEmpty()
      .withMessage("La primera pregunta es un campo obligatorio"),
    body("pregunta2")
      .notEmpty()
      .withMessage("La segunda pregunta es un campo obligatorio"),
    body("respuesta1")
      .notEmpty()
      .withMessage("La primera respuesta es un campo obligatorio"),
    body("respuesta2")
      .notEmpty()
      .withMessage("La segunda respuesta es un campo obligatorio"),
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
      const {
        nit,
        nombre_empresa,
        email,
        //
        cedula,
        nombre,
        emailUsers,
        password,

        pregunta1,
        pregunta2,
        respuesta1,
        respuesta2,
      } = req.body;

      const existNit = await newConnection.awaitQuery(
        `SELECT * FROM empresa WHERE nit= ?`,
        [nit]
      );

      if (existNit[0]) {
        newConnection.release();
        return res
          .status(422)
          .json(
            formatResponse(
              {},
              `Ya existe una empresa registrada con el nit: ${nit}.`
            )
          );
      }

      const existEmail = await newConnection.awaitQuery(
        `SELECT * FROM usuario WHERE email= ?`,
        [email]
      );

      if (existEmail[0]) {
        newConnection.release();
        return res
          .status(422)
          .json(
            formatResponse(
              {},
              `Ya existe un usuario registrado con el correo: ${email}.`
            )
          );
      }

      const registerBusiness = await newConnection.awaitQuery(
        `INSERT INTO empresa(nit, nombre_empresa, email) VALUES(?, ?, ?)`,
        [nit, nombre_empresa, email]
      );

      const businessID = registerBusiness.insertId;

      // await newConnection.awaitQuery(
      //   `INSERT INTO informacion_adicional(empresa_idempresa, direccion, pais, ciudad) VALUES(?, ?, ?, ?)`,
      //   [businessID, direccion, pais, ciudad]
      // );

      const existUsers = await newConnection.awaitQuery(
        `SELECT * FROM usuario WHERE cedula= ?`,
        [cedula]
      );

      if (existUsers[0]) {
        await newConnection.awaitRollback();
        newConnection.release();
        return res
          .status(422)
          .json(
            formatResponse(
              {},
              `Ya existe un usuario registrado con la cedula: ${cedula}.`
            )
          );
      }

      const existRol = await newConnection.awaitQuery(
        `SELECT * FROM roles WHERE name_rol= ?`,
        ["Admin"]
      );

      if (!existRol[0]) {
        await newConnection.awaitRollback();
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

      const usersInsert = await newConnection.awaitQuery(
        `INSERT INTO usuario(cedula, nombre, genero, email, phone, fecha_nacimiento, userImage, estadoUsuario, empresa_idempresa, roles_idroles)
         VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          cedula,
          nombre,
          null,
          emailUsers,
          null,
          null,
          null,
          1,
          businessID,
          rolID,
        ]
      );

      const usersID = usersInsert.insertId;

      const day = dayjs().locale(es).format("YYYY-MM-DD HH:mm");

      const passwordHast = bcrypt.hashSync(password, 10);

      await newConnection.awaitQuery(
        `INSERT INTO usuario_auth(usuario_idusers, password, fecha_registro) VALUES(?, ?, ?)`,
        [usersID, passwordHast, day]
      );

      await newConnection.awaitQuery(
        `INSERT INTO preguntas_seguridad(fk_idusers, pregunta_1, pregunta_2, respuesta_1, respuesta_2) VALUES(?, ?, ?, ?, ?)`,
        [usersID, pregunta1, pregunta2, respuesta1, respuesta2]
      );

      // CORREO DE BIENVENIDA DEl MASTER
      await sendEmail(
        emailUsers,
        `${nombre} Bienvenid@ a la familia EcoPlastic`,
        `
        ${nombre} Te damos la bienvenid@ a la familia EcoPlastic, para nosotros es un honor que nos ayudes en esta lucha contra el cambio climático,
        desde tu cuenta podrás intercambiar los desechos de las materias prima de tu empresa con otras empresas de la familia EcoPlastic.
        Puede iniciar sesion con su correo y contraseña registradas.

     `,
        welcomeEmailTemplates(nombre)
      );

      await newConnection.awaitCommit();
      newConnection.release();

      return res.status(201).json(
        formatResponse({
          message: "Los registros se agregaron exitosamente",
        })
      );
    } catch (error) {
      await newConnection.awaitRollback();
      console.log(error);
      newConnection.release();
      const errorFormated = formatErrorResponse(error);
      return res.status(500).json(errorFormated);
    }
  }
);

authRouter.post("/validate-cedula/:cedula", async (req, res) => {
  const resultErrors = validationResult(req).formatWith(errorFormatter);
  if (!resultErrors.isEmpty()) {
    const errorResponse = formatErrorValidator(resultErrors);
    return res.status(422).json(formatResponse({}, errorResponse));
  }

  const newConnection = await connection.awaitGetConnection();

  try {
    const { cedula } = req.params;
    const { type } = req.query;

    const existUsers = await newConnection.awaitQuery(
      `SELECT * FROM usuario u
       INNER JOIN usuario_auth ua
       ON u.idusers= ua.usuario_idusers
      WHERE cedula= ?`,
      [cedula]
    );

    if (type !== "recovery") {
      if (existUsers[0] && existUsers[0].password) {
        newConnection.release();
        return res
          .status(422)
          .json(formatResponse({}, `El usuario ya se encuentra registrado`));
      }
    }

    if (type === "recovery") {
      if (existUsers[0] && !existUsers[0].password) {
        newConnection.release();
        return res
          .status(422)
          .json(
            formatResponse(
              {},
              `Realice el proceso de registro y vuelva a intentarlo nuevamente`
            )
          );
      }
    }

    if (existUsers[0]) {
      newConnection.release();
      return res.status(201).json(
        formatResponse({
          registrado: true,
        })
      );
    }

    if (!existUsers[0]) {
      newConnection.release();
      return res.status(201).json(
        formatResponse({
          message: `No se encontro un usuario registrado con la cédula: ${cedula}`,
          registrado: false,
        })
      );
    }
  } catch (error) {
    console.log(error);
    newConnection.release();
    const errorFormated = formatErrorResponse(error);
    return res.status(500).json(errorFormated);
  }
});

authRouter.post(
  "/register-users",
  [
    body("password")
      .notEmpty()
      .withMessage("La contraseña es un campo obligatorio"),
    body("pregunta1")
      .notEmpty()
      .withMessage("La primera pregunta de seguridad es un campo obligatorio"),
    body("pregunta2")
      .notEmpty()
      .withMessage("La segunda pregunta de seguridad es un campo obligatorio"),
    body("respuesta1")
      .notEmpty()
      .withMessage("La primera respuesta de seguridad es un campo obligatorio"),
    body("respuesta2")
      .notEmpty()
      .withMessage("La segunda respuesta de seguridad es un campo obligatorio"),
    body("cedula").notEmpty().withMessage("La cedula es un campo obligatorio"),
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
      const { cedula, password, pregunta1, pregunta2, respuesta1, respuesta2 } =
        req.body;

      const existUsers = await newConnection.awaitQuery(
        `SELECT * FROM usuario u
         INNER JOIN usuario_auth ua
         ON u.idusers= ua.usuario_idusers
        WHERE cedula= ?`,
        [cedula]
      );

      if (existUsers[0] && existUsers[0].password) {
        newConnection.release();
        return res
          .status(422)
          .json(formatResponse({}, `El usuario ya se encuentra registrado`));
      }

      const { idusers } = existUsers[0];

      const passwordHast = bcrypt.hashSync(password, 10);

      await newConnection.awaitQuery(
        `UPDATE usuario_auth SET password= ? WHERE usuario_idusers= ?`,
        [passwordHast, idusers]
      );

      await newConnection.awaitQuery(
        `INSERT INTO preguntas_seguridad(fk_idusers, pregunta_1, pregunta_2, respuesta_1, respuesta_2) VALUES(?, ?, ?, ?, ?)`,
        [idusers, pregunta1, pregunta2, respuesta1, respuesta2]
      );

      await newConnection.awaitCommit();
      newConnection.release();

      return res.status(201).json(
        formatResponse({
          message: "Los registros se agregaron exitosamente",
        })
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

authRouter.post(
  "/recover-password",
  [body("cedula").notEmpty().withMessage("La cedula es obigatoria")],
  async (req, res) => {
    const resultErrors = validationResult(req).formatWith(errorFormatter);
    if (!resultErrors.isEmpty()) {
      const errorResponse = formatErrorValidator(resultErrors);
      return res.status(422).json(formatResponse({}, errorResponse));
    }

    if (
      req.query.methodRecover !== "methodEmail" &&
      req.query.methodRecover !== "methodQuestion"
    ) {
      return res
        .status(422)
        .json(
          formatResponse(
            {},
            `Por favor enviar un tipo de metodo valido, methodEmail/methodQuestion.`
          )
        );
    }

    const newConnection = await connection.awaitGetConnection();
    await newConnection.awaitBeginTransaction();

    try {
      const { email, respuestaUno, respuestaDos, cedula } = req.body;
      const { methodRecover } = req.query;

      if (methodRecover === "methodEmail") {
        if (!req.body.email || req.body.email === "") {
          newConnection.release();
          return res
            .status(422)
            .json(
              formatResponse(
                {},
                `Este campo es de tipo obligatorio para el metodo de recuperacion elegido.`
              )
            );
        }

        const existUsersEmail = await newConnection.awaitQuery(
          `SELECT idusers, nombre FROM usuario WHERE email= ? AND cedula= ?`,
          [email, req.body.cedula]
        );

        if (!existUsersEmail[0]) {
          newConnection.release();
          return res
            .status(422)
            .json(
              formatResponse(
                {},
                `El correo : ${email} no se encuentra asociado a este usuario.`
              )
            );
        }

        const { idusers, nombre } = existUsersEmail[0];

        const codigoEmail = codeGenerator.generarCodigoRecuperacion();

        const existCodeTemp = await newConnection.awaitQuery(
          `SELECT * FROM codigo_verificacion WHERE fk_idusers = ?`,
          [idusers]
        );

        if (existCodeTemp[0]) {
          await newConnection.awaitQuery(
            `UPDATE codigo_verificacion SET codigo = ? WHERE fk_idusers= ?`,
            [codigoEmail, idusers]
          );
        } else {
          await newConnection.awaitQuery(
            `INSERT INTO codigo_verificacion VALUES(?, ?)`,
            [idusers, codigoEmail]
          );
        }

        const day = dayjs().locale(es).format("DD[ ]MMMM[ ]YYYY");

        const result = await sendEmail(
          email,
          "Recuperación de contraseña - EcoPlastic",
          `
         Has solicitado restaurar su contraseña,
         por favor ingresa el código de abajo en la Plataforma para continuar con tu proceso de recuperación de contraseña.
         Código: ${codigoEmail}
       `,
          templateEmailPassRecovery(nombre, day, codigoEmail)
        );

        await newConnection.awaitCommit();
        newConnection.release();

        return res.status(201).json(
          formatResponse(
            {
              message: "Código de verificación enviado con éxito",
              result,
            },
            ""
          )
        );
      }

      if (methodRecover === "methodQuestion") {
        if (!req.body.respuestaUno || req.body.respuestaUno === "") {
          newConnection.release();
          return res.status(422).json(
            formatResponse(
              {},
              {
                respuestaUno:
                  "Este campo es de tipo obligatorio para el metodo de recuperacion elegido.",
              }
            )
          );
        }

        if (!req.body.respuestaDos || req.body.respuestaDos === "") {
          newConnection.release();
          return res.status(422).json(
            formatResponse(
              {},
              {
                respuestaDos:
                  "Este campo es de tipo obligatorio para el metodo de recuperacion elegido.",
              }
            )
          );
        }

        const existUsers = await newConnection.awaitQuery(
          `SELECT idusers, cedula FROM usuario WHERE cedula= ?`,
          [cedula]
        );

        if (!existUsers[0]) {
          newConnection.release();
          return res
            .status(422)
            .json(
              formatResponse(
                {},
                `No se encontró un usuario asociado al correo : ${cedula}.`
              )
            );
        }

        const { idusers } = existUsers[0];

        const respuestasDB = await connection.awaitQuery(
          `SELECT respuesta_1, respuesta_2 FROM preguntas_seguridad WHERE fk_idusers = ?`,
          [idusers]
        );

        if (!respuestasDB[0]) {
          newConnection.release();
          return res
            .status(422)
            .json(
              formatResponse(
                {},
                `El respuesta de seguridad no se encuentra en la base de datos, comprueba que el ID de usuario es correcto.`
              )
            );
        }

        if (
          respuestasDB[0].respuesta_1 === respuestaUno.trim() &&
          respuestasDB[0].respuesta_2 === respuestaDos.trim()
        ) {
          newConnection.release();
          return res.status(201).json(
            formatResponse(
              {
                message: "Las respuestas son correctas.",
                access: true,
              },
              ``
            )
          );
        } else {
          newConnection.release();
          return res
            .status(422)
            .json(
              formatResponse(
                {},
                `Intentalo de nuevo las respuestas no coinciden.`
              )
            );
        }
      }
    } catch (error) {
      console.log(error);
      newConnection.release();
      const errorFormated = formatErrorResponse(error);
      return res.status(500).json(errorFormated);
    }
  }
);

authRouter.get("/obtener_email/:cedula", async (req, res) => {
  const resultErrors = validationResult(req).formatWith(errorFormatter);
  if (!resultErrors.isEmpty()) {
    const errorResponse = formatErrorValidator(resultErrors);
    return res.status(422).json(formatResponse({}, errorResponse));
  }

  const newConnection = await connection.awaitGetConnection();

  try {
    const { cedula } = req.params;

    const emailUsers = await newConnection.awaitQuery(
      `SELECT email FROM usuario WHERE cedula= ?`,
      [cedula]
    );

    if (!emailUsers[0]) {
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

    newConnection.release();

    return res.status(200).json(
      formatResponse(
        {
          email: emailUsers[0].email,
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

authRouter.get(
  "/recuperar_clave/obtener_preguntas/:cedula",
  async (req, res) => {
    const resultErrors = validationResult(req).formatWith(errorFormatter);
    if (!resultErrors.isEmpty()) {
      const errorResponse = formatErrorValidator(resultErrors);
      return res.status(422).json(formatResponse({}, errorResponse));
    }

    const newConnection = await connection.awaitGetConnection();

    try {
      const { cedula } = req.params;

      const emailUsers = await newConnection.awaitQuery(
        `SELECT * FROM usuario WHERE cedula= ?`,
        [cedula]
      );

      if (!emailUsers[0]) {
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

      const { idusers } = emailUsers[0];

      const preguntas = await newConnection.awaitQuery(
        `SELECT * FROM preguntas_seguridad WHERE fk_idusers= ?`,
        [idusers]
      );

      if (!preguntas[0]) {
        newConnection.release();
        return res
          .status(422)
          .json(
            formatResponse({}, "Hubo un error, por favor volverlo a intentar.")
          );
      }

      const data = {
        preguntaUno: preguntas[0].pregunta_1,
        preguntaDos: preguntas[0].pregunta_2,
      };

      newConnection.release();

      return res.status(200).json(
        formatResponse(
          {
            questions: data,
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

authRouter.post(
  "/recuperar_clave/comprobar_codigo/:cedula",
  [body("code").notEmpty().withMessage("El codigo es oblogatorio")],
  async (req, res) => {
    const resultErrors = validationResult(req).formatWith(errorFormatter);
    if (!resultErrors.isEmpty()) {
      const errorResponse = formatErrorValidator(resultErrors);
      return res.status(422).json(formatResponse({}, errorResponse));
    }

    const newConnection = await connection.awaitGetConnection();

    try {
      const { cedula } = req.params;
      const { code } = req.body;

      const users = await newConnection.awaitQuery(
        `SELECT * FROM usuario WHERE cedula= ?`,
        [cedula]
      );

      if (!users[0]) {
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

      const { idusers } = users[0];

      const codeUsers = await newConnection.awaitQuery(
        `SELECT * FROM codigo_verificacion WHERE fk_idusers= ?`,
        [idusers]
      );

      if (!codeUsers[0]) {
        newConnection.release();
        return res
          .status(422)
          .json(
            formatResponse(
              {},
              `No se encuentra el codigo registrado, comprueba que el ID de usuario es correcto.`
            )
          );
      }

      const { codigo } = codeUsers[0];

      if (code === codigo) {
        newConnection.release();
        return res.status(200).json(
          formatResponse(
            {
              status: true,
            },
            ""
          )
        );
      } else {
        newConnection.release();
        return res.status(200).json(
          formatResponse(
            {
              status: false,
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
  }
);

authRouter.post(
  "/cambiar_clave",
  [
    body("cedula").notEmpty().withMessage("La cedula es oblogatoria"),
    body("nuevaClave").notEmpty().withMessage("La contraseña es oblogatoria"),
    body("confirmacionClave")
      .notEmpty()
      .withMessage("La confirmacion de la contraseña es oblogatoria"),
  ],
  async (req, res) => {
    const resultErrors = validationResult(req).formatWith(errorFormatter);
    if (!resultErrors.isEmpty()) {
      const errorResponse = formatErrorValidator(resultErrors);
      return res.status(422).json(formatResponse({}, errorResponse));
    }

    const newConnection = await connection.awaitGetConnection();

    try {
      const { cedula, nuevaClave, confirmacionClave } = req.body;

      if (nuevaClave !== confirmacionClave) {
        newConnection.release();
        return res
          .status(422)
          .json(
            formatResponse(
              {},
              `La contraseña no coinciden, por favor volver a intentarlo`
            )
          );
      }

      const users = await newConnection.awaitQuery(
        `SELECT * FROM usuario WHERE cedula= ?`,
        [cedula]
      );

      if (!users[0]) {
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

      const { idusers } = users[0];

      const codeUsers = await newConnection.awaitQuery(
        `SELECT * FROM usuario_auth WHERE usuario_idusers= ?`,
        [idusers]
      );

      if (!codeUsers[0]) {
        newConnection.release();
        return res
          .status(422)
          .json(
            formatResponse(
              {},
              `No se encuentra el usuario registrado, comprueba que el ID de usuario es correcto.`
            )
          );
      }

      const passwordHast = bcrypt.hashSync(nuevaClave, 10);

      await newConnection.awaitQuery(
        `UPDATE usuario_auth SET password= ? WHERE usuario_idusers= ?`,
        [passwordHast, idusers]
      );

      newConnection.release();

      return res
        .status(201)
        .json(
          formatResponse({ message: "Contraseña actualizada con exito" }, "")
        );
    } catch (error) {
      console.log(error);
      newConnection.release();
      const errorFormated = formatErrorResponse(error);
      return res.status(500).json(errorFormated);
    }
  }
);

authRouter.post(
  "/login",
  [
    body("email").notEmpty().withMessage("El email es un campo obligatorio"),
    body("password").notEmpty().withMessage("El email es un campo obligatorio"),
  ],
  async (req, res) => {
    const resultErrors = validationResult(req).formatWith(errorFormatter);
    if (!resultErrors.isEmpty()) {
      const errorResponse = formatErrorValidator(resultErrors);
      return res.status(422).json(formatResponse({}, errorResponse));
    }

    const newConnection = await connection.awaitGetConnection();

    try {
      const { email, password } = req.body;
      const existUsers = await newConnection.awaitQuery(
        `SELECT * FROM usuario u
           INNER JOIN roles r
           ON r.idroles=u.roles_idroles
         WHERE email= ?`,
        [email]
      );
      if (!existUsers[0]) {
        newConnection.release();
        return res
          .status(422)
          .json(
            formatResponse(
              {},
              `No se encontró ningún usuario asociado al email ingresado, por favor registrese y vuelva a intentarlo.`
            )
          );
      }
      if (
        existUsers[0] &&
        existUsers[0].name_rol === "Operario" &&
        existUsers[0].estadoUsuario === 0
      ) {
        newConnection.release();
        return res
          .status(422)
          .json(
            formatResponse(
              {},
              `Su usuario actualmente se encuentra bloqueado, por favor comunicarse con su máster.`
            )
          );
      }

      const {
        idusers,
        cedula,
        nombre,
        userImage,
        estadoUsuario,
        empresa_idempresa,
      } = existUsers[0];

      const existUsersAuth = await newConnection.awaitQuery(
        `SELECT password pass, lastLogin lass FROM usuario_auth  WHERE usuario_idusers= ?`,
        [idusers]
      );
      if (
        !existUsersAuth[0] ||
        (existUsersAuth[0] && existUsersAuth[0].pass === null)
      ) {
        newConnection.release();
        return res
          .status(422)
          .json(
            formatResponse(
              {},
              `El usuario no se encuentra registrado, por favor registrese y vuelva a intentarlo.`
            )
          );
      }

      const { pass, lass } = existUsersAuth[0];

      const isPassword = await bcrypt.compareSync(password, pass);

      if (!isPassword) {
        newConnection.release();
        return res
          .status(422)
          .json(formatResponse({}, `Usuario y/o Contraseña incorrectos.`));
      }

      const lastLogin = dayjs().locale(es).format("YYYY-MM-DD HH:mm:ss");

      await newConnection.awaitQuery(
        `UPDATE usuario_auth SET lastLogin = ? WHERE usuario_idusers = ?`,
        [lastLogin, idusers]
      );

      const opcionesUsuario = await newConnection.awaitQuery(
        `SELECT * FROM configuracion_cuenta WHERE usuario_idusers = ?`,
        [idusers]
      );

      const empresa = await newConnection.awaitQuery(
        `SELECT * FROM empresa WHERE idempresa = ?`,
        [empresa_idempresa]
      );

      const infoToken = codeGenerator.crearTokenUsuario({
        idusers,
        cedula,
        nombre,
        userImage,
        estadoUsuario,
        empresa_idempresa,
        rol: existUsers[0].name_rol,
      });

      newConnection.release();

      return res.status(201).json(
        formatResponse(
          {
            usuario: {
              idUsuario: idusers,
              imagenUsuario: userImage,
              nombreUsuario: nombre,
              cedulaUsuario: cedula,
              estadoUsuario: estadoUsuario,
              emailUsuario: existUsers[0].email,
              empresa: empresa && empresa[0] ? empresa[0] : null,
              lastLogin: lass,
              rol: existUsers[0].name_rol,
            },
            opciones: opcionesUsuario[0] ? opcionesUsuario[0] : {},
            tokenInfo: {
              token: infoToken.token,
              timeBeforeExpiredAt: infoToken.timeBeforeExpiredAt,
            },
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

authRouter.get("/relogin", checkToken, async (req, res) => {
  const resultErrors = validationResult(req).formatWith(errorFormatter);
  if (!resultErrors.isEmpty()) {
    const errorResponse = formatErrorValidator(resultErrors);
    return res.status(422).json(formatResponse({}, errorResponse));
  }

  const newConnection = await connection.awaitGetConnection();

  try {
    const user = req.user;

    const opcionesUsuario = await newConnection.awaitQuery(
      `SELECT * FROM configuracion_cuenta  WHERE usuario_idusers = ?
      `,
      [user.idusers]
    );

    const users = await newConnection.awaitQuery(
      `SELECT userImage FROM usuario  WHERE idusers = ?
      `,
      [user.idusers]
    );

    const usersLast = await newConnection.awaitQuery(
      `SELECT lastLogin FROM usuario_auth  WHERE usuario_idusers = ?
      `,
      [user.idusers]
    );

    const empresa = await newConnection.awaitQuery(
      `SELECT * FROM empresa WHERE idempresa = ?`,
      [user.empresa_idempresa]
    );

    const rol = await newConnection.awaitQuery(
      `SELECT name_rol FROM roles WHERE name_rol = ?`,
      [user.rol]
    );

    const empresaUbi = await newConnection.awaitQuery(
      `SELECT * FROM informacion_adicional WHERE empresa_idempresa = ?`,
      [user.empresa_idempresa]
    );

    const usersUbi = await newConnection.awaitQuery(
      `SELECT * FROM informacion_ubicacion WHERE fk_idusers = ?
      `,
      [user.idusers]
    );

    const prueba =
      !empresaUbi[0] && !usersUbi[0] && rol[0].name_rol === "Admin"
        ? null
        : !empresaUbi[0] && rol[0].name_rol === "Admin"
        ? null
        : !usersUbi[0] && rol[0].name_rol === "Admin"
        ? null
        : usersLast[0].lastLogin;

    const infoToken = codeGenerator.crearTokenUsuario(user);

    newConnection.release();

    return res.status(201).json(
      formatResponse(
        {
          usuario: {
            idUsuario: user.idusers,
            imagenUsuario: users && users[0] ? users[0].userImage : null,
            nombreUsuario: user.nombre,
            cedulaUsuario: user.cedula,
            estadoUsuario: user.estadoUsuario,
            empresa: empresa && empresa[0] ? empresa[0] : null,
            rol: rol && rol[0] ? rol[0].name_rol : null,
            lastLogin: prueba,
          },
          opciones: opcionesUsuario[0],
          tokenInfo: {
            token: infoToken.token,
            timeBeforeExpiredAt: infoToken.timeBeforeExpiredAt,
          },
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

export default authRouter;
