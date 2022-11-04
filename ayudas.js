const resultErrors = validationResult(req).formatWith(errorFormatter);
if (!resultErrors.isEmpty()) {
  const errorResponse = formatErrorValidator(resultErrors);
  return res.status(422).json(formatResponse({}, errorResponse));
}

if (!existUsersUpdate[0]) {
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

const newConnection = await connection.awaitGetConnection();
await newConnection.awaitBeginTransaction();

await newConnection.awaitCommit();
newConnection.release();

await newConnection.awaitRollback();
newConnection.release();
const errorFormated = formatErrorResponse(error);
return res.status(500).json(errorFormated);

await newConnection.awaitQuery(
  `INSERT INTO tipo_observacion VALUES(NULL, ?, ?)`,
  [req.body.nombre, req.body.color]
);

const notificationsID = notifications.insertId;

const day = dayjs(fecha_nacimiento).locale(es).format("YYYY-MM-DD");

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

const type = "request";

SendNotificationUsers(
  io,
  arrayUserNotifications,
  `/app/gestion_solicitudes?SID=${idSolicitud}&UID=`,
  "notificaciones_asignar_area_solicitud_usuario",
  idSolicitud,
  "asignar_area_solicitud",
  iduser,
  type
);
