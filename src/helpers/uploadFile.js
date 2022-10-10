import dayjs from "dayjs";
import es from "dayjs/locale/es.js";
import connection from "../db.js";

const uploadFile = async (
  _nombreServidor,
  _nombreCliente,
  _pesoArchivo,
  _extensionArchivo,
  _idReferencia,
  _nombreReferencia
) => {
  const newConnection = await connection.awaitGetConnection();

  try {
    const day = dayjs().locale(es).format("YYYY-MM-DD HH:mm");

    const file_add = await newConnection.awaitQuery(
      `INSERT INTO archivos_adjuntos(nombreServidor, nombreCliente , pesoArchivo, extensionArchivo, fechaCreado) VALUES(?, ?, ?, ?, ?)`,
      [_nombreServidor, _nombreCliente, _pesoArchivo, _extensionArchivo, day]
    );

    const idArchivo = file_add.insertId;

    await newConnection.awaitQuery(
      `INSERT INTO ref_archivos_adjuntos(fk_idArchivo, seccionReferencia, idReferencia) VALUES(?, ?, ?)`,
      [idArchivo, _nombreReferencia, _idReferencia]
    );

    return _nombreServidor;
  } catch (error) {
    console.log(error);
    return 0;
  }
};
export default uploadFile;
