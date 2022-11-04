import dayjs from "dayjs";
import es from "dayjs/locale/es.js";
import connection from "../db.js";

export const NotificacionesUsers = async (
  socket,
  users = [],
  ruta,
  nameRef,
  idRef,
  nameType,
  idSend,
  type
) => {
  const io = socket;
  const newConnection = await connection.awaitGetConnection();

  const day = dayjs().locale(es).format("YYYY/MM/DD HH:mm");

  for (const iterator of users) {
    const { id } = iterator;

    const rutaFormt = type === "request" ? `${ruta}${id}` : ruta;

    const newNotifications = await newConnection.awaitQuery(
      `INSERT INTO notificaciones_usuario(fk_userID, referenciaLink, estadoNotificacion, nombreNotificacionReferencia, idReferencia, nombreTipo, fechaNotificacion, fk_idSender)
            VALUES(?, ?, ?, ?, ?, ?, ?, ?)
          `,
      [id, rutaFormt, 0, nameRef, idRef, nameType, day, idSend]
    );

    const notificationsID = newNotifications.insertId;

    const newNotificationsResponse = await newConnection.awaitQuery(
      `SELECT n.idNotificacion, n.referenciaLink, n.estadoNotificacion,
          n.idReferencia, n.nombreTipo type, n.fechaNotificacion, ue.nombre nombreEnvia, ue.userImage avatar, e.nombre_empresa
          FROM notificaciones_usuario n
          INNER JOIN usuario ue
            ON ue.idusers = n.fk_userID
            INNER JOIN empresa e
            ON e.idempresa = ue.empresa_idempresa
          WHERE n.idNotificacion = ?
        `,
      [notificationsID]
    );

    const total = await newConnection.awaitQuery(
      `SELECT COUNT(*) totalNotificaciones FROM notificaciones_usuario WHERE fk_userID = ? AND estadoNotificacion= ?`,
      [id, 0]
    );

    const notifications = newNotificationsResponse[0];

    io.to(`notificaciones ${id}`).emit(`nueva notificacion ${id}`, {
      notifications,
      totalNotifications: total[0].totalNotificaciones,
    });
  }

  newConnection.release();
};
