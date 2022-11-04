import express from "express";
import { body, validationResult } from "express-validator";
import dayjs from "dayjs";
import codeGenerator from "../helpers/codeGenerator.js";
import {
  errorFormatter,
  formatErrorResponse,
  formatErrorValidator,
  formatResponse,
} from "../helpers/errorFormatter.js";
import uploadFile from "../helpers/uploadFile.js";
import es from "dayjs/locale/es.js";
import connection from "../db.js";
import { NotificacionesUsers } from "../helpers/NotificacionesUsers.js";

const productRouter = express.Router();

productRouter.post(
  "/nuevo_producto/:id",
  [
    body("titulo").notEmpty().withMessage("Este campo es obligatorio"),
    body("descripcion").notEmpty().withMessage("Este campo es obligatorio"),
    body("iscominetario").notEmpty().withMessage("Este campo es obligatorio"),
    body("categoria").notEmpty().withMessage("Este campo es obligatorio"),
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
        titulo,
        descripcion,
        iscominetario,
        categoria,
        isoculto,
        archivosAdicionales,
        cover,
      } = req.body;

      const { id } = req.params;

      const cuerpoPublicacion = JSON.stringify(descripcion);

      const exitCategoria = await newConnection.awaitQuery(
        `SELECT * FROM categoria WHERE idcategoria= ?`,
        [categoria]
      );

      if (!exitCategoria[0]) {
        newConnection.release();
        return res
          .status(422)
          .json(
            formatResponse(
              {},
              `No se encontró una categoría relacionada con los datos asociados.`
            )
          );
      }

      const exitUser = await newConnection.awaitQuery(
        `SELECT * FROM usuario WHERE idusers= ?`,
        [id]
      );

      if (!exitUser[0]) {
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

      const day = dayjs().locale(es).format("YYYY-MM-DD HH:mm");

      const publicacionID = await newConnection.awaitQuery(
        `INSERT INTO productos VALUES(?,?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          null,
          categoria,
          titulo,
          "cuerpoPublicacion",
          day,
          iscominetario,
          isoculto,
          id,
          cover,
        ]
      );

      const puID = publicacionID.insertId;

      if (archivosAdicionales.length > 0) {
        for (const archivoID of archivosAdicionales) {
          await newConnection.awaitQuery(
            `INSERT INTO archivos_publicacion VALUES(?, ?)`,
            [puID, archivoID]
          );
        }
      }

      const results = await newConnection.awaitQuery(
        `SELECT p.createdate fechaCreacion, p.usuario_idusers idCreador, u.nombre nombreCreador, p.titulo, c.nombre categoria FROM productos p
        INNER JOIN usuario u
        ON u.idusers= p.usuario_idusers
        INNER JOIN categoria c
        ON c.idcategoria= p.categoria_idcategoria
        WHERE p.idproductos= ?`,
        [puID]
      );

      await newConnection.awaitCommit();
      newConnection.release();

      return res
        .status(201)
        .json(
          formatResponse(
            { message: "Se publicó de manera exitosa", row: results },
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

productRouter.get("/get_publicacione/:id", async (req, res) => {
  const resultErrors = validationResult(req).formatWith(errorFormatter);
  if (!resultErrors.isEmpty()) {
    const errorResponse = formatErrorValidator(resultErrors);
    return res.status(422).json(formatResponse({}, errorResponse));
  }

  const newConnection = await connection.awaitGetConnection();

  try {
    const { id } = req.params;

    const exitUser = await newConnection.awaitQuery(
      `SELECT * FROM usuario WHERE idusers= ?`,
      [id]
    );

    if (!exitUser[0]) {
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

    const response = await newConnection.awaitQuery(
      `SELECT AVG(calificacion) as rating, p.idproductos, p.titulo, p.descripcion, p.createdate, p.cover, u.nombre,
        e.nombre_empresa, e.imageUrl FROM comentarios c
        INNER JOIN productos p
        ON p.idproductos= c.fk_idproductos 
        INNER JOIN usuario u
        ON u.idusers= c.fk_idusers   
        INNER JOIN empresa e
        ON e.idempresa= u.empresa_idempresa   
        WHERE p.isocultar= ?
        GROUP BY (c.fk_idproductos) 
        ORDER BY rating DESC;
      `,
      [0]
    );

    newConnection.release();

    return res.status(201).json(formatResponse({ response }, ""));
  } catch (error) {
    console.log(error);
    newConnection.release();
    const errorFormated = formatErrorResponse(error);
    return res.status(500).json(errorFormated);
  }
});

productRouter.get(
  "/get_publicacione_admin/:id/:idempresa",
  async (req, res) => {
    const resultErrors = validationResult(req).formatWith(errorFormatter);
    if (!resultErrors.isEmpty()) {
      const errorResponse = formatErrorValidator(resultErrors);
      return res.status(422).json(formatResponse({}, errorResponse));
    }

    const newConnection = await connection.awaitGetConnection();

    try {
      const { id, idempresa } = req.params;

      const arrayResult = [];

      const exitUser = await newConnection.awaitQuery(
        `SELECT * FROM usuario WHERE idusers= ?`,
        [id]
      );

      if (!exitUser[0]) {
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

      const responseProduct = await newConnection.awaitQuery(
        `SELECT p.idproductos, p.titulo, p.descripcion, p.createdate, p.comments, 
      p.isocultar, p.cover, u.nombre, u.userImage, u.idusers, c.nombre categoria FROM productos p
        INNER JOIN usuario u
        ON u.idusers= p.usuario_idusers
        INNER JOIN categoria c
        ON c.idcategoria= p.categoria_idcategoria
        INNER JOIN empresa e
        ON e.idempresa= u.empresa_idempresa
      WHERE e.idempresa= ?
      ORDER BY p.createdate DESC
      `,
        [idempresa]
      );

      for (const product of responseProduct) {
        const { idproductos } = product;

        const responseImg = await newConnection.awaitQuery(
          `SELECT * FROM archivos_publicacion ap
        INNER JOIN archivos_adjuntos aa
        ON aa.idArchivo= ap.fk_idArchivo    
        WHERE ap.fk_idPublicacion= ?`,
          [idproductos]
        );

        const rating = await newConnection.awaitQuery(
          `SELECT AVG(ALL calificacion) as rating  FROM comentarios c
          INNER JOIN productos p
          ON p.idproductos= c.fk_idproductos 
          INNER JOIN usuario u
          ON u.idusers= c.fk_idusers 
        WHERE c.fk_idproductos= ?`,
          [idproductos]
        );

        const comentarios = await newConnection.awaitQuery(
          `SELECT c.idcomentarios FROM comentarios c
          INNER JOIN productos p
          ON p.idproductos= c.fk_idproductos 
          INNER JOIN usuario u
          ON u.idusers= c.fk_idusers 
        WHERE c.fk_idproductos= ?`,
          [idproductos]
        );

        if (responseImg[0]) {
          arrayResult.push({
            ...product,
            responseImg,
            rating: rating ? rating[0].rating : 0,
            comentarios: comentarios.length,
          });
        } else {
          arrayResult.push({
            ...product,
            rating: rating ? rating[0].rating : 0,
            comentarios: comentarios.length,
          });
        }
      }

      newConnection.release();

      return res.status(201).json(
        formatResponse(
          {
            message: responseProduct.length,
            rows: arrayResult,
            total: arrayResult.length,
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

productRouter.post("/get_mis_publicacione/:id", async (req, res) => {
  const resultErrors = validationResult(req).formatWith(errorFormatter);
  if (!resultErrors.isEmpty()) {
    const errorResponse = formatErrorValidator(resultErrors);
    return res.status(422).json(formatResponse({}, errorResponse));
  }

  const newConnection = await connection.awaitGetConnection();

  try {
    const { id } = req.params;

    const arrayResult = [];

    const exitUser = await newConnection.awaitQuery(
      `SELECT * FROM usuario WHERE idusers= ?`,
      [id]
    );

    if (!exitUser[0]) {
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

    const responseProduct = await newConnection.awaitQuery(
      `SELECT p.idproductos, p.titulo, p.descripcion, p.createdate, p.comments, 
      p.isocultar, p.cover, u.nombre, u.userImage, u.idusers, c.nombre categoria FROM productos p
        INNER JOIN usuario u
        ON u.idusers= p.usuario_idusers
        INNER JOIN categoria c
        ON c.idcategoria= p.categoria_idcategoria
      WHERE p.usuario_idusers= ?
      ORDER BY p.createdate DESC
      `,
      [id]
    );

    for (const product of responseProduct) {
      const { idproductos } = product;

      const responseImg = await newConnection.awaitQuery(
        `SELECT * FROM archivos_publicacion ap
        INNER JOIN archivos_adjuntos aa
        ON aa.idArchivo= ap.fk_idArchivo    
        WHERE ap.fk_idPublicacion= ?`,
        [idproductos]
      );

      const rating = await newConnection.awaitQuery(
        `SELECT AVG(ALL calificacion) as rating  FROM comentarios c
          INNER JOIN productos p
          ON p.idproductos= c.fk_idproductos 
          INNER JOIN usuario u
          ON u.idusers= c.fk_idusers 
        WHERE c.fk_idproductos= ?`,
        [idproductos]
      );

      const comentarios = await newConnection.awaitQuery(
        `SELECT c.idcomentarios FROM comentarios c
          INNER JOIN productos p
          ON p.idproductos= c.fk_idproductos 
          INNER JOIN usuario u
          ON u.idusers= c.fk_idusers 
        WHERE c.fk_idproductos= ?`,
        [idproductos]
      );

      if (responseImg[0]) {
        arrayResult.push({
          ...product,
          responseImg,
          rating: rating ? rating[0].rating : 0,
          comentarios: comentarios.length,
        });
      } else {
        arrayResult.push({
          ...product,
          rating: rating ? rating[0].rating : 0,
          comentarios: comentarios.length,
        });
      }
    }

    newConnection.release();

    return res
      .status(201)
      .json(
        formatResponse({ rows: arrayResult, total: arrayResult.length }, "")
      );
  } catch (error) {
    console.log(error);
    newConnection.release();
    const errorFormated = formatErrorResponse(error);
    return res.status(500).json(errorFormated);
  }
});

productRouter.get(
  "/get__publicacion_detail/:id/:idpublicacion",
  async (req, res) => {
    const resultErrors = validationResult(req).formatWith(errorFormatter);
    if (!resultErrors.isEmpty()) {
      const errorResponse = formatErrorValidator(resultErrors);
      return res.status(422).json(formatResponse({}, errorResponse));
    }

    const newConnection = await connection.awaitGetConnection();

    try {
      const { id, idpublicacion } = req.params;

      const exitUser = await newConnection.awaitQuery(
        `SELECT * FROM usuario WHERE idusers= ?`,
        [id]
      );

      if (!exitUser[0]) {
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

      const responseProduct = await newConnection.awaitQuery(
        `SELECT p.idproductos, p.titulo, p.descripcion, p.createdate, p.comments, 
      p.isocultar, p.cover, u.nombre, u.userImage, u.idusers, c.nombre categoria FROM productos p
        INNER JOIN usuario u
        ON u.idusers= p.usuario_idusers
        INNER JOIN categoria c
        ON c.idcategoria= p.categoria_idcategoria
      WHERE p.idproductos= ?`,
        [idpublicacion]
      );

      const responseImg = await newConnection.awaitQuery(
        `SELECT * FROM archivos_publicacion ap
        INNER JOIN archivos_adjuntos aa
        ON aa.idArchivo= ap.fk_idArchivo    
        WHERE ap.fk_idPublicacion= ?`,
        [idpublicacion]
      );

      const comentarios = await newConnection.awaitQuery(
        `SELECT c.idcomentarios, c.comentario, c.calificacion, c.createDate, u.nombre, u.userImage FROM comentarios c
          INNER JOIN productos p
          ON p.idproductos= c.fk_idproductos 
          INNER JOIN usuario u
          ON u.idusers= c.fk_idusers 
        WHERE c.fk_idproductos= ?
        ORDER BY c.createDate DESC
        `,
        [idpublicacion]
      );

      const rating = await newConnection.awaitQuery(
        `SELECT AVG(ALL calificacion) as rating  FROM comentarios c
          INNER JOIN productos p
          ON p.idproductos= c.fk_idproductos 
          INNER JOIN usuario u
          ON u.idusers= c.fk_idusers 
        WHERE c.fk_idproductos= ?`,
        [idpublicacion]
      );

      newConnection.release();

      return res.status(201).json(
        formatResponse(
          {
            responseProduct: responseProduct[0],
            responseImg,
            comentarios,
            totalComentarios: comentarios.length,
            rating: rating[0].rating,
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

productRouter.put(
  "/desactivar_comentarios/:id/:idPublicacion",
  async (req, res) => {
    const resultErrors = validationResult(req).formatWith(errorFormatter);
    if (!resultErrors.isEmpty()) {
      const errorResponse = formatErrorValidator(resultErrors);
      return res.status(422).json(formatResponse({}, errorResponse));
    }

    const newConnection = await connection.awaitGetConnection();

    try {
      const { id, idPublicacion } = req.params;

      const { newStatus } = req.body;

      const exitUser = await newConnection.awaitQuery(
        `SELECT * FROM usuario WHERE idusers= ?`,
        [id]
      );

      console.log(newStatus);

      if (!exitUser[0]) {
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

      const validate = await newConnection.awaitQuery(
        `SELECT * FROM productos WHERE usuario_idusers= ? AND idproductos= ?`,
        [id, idPublicacion]
      );

      if (!validate[0]) {
        newConnection.release();
        return res
          .status(422)
          .json(
            formatResponse(
              {},
              `Solo puede desactivar los comentarios el usuario creador de la publicacion.`
            )
          );
      }

      await newConnection.awaitQuery(
        `UPDATE productos SET comments= ? WHERE idproductos= ? `,
        [newStatus, idPublicacion]
      );

      newConnection.release();

      return res.status(201).json(
        formatResponse(
          {
            message: `${
              newStatus === 1
                ? "Comentarios Activados con exito"
                : "Comentarios Desactivados con exito"
            }`,
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

productRouter.put(
  "/ocultar_publicacion/:id/:idPublicacion",
  async (req, res) => {
    const resultErrors = validationResult(req).formatWith(errorFormatter);
    if (!resultErrors.isEmpty()) {
      const errorResponse = formatErrorValidator(resultErrors);
      return res.status(422).json(formatResponse({}, errorResponse));
    }

    const newConnection = await connection.awaitGetConnection();

    try {
      const { id, idPublicacion } = req.params;

      const { newStatus } = req.body;

      console.log(newStatus);

      const exitUser = await newConnection.awaitQuery(
        `SELECT * FROM usuario WHERE idusers= ?`,
        [id]
      );

      if (!exitUser[0]) {
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

      const validate = await newConnection.awaitQuery(
        `SELECT * FROM productos WHERE usuario_idusers= ? AND idproductos= ?`,
        [id, idPublicacion]
      );

      if (!validate[0]) {
        newConnection.release();
        return res
          .status(422)
          .json(
            formatResponse(
              {},
              `Solo puede ocultar la publicacion el usuario creador de la publicacion.`
            )
          );
      }

      await newConnection.awaitQuery(
        `UPDATE productos SET isocultar= ? WHERE idproductos= ? `,
        [newStatus, idPublicacion]
      );

      newConnection.release();

      return res.status(201).json(
        formatResponse(
          {
            message: `${
              newStatus === 1
                ? "Publicacion oculta con exito."
                : "Publicacion ya puede ser vista por los demas usuarios."
            }`,
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

productRouter.post(
  "/comentar_publicacion/:id/:idPublicacion",
  [
    body("calificacion")
      .notEmpty()
      .withMessage("La calificacion es un campo obligatorio"),
    body("comentario")
      .notEmpty()
      .withMessage("El comentario es un campo obligatorio"),
  ],

  async (req, res) => {
    const resultErrors = validationResult(req).formatWith(errorFormatter);
    if (!resultErrors.isEmpty()) {
      const errorResponse = formatErrorValidator(resultErrors);
      return res.status(422).json(formatResponse({}, errorResponse));
    }

    const newConnection = await connection.awaitGetConnection();

    try {
      const { id, idPublicacion } = req.params;

      const { comentario, calificacion } = req.body;

      const exitUser = await newConnection.awaitQuery(
        `SELECT * FROM usuario WHERE idusers= ?`,
        [id]
      );

      if (!exitUser[0]) {
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

      const exitPublicacion = await newConnection.awaitQuery(
        `SELECT * FROM productos WHERE idproductos= ?`,
        [idPublicacion]
      );

      if (!exitPublicacion[0]) {
        newConnection.release();
        return res
          .status(422)
          .json(
            formatResponse(
              {},
              `Esta publicacion no se encuentra registrada, comprueba que el ID de la publicacion es correcto.`
            )
          );
      }

      const day = dayjs().locale(es).format("YYYY-MM-DD HH:mm");

      const conmen = await newConnection.awaitQuery(
        `INSERT INTO comentarios VALUES(?, ?, ?, ?, ?, ?)`,
        [null, comentario, calificacion, idPublicacion, id, day]
      );

      const comentarioID = conmen.insertId;

      const comentarios = await newConnection.awaitQuery(
        `SELECT c.idcomentarios, c.comentario, c.calificacion, c.createDate, u.nombre, u.userImage FROM comentarios c
          INNER JOIN productos p
          ON p.idproductos= c.fk_idproductos 
          INNER JOIN usuario u
          ON u.idusers= c.fk_idusers 
        WHERE c.idcomentarios= ?`,
        [comentarioID]
      );

      const rating = await newConnection.awaitQuery(
        `SELECT AVG(ALL calificacion) as rating  FROM comentarios c
          INNER JOIN productos p
          ON p.idproductos= c.fk_idproductos 
          INNER JOIN usuario u
          ON u.idusers= c.fk_idusers 
        WHERE c.fk_idproductos= ?`,
        [idPublicacion]
      );

      const userProduct = await newConnection.awaitQuery(
        `SELECT usuario_idusers id FROM productos WHERE idproductos= ?`,
        [idPublicacion]
      );

      if (userProduct && userProduct[0].id !== id) {
        const io = req.app.get("socketio");

        NotificacionesUsers(
          io,
          userProduct,
          `/app/product/${idPublicacion}`,
          "notificaciones_comentario_producto_usuario",
          idPublicacion,
          "nueva_comentario",
          id,
          ""
        );
      }

      newConnection.release();

      return res.status(201).json(
        formatResponse(
          {
            message: "Comentario enviado con exito",
            coment: comentarios[0],
            promedio: rating && rating[0].rating ? rating[0].rating : 0,
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

productRouter.get("/categorias", async (req, res) => {
  const resultErrors = validationResult(req).formatWith(errorFormatter);
  if (!resultErrors.isEmpty()) {
    const errorResponse = formatErrorValidator(resultErrors);
    return res.status(422).json(formatResponse({}, errorResponse));
  }

  const newConnection = await connection.awaitGetConnection();

  try {
    const category = await newConnection.awaitQuery(
      `SELECT idcategoria id, nombre title FROM categoria`,
      []
    );

    console.log(category);

    newConnection.release();

    return res.status(200).json({
      errores: "",
      data: {
        options: category,
      },
    });
  } catch (error) {
    console.log(error);
    newConnection.release();
    const errorFormated = formatErrorResponse(error);
    return res.status(500).json(errorFormated);
  }
});

export default productRouter;
