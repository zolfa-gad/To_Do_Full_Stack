const express = require("express");
const router = express.Router();
const databaseClient = require("../database");
const { string, object, bool, number, array, date } = require("yup");

// TODO : edit task

// const taskSchemaValidation = object({
//   // user_id: number().required(),
//   due_date: number().required(),
//   // status: bool(),
//   title: string().min(3).required(),
// });

// -------------------------  add task -------------------------//

router.post("/add-task", async (request, response) => {
  console.log(request.userID, "xxx");
  try {
    const { title, due_date } = request.body;

    await object({
      due_date: date().required(),
      title: string().min(3).required(),
    })
      .validate({ title, due_date })
      .then(async () => {
        if (new Date().getTime() > new Date(due_date).getTime()) {
          return response.status(500).json({
            status: "error",
            message: "Invalid due date",
          });
        }
        const created_at = new Date();

        const newTask = await databaseClient.query(`INSERT INTO ${
          process.env.DATABASE_TASK_TABLE
        }
          (title, user_id, status, due_date, created_at)
          VALUES ('${title}', '${request.userID}', '${false}', '${new Date(
          due_date
        ).getTime()}', '${created_at.getTime()}') RETURNING id;`);

        console.log(newTask, "task");

        return response.status(201).json({
          status: "success",
          message: "New task has been created successfully.",
          data: {
            id: newTask.rows[0].id,
            title,
            status: false,
            due_date: new Date(due_date).toLocaleDateString(),
            created_at: created_at.toLocaleDateString(),
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
      message: "Creation failed try again later.",
    });
  }
});

// -------------------------  delete task by id -------------------------//

router.delete("/delete-task", async (request, response) => {
  try {
    const { id } = request.query;

    console.log(id, "task id");

    const deleteTask = await databaseClient.query(
      `DELETE FROM ${process.env.DATABASE_TASK_TABLE} WHERE id=${id};`
    );

    console.log(deleteTask, "delete task");

    if (deleteTask.rowCount <= 0) {
      return response.status(404).json({
        status: "error",
        message: "Task id not found.",
      });
    }

    response.status(200).json({
      status: "success",
      message: "Task deleted successfully.",
    });
  } catch (error) {
    response.status(500).json({
      status: "error",
      message: "Delete failed try again later.",
    });
  }
});

// -------------------------  edit task by id -------------------------//

router.post("/update-task", async (request, response) => {
  // try {
  const { id } = request.query;
  const { title } = request.body;

  // SET column1 = value1, column2 = value2

  await object({
    title: string().min(3),
  })
    .validate({ title })
    .then(async (result) => {
      console.log(result, "task");

      const updateTask = await databaseClient.query(
        `UPDATE ${process.env.DATABASE_TASK_TABLE} 
        SET title = '${title}' 
        WHERE id = ${id};`
      );

      console.log(updateTask, "update");

      if (updateTask.rowCount <= 0) {
        return response.status(404).json({
          status: "error",
          message: "Task id not found.",
        });
      }

      return response.status(200).json({
        status: "success",
        message: "Task Updated successfully.",
        // data: {},
      });
    })
    .catch((error) => {
      console.log(error, "error");

      return response.status(500).json({
        status: "error",
        message: error.errors[0],
      });
    });

  // } catch (error) {
  //   response.status(500).json({
  //     status: "error",
  //     message: "Registration failed try again later.",
  //   });
  // }
});

// -------------------------  task toggle status -------------------------//

router.post("/toggle-task", async (request, response) => {
  try {
    const { id } = request.query;

    const currentTask = await databaseClient.query(
      `SELECT status FROM ${process.env.DATABASE_TASK_TABLE}
     WHERE id='${id}';`
    );

    if (currentTask.rowCount <= 0) {
      return response.status(404).json({
        status: "error",
        message: "Task id not found.",
      });
    }

    const updateTask = await databaseClient.query(
      `UPDATE ${process.env.DATABASE_TASK_TABLE} 
      SET status=${!currentTask.rows[0].status} 
      WHERE id = ${id};`
    );

    return response.status(200).json({
      status: "success",
      message: "Task Updated successfully.",
    });
  } catch (error) {
    response.status(500).json({
      status: "error",
      message: "Registration failed try again later.",
    });
  }
});

// -------------------------  get task by id -------------------------//

// router.get("/task", async (request, response) => {
//   // try {
//   const { id } = request.query;

//   const foundTask = await databaseClient.query(
//     `SELECT * FROM ${process.env.DATABASE_TASK_TABLE}
//     WHERE id='${id}';`
//   );

//   if (foundTask.rows <= 0) {
//     return response.status(404).json({
//       status: "error",
//       message: "This id id not found.",
//     });
//   }
//   console.log(foundTask, "found");

//   response.status(201).json({
//     status: "success",
//     message: "All tasks has been recieved successfully.",
//     data: { ...foundTask.rows[0] },
//   });

//   // } catch (error) {
//   //   response.status(500).json({
//   //     status: "error",
//   //     message: "Registration failed try again later.",
//   //   });
//   // }
// });

module.exports = router;
