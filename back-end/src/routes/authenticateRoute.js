const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const databaseClient = require("../database");

const { string, object, bool, number, array } = require("yup");

const authSchemaValidation = object({
  remember: bool(),
  password: string().min(8).required(),
  email: string()
    .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, "email is not valid")
    .required(),
  name: string().min(3).required(),
});

// -------------------------  user registration -------------------------//

router.post("/register", async (request, response) => {
  try {
    const { name, email, password, remember } = request.body;

    await authSchemaValidation
      .validate({ name, email, password, remember })
      .then(async (result) => {
        console.log(result, "user");
        const foundUser = await databaseClient.query(
          `SELECT * FROM ${process.env.DATABASE_USER_TABLE} WHERE email='${email}'`
        );

        if (foundUser.rowCount > 0) {
          return response.status(500).json({
            status: "error",
            message: "Email is already exist.",
          });
        }

        const hashedPassword = await bcrypt.hash(
          password,
          Number(process.env.JWT_SALT_NUMBER)
        );

        const registerdUser =
          await databaseClient.query(`INSERT INTO ${process.env.DATABASE_USER_TABLE} (name, email, password) 
        VALUES ('${name}', '${email}', '${hashedPassword}') RETURNING id;`);

        const token = jwt.sign(
          { userID: registerdUser.rows[0].id },
          process.env.JWT_SECRET_KEY,
          {
            expiresIn: process.env.JWT_EXPIRES_IN,
          }
        );

        return response.status(201).json({
          status: "success",
          message: "New user registered successfully.",
          data: {
            id: registerdUser.rows[0].id,
            name,
            email,
            token,
          },
        });
      })
      .catch((error) => {
        console.log(error, "error");

        return response.status(500).json({
          status: "error",
          message: error.errors[0],
        });
      });
  } catch (error) {
    response.status(500).json({
      status: "error",
      message: "Registration failed try again later.",
    });
  }
});

// -------------------------  user login -------------------------//

router.post("/login", async (request, response) => {
  try {
    const { email, password, remember } = request.body;

    const databaseRows = await databaseClient.query(
      `SELECT * FROM ${process.env.DATABASE_USER_TABLE}
    WHERE email='${email}'`
    );

    const loggedUser = databaseRows.rows[0];

    console.log(loggedUser, "user");

    if (!loggedUser) {
      return response.status(401).json({
        status: "error",
        message: "Invalid email or password.",
      });
    }

    const passwordMatch = await bcrypt.compare(password, loggedUser.password);

    if (!passwordMatch) {
      return response.status(401).json({
        status: "error",
        message: "Invalid email or password.",
      });
    }

    const token = jwt.sign(
      { userID: loggedUser.id },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: remember ? process.env.JWT_EXPIRES_IN : "1h",
      }
    );

    response.status(200).json({
      status: "success",
      message: "User login successfully.",
      data: {
        id: loggedUser.id,
        name: loggedUser.name,
        email: loggedUser.email,
        token,
      },
    });
  } catch (error) {
    response.status(500).json({
      status: "error",
      message: "Login failed try again later.",
    });
  }
});

// -------------------------  auth user -------------------------//

// router.post("/", async (request, response) => {
//   const { token } = request.body;

//   console.log(token, "token");

//   jwt.verify(token, process.env.JWT_SECRET_KEY, (error, decoded) => {
//     if (error) {
//       response.status(401).json({ status: "error", message: "Invalid token." });
//     } else {
//       response.status(200).json({
//         status: "success",
//         message: "Valid token.",
//         id: decoded.userID,
//       });
//     }
//     console.log(decoded, "decoded");
//     console.log(error, "error");
//   });
// });

module.exports = router;
