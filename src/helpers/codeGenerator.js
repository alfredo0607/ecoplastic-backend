import { nanoid, customAlphabet } from "nanoid";
import jwt from "jwt-simple";
import moment from "moment";

const generarIDPublicacion = () => nanoid(25);

const generarClaveTemporal = () => nanoid(8);

const generarCodigoRecuperacion = () =>
  customAlphabet("1234567890ABCDEFGHIJKLMNOPQRSTUVXYZ", 8)();

const generarNombreArchivo = (md5Archivo, extensionArchivo) =>
  nanoid() + md5Archivo + "." + extensionArchivo;

const crearTokenUsuario = (user) => {
  let date = moment().locale("es");
  let expiredAt = date.add(180, "minutes").unix();

  const payload = {
    user,
    createdAt: moment().locale("es").unix(),
    expiredAt: expiredAt,
  };

  return {
    token: jwt.encode(payload, process.env.SECRET_KEY_JWT),
    timeBeforeExpiredAt: date.add(185, "minutes").unix(),
  };
};

export default {
  generarCodigoRecuperacion,
  generarNombreArchivo,
  crearTokenUsuario,
  generarIDPublicacion,
  generarClaveTemporal,
};
