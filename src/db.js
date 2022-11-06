import mysql from "mysql-await";

const connection = mysql.createPool({
  charset: "utf8mb4",
  connectionLimit: 10,
  host: process.env.DB_HOST || "mysql-ecoplastic.alwaysdata.net",
  user: process.env.DB_USER || "288105_alfredo",
  password: "Lovebarca06",
  database: process.env.DB_DATABASE || "ecoplastic_db",
  port: process.env.DB_PORT || 3306,
});

connection.on(`error`, (err) => {
  console.error(`Connection error ${err.code}`);
});

// const pruebaDataBase = async () => {
//   const data = await connection.awaitQuery(`SELECT * FROM usuario`);
//   console.log(data);
// };

// pruebaDataBase();

export default connection;
