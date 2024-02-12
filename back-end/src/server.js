// ------------------------- require -------------------------//
const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: ".env" });
const cors = require("cors");
const TokenVerification = require("./middlewares/authentication");
const databaseClient = require("./database");
const authRoute = require("./routes/authenticateRoute");
const userRoute = require("./routes/userRoute");
const taskRoute = require("./routes/taskRoute");

// ------------------------- server -------------------------//

const server = express();
server.use(express.json());
server.use(cors({ origin: "*" }));

// error client donefunction
databaseClient.connect((error, client, done) => {
  if (error) {
    console.log(error, "Error while connecting to database");
  } else {
    console.log("Connected to database successfully");

    server.use("/auth", authRoute);
    server.use("/user", TokenVerification, userRoute);
    server.post("/", TokenVerification, (request, response) => {
      response.status(200).json({
        status: "success",
      });
    });

    server.use("/task", TokenVerification, taskRoute);

    // server.get("/user", TokenVerification, async (request, response) => {
    //   // try {
    //   const databaseRows = await databaseClient.query(
    //     `SELECT id, name, email FROM ${process.env.DATABASE_USER_TABLE}
    //     WHERE id='${request.query.id}'`
    //   );
    //   if (databaseRows.rowCount <= 0) {
    //     return response.status(401).json({
    //       status: "error",
    //       message: "Invalid user id.",
    //     });
    //   }
    //   const user = databaseRows.rows[0];

    //   console.log(user, "user data");

    //   response.status(200).json({
    //     status: "success",
    //     message: "User data recevied successfully.",
    //     data: {
    //       ...user,
    //     },
    //   });
    //   // } catch (error) {
    //   //   response.status(500).json({
    //   //     status: "error",
    //   //     message: "Error while getting user data .",
    //   //   });
    //   // }
    // });

    // server.get("/", TokenVerification, (request, response) => {
    //   response.status(200).json({ message: "Hello from the other side" });
    // });

    // Protected route
    // router.get("/", verifyToken, (req, res) => {
    //   res.status(200).json({ message: "Protected route accessed" });
    // });

    // router.get("/", verifyToken, (req, res) => {
    //   res.status(200).json({ message: "Protected route accessed" });
    // });

    server.listen(process.env.PORT, () => {
      console.log(`listening on port ${process.env.PORT}`);
    });
  }
});
