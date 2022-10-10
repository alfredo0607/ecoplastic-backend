import jwt from "jwt-simple";
import moment from "moment";

const isAdmin = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(422).json({
      errores:
        "No se encontro un token, por favor incluir el token de usuario.",
    });
  }

  const token = req.headers.authorization.split(" ")[1];
  let payload = {};

  try {
    payload = jwt.decode(token, process.env.SECRET_KEY_JWT);
  } catch (e) {
    return res.status(422).json({ errores: "Invalid token" });
  }

  if (payload.expiredAt < moment().unix()) {
    return res
      .status(422)
      .json({ errores: "El token de usuario ha expirado." });
  }

  if (payload.user.rol !== "Admin") {
    return res.status(422).json({
      errores: "No tiene los permisos suficientes para acceder a esta ruta.",
    });
  }

  next();
};

export default isAdmin;
