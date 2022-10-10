const { connection } = require("../db")

const checkUserExist = async (id) => {

  const newConnection = await connection.awaitGetConnection()

  try {

    const [{ total }] = await newConnection.awaitQuery(
      `SELECT COUNT(*) total FROM usuarios WHERE userID = ?`,
      [id]
    )

    newConnection.release()

    if (total > 0) {
      return true
    } else {
      return false
    }

  } catch (error) {
    return false
  }

}

module.exports = {
  checkUserExist
}