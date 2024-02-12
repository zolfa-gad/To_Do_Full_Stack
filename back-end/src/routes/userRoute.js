const express = require("express");
const databaseClient = require("../database");

const router = express.Router();

router.get("/", async (request, response) => {
  try {
    // const { id } = request.query;

    const usersRows = await databaseClient.query(
      `SELECT name, email FROM ${process.env.DATABASE_USER_TABLE} 
      WHERE id='${request.userID}'`
    );

    const userData = usersRows.rows[0];

    console.log(userData, "user");

    if (!userData) {
      return response.status(404).json({
        status: "error",
        message: "User id is not found.",
      });
    }

    // const tasksRows = await databaseClient.query(
    //   `SELECT id, title, status, due_date FROM ${process.env.DATABASE_Task_TABLE}
    //   WHERE user_id='${id}'`
    // );

    // console.log(tasksRows.rows, "task");

    response.status(200).json({
      status: "success",
      message: "User data recieved successfully.",
      data: {
        id: request.userID,
        name: userData.name,
        email: userData.email,
        // tasks: [...tasksRows.rows],
      },
    });
  } catch (error) {
    response.status(500).json({
      status: "error",
      message: "Failed recieve data, try again later.",
    });
  }
});

// -------------------------  get all tasks -------------------------//

router.get("/all-tasks", async (request, response) => {
  // try {

  const tasksList = await databaseClient.query(
    `SELECT id, title, status, created_at, due_date
     FROM ${process.env.DATABASE_TASK_TABLE} where user_id=${request.userID}
     ORDER BY status, due_date;`
  );

  const tasks = tasksList.rows.map((task) => {
    return {
      ...task,
      created_at: new Date(Number(task.created_at)).toLocaleDateString(),
      due_date: new Date(Number(task.due_date)).toLocaleDateString(),
    };
  });

  console.log(tasks, "tasks");

  response.status(201).json({
    status: "success",
    message: "All tasks has been recieved successfully.",
    data: [...tasks],
  });

  // } catch (error) {
  //   response.status(500).json({
  //     status: "error",
  //     message: "Registration failed try again later.",
  //   });
  // }
});

// router.post("/login", async (request, response) => {
//   const { username, password, remember } = request.body;

//   const user = await UserModel.findOne({ username });

//   if (!user) {
//     return response.status(401).json({
//       status: "error",
//       message: "Invalid username or password",
//     });
//   }
//   console.log(remember, "ree");

//   const isPasswordValid = await bcrypt.compare(password, user.password);

//   if (!isPasswordValid) {
//     return response.status(401).json({
//       status: "error",
//       message: "Invalid username or password",
//     });
//   }

//   const accessToken = jwt.sign({ userID: user._id }, process.env.SECRET_KRY, {
//     expiresIn: remember ? 3600 * 24 : 60 * 5,
//     algorithm: "HS256", // HS256 algorithm for signing
//   });

//   response.status(200).json({
//     status: "success",
//     message: "user logged in successfully",
//     token: accessToken,
//   });
// });

// router.post("/auth", async (request, response) => {
//   const { token } = request.body;

//   console.log(token, "token");

//   jwt.verify(token, process.env.SECRET_KRY, (err, decoded) => {
//     if (err) {
//       response.status(401).json({ status: "error", message: "Invalid token." });
//     } else {
//       response.status(200).json({ status: "success", message: "Valid token." });
//     }
//     console.log(decoded, "decoded");
//     console.log(err, "error");
//     console.log(new Date(decoded?.iat * 1000), "iat");
//     console.log(new Date(decoded?.exp * 1000), "exp");
//   });
// });

// router.post("/auth/change-password", async (request, response) => {
//   const { newpassword, oldpassword } = request.body;

//   const user = await UserModel.findOne({
//     username: process.env.ADMIN_USERNAME,
//   });

//   const isPasswordValid = await bcrypt.compare(oldpassword, user.password);

//   if (!isPasswordValid) {
//     return response.status(401).json({
//       status: "error",
//       message: "Invalid old password",
//     });
//   }

//   const hashPassword = await bcrypt.hash(newpassword, 10);

//   const userUpdate = await UserModel.findOneAndUpdate(
//     { _id: new ObjectId(user._id) },
//     { password: hashPassword },
//     {
//       new: true,
//     }
//   );

//   console.log(userUpdate, "update");

//   response.status(200).json({
//     status: "success",
//     message: "password has changed successfully",
//   });
// });
module.exports = router;
