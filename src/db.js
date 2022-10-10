import mysql from "mysql-await";

const connection = mysql.createPool({
  charset: "utf8mb4",
  connectionLimit: 10,
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: "Lovebarca06",
  database: process.env.DB_DATABASE || "ecoplastic",
  port: process.env.DB_PORT,
});

connection.on(`error`, (err) => {
  console.error(`Connection error ${err.code}`);
});

// const pruebaDataBase = async () => {
//   const data = await connection.awaitQuery(`SELECT * FROM usuario`);
//   console.log(data);

//   const day = dayjs().locale(es).format("YYYY-MM-DD HH:mm");

//   console.log(day);
// };

// pruebaDataBase();

export default connection;
