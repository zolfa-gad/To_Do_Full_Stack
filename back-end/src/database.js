const { Client } = require("pg");


const client = new Client({
  port: process.env.DATABASE_PORT,
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
});



// client.query("SELECT * FROM user_table", (error, response) => {
//   if (error) {
//     console.log(error, "error while connecting");
//   } else {
//     console.log(response.rows, "data");
//   }
//   client.end();
// });

module.exports = client;
