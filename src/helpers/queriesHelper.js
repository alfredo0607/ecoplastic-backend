export const getArrayWhereQueryUsers = (body) => {
  const where = [];

  const { nombreCedula, rangoEdades, genero, inactivos, userID, empresaID } =
    body;

  /* Where Conditions */
  if (nombreCedula && nombreCedula !== "") {
    where.push(
      `(u.nombre LIKE '%${nombreCedula}%' OR u.cedula LIKE '%${nombreCedula}%' AND u.empresa_idempresa= ${empresaID} AND r.name_rol= 'Operario')`
    );
  }

  if (rangoEdades && rangoEdades[0] !== null && rangoEdades[1] !== null) {
    const roundedAge = `ROUND(DATEDIFF(CURDATE(), u.fecha_nacimiento) / 365)`;

    where.push(
      `(${roundedAge} >= ${rangoEdades[0]} AND ${roundedAge} <= ${rangoEdades[1]} AND u.empresa_idempresa= ${empresaID} AND r.name_rol= 'Operario')`
    );
  }

  if (genero && genero !== "") {
    where.push(
      `u.genero = '${genero}' AND u.empresa_idempresa= '${empresaID}' AND r.name_rol= 'Operario'`
    );
  }

  if (userID && userID !== "") {
    where.push(
      `u.userID = ${userID} AND u.empresa_idempresa= ${empresaID} AND r.name_rol= 'Operario'`
    );
  }

  const usersActive = !nombreCedula
    ? inactivos
      ? ""
      : `AND u.estadoUsuario = 1`
    : "";
  const whereString =
    where.length > 0
      ? `WHERE ${where.join(" AND ")} ${usersActive}`
      : `WHERE u.empresa_idempresa= ${empresaID} AND r.name_rol= 'Operario'`;

  return `${whereString}`.trim();
};
