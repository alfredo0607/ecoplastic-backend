export const errorFormatter = ({ location, msg, param }) =>
  `${location}[${param}]: ${msg}`;

/* @note: Esta función formatea los errores que te devuelve express-validator */
export const formatErrorValidator = (result) => {
  if (!result) return null;

  const firstError = result.array({ onlyFirstError: true })[0];

  return firstError;
};

/* @note: Esta función se usa para formatear la respuesta cuando es correcta la respuesta */
export const formatResponse = (data, errores) => ({
  errores,
  data,
});

/* @note: Esta función se usa para formatear la respuesta cuando ocurre un error */
export const formatErrorResponse = (error) => {
  if (typeof error === "string") {
    const errorMsg = `[SERVER_ERROR_500]: ${error}`;
    return formatResponse({}, errorMsg);
  } else {
    if (error.code) {
      const errorMsg = `[MYSQL_ERROR_${error.code}]: ${error.sqlMessage}`;
      return formatResponse({}, errorMsg);
    } else {
      const errorMsg = `[SERVER_ERROR_500]: Ocurrio un error inesperado en el servidor`;
      return formatResponse({}, errorMsg);
    }
  }
};
