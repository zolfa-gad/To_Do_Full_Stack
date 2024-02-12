import { TextField, Button } from "@mui/material";
import FormSection from "../../Components/FormSection/FormSection";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavBarItem from "../../Components/NavBarItem/NavBarItem";
import TaskCardItem from "../../Components/TaskCardItem/TaskCardItem";
import LoaderItem from "../../Components/LoaderItem/LoaderItem";
import SnackBarItem from "../../Components/SnackBarItem/SnackBarItem";

const TaskHomePage = () => {
  const inputsList = [
    { label: "Task Title", name: "title", type: "text" },
    { label: "Due Date", name: "due_date", type: "date" },
  ];

  // const { user_id } = useParams();
  const [snackBarConfig, setSanckBarConfig] = useState({
    open: false,
    message: "",
  });
  // const [isOpenSnackBar, setIsOpenSnackBar] = useState(false);
  // const [snackbarMessage, setsnackbarMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [userData, setUserData] = useState({});
  const [tasksList, setTasksList] = useState([]);

  const [formTaskData, setFormTaskData] = useState({});
  const [updateTask, setUpdateTask] = useState();
  const [editableTask, setEditableTask] = useState({
    status: false,
    id: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      await getUserDataApi();
      await getUserTasksApi();
    };
    fetchData();
  }, []);

  const getUserDataApi = async () => {
    console.log(JSON.parse(localStorage.getItem("token")), "ttoken");
    await fetch(`http://localhost:2020/user`, {
      headers: {
        Authorization: JSON.parse(localStorage.getItem("token")),
      },
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result, "get user data");
        setUserData({ ...result.data });
        setIsLoading(false);
      })
      .catch((error) => console.log(error, "error getting user data"));
  };

  const getUserTasksApi = async () => {
    // console.log(JSON.parse(localStorage.getItem("token")), "ttoken");
    await fetch(`http://localhost:2020/user/all-tasks`, {
      headers: {
        Authorization: JSON.parse(localStorage.getItem("token")),
      },
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result, "get user tasks");
        setTasksList([...result.data]);
        setIsLoading(false);
      })
      .catch((error) => console.log(error, "error getting user tasks"));
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();

    console.log(formTaskData, "form");

    setIsLoading(true);

    await handleSendTaskDataApi({
      endpoint: "add-task",
      method: "POST",
      bodyData: formTaskData,
    }).then((result) => {
      console.log(result, "task create");

      if (result.status == "success") {
        setIsLoading(false);
        setTasksList([...tasksList, result.data]);

        inputsList.map(({ name }) => {
          e.target[name].value = "";
        });
        setFormTaskData({});
        setErrorMessage("");
      } else {
        setErrorMessage(result.message);
        setIsLoading(false);
      }
    });
  };

  const toggleTaskCompletion = (e, taskID) => {
    handleSendTaskDataApi({
      endpoint: "toggle-task",
      method: "POST",
      taskID,
    }).then((result) => {
      // const found  tasksList.find(({id})=>id==taskID)
      // setTasksList([...tasksList,])
      const edited = tasksList.map((task) => {
        if (task.id == taskID) {
          return { ...task, status: !task.status };
        } else {
          return task;
        }
      });
      setTasksList([...edited]);
    });
  };
  const handleTaskUpdate = () => {
    console.log("update title ...");
    handleSendTaskDataApi({
      endpoint: "update-task",
      method: "POST",
      taskID: editableTask.id,
      bodyData: { title: editableTask.title },
    }).then((result) => {
      const edited = tasksList.map((task) => {
        if (task.id == editableTask.id) {
          return { ...task, title: editableTask.title };
        } else {
          return task;
        }
      });
      setTasksList([...edited]);
      setEditableTask({ status: false, id: null });
    });
  };

  const handleTaskDelete = (taskID) => {
    handleSendTaskDataApi({
      endpoint: "delete-task",
      method: "DELETE",
      taskID,
    }).then((result) => {
      setTasksList([...tasksList.filter(({ id }) => id !== taskID)]);
    });
  };

  const handleSendTaskDataApi = async ({
    endpoint,
    method,
    taskID = null,
    bodyData,
  }) => {
    const baseUrl = `http://localhost:2020/task/${endpoint}`;
    return await fetch(taskID ? [baseUrl, `id=${taskID}`].join("?") : baseUrl, {
      method: method,
      headers: {
        // method=='POST'?
        "Content-Type": method == "POST" && "application/json",
        Authorization: JSON.parse(localStorage.getItem("token")),
      },
      body:
        method == "POST" &&
        JSON.stringify({
          ...bodyData,
        }),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result, "task create");
        if (result.status == "success") {
          setSanckBarConfig({ open: true, message: result.message });
        }
        return result;
      })
      .catch((error) => console.log(error, "error creating task"));
  };

  return (
    <>
      <NavBarItem userName={userData?.name?.split(" ")[0]} />
      <div className="d-flex flex-column align-items-center justify-content-center">
        <div className="w-100 py-5 d-flex justify-content-center">
          <FormSection
            title={"TO DO TASK"}
            buttonText={"Save"}
            inputsList={inputsList}
            errorMessage={errorMessage}
            handleSubmit={handleTaskSubmit}
            isLoading={isLoading}
            formData={formTaskData}
          />
        </div>

        <SnackBarItem
          snackBarConfig={snackBarConfig}
          setSnackBarConfig={setSanckBarConfig}
        />

        <div className="container py-2 my-4 col-lg-8">
          {isLoading ? (
            <div className="py-5">
              <LoaderItem />
            </div>
          ) : (
            <>
              {tasksList.map((task) => (
                <TaskCardItem
                  key={task.id}
                  task={{
                    ...task,
                    readOnly: task.id != editableTask.id,
                    disabled:
                      editableTask.status && task.id !== editableTask.id,
                  }}
                  handleToggle={toggleTaskCompletion}
                  handleEdit={() =>
                    setEditableTask({ status: true, id: task.id })
                  }
                  handleCancle={() =>
                    setEditableTask({ status: false, id: null })
                  }
                  handleDelete={handleTaskDelete}
                  handleSave={handleTaskUpdate}
                  handleTitleChange={(e) => {
                    setEditableTask({ ...editableTask, title: e.target.value });
                  }}

                  // handleDelete={async () => {
                  //   // await fetch(
                  //   //   `http://localhost:2020/task/delete-task?id=${task.id}`,
                  //   //   {
                  //   //     method: "DELETE",
                  //   //     headers: {
                  //   //       Authorization: JSON.parse(
                  //   //         localStorage.getItem("token")
                  //   //       ),
                  //   //     },
                  //   //   }
                  //   // )
                  //   //   .then((response) => response.json())
                  //   //   .then((result) => {
                  //   //     console.log(result, "task create");
                  //   //     if (result.status == "success") {
                  //   //       const filterTasks = userData.tasks.filter(
                  //   //         ({ id }) => id !== task.id
                  //   //       );
                  //   //       setUserData({ ...userData, tasks: [...filterTasks] });
                  //   //       setsnackbarMessage(result.message);
                  //   //       // setIsLoading(false);
                  //   //       // setUserData({ ...userData, tasks: [...userData.tasks, result.data] });
                  //   //       // setFormTaskData({ user_id });
                  //   //     } else {
                  //   //       setsnackbarMessage(result.message);
                  //   //       setErrorMessage(result.message);
                  //   //       // setIsLoading(false);
                  //   //     }
                  //   //   })
                  //   //   .catch((error) =>
                  //   //     console.log(error, "error creating task")
                  //   //   );
                  //   // setIsOpenSnackBar(true);
                  // }}
                  // handleSave={async () => {
                  //   //   console.log(updateTask, "update");
                  //   //   setEditableTask({ status: false, id: null });
                  //   //   await fetch(
                  //   //     `http://localhost:2020/task/update-task?id=${task.id}`,
                  //   //     {
                  //   //       method: "POST",
                  //   //       headers: {
                  //   //         "Content-Type": "application/json",
                  //   //         Authorization: JSON.parse(
                  //   //           localStorage.getItem("token")
                  //   //         ),
                  //   //       },
                  //   //       body: JSON.stringify({
                  //   //         ...updateTask,
                  //   //       }),
                  //   //     }
                  //   //   )
                  //   //     .then((response) => response.json())
                  //   //     .then((result) => {
                  //   //       console.log(result, "task update");
                  //   //       // if (result.status == "success") {
                  //   //       //   setIsLoading(false);
                  //   //       //   // setUserData({
                  //   //       //   //   ...userData,
                  //   //       //   //   tasks: [...userData.tasks, result.data],
                  //   //       //   // });
                  //   //       //   // setFormTaskData({ user_id });
                  //   //       // } else {
                  //   //       //   setErrorMessage(result.message);
                  //   //       //   setIsLoading(false);
                  //   //       // }
                  //   //     })
                  //   //     .catch((error) =>
                  //   //       console.log(error, "error creating task")
                  //   //     );
                  // }}
                />
              ))}

              {/* {tasksList
                .filter(({ status }) => status == true)
                .map((task) => (
                  <TaskCardItem
                    key={task.id}
                    task={{
                      ...task,
                      readOnly: task.id != editableTask.id,
                      disabled:
                        editableTask.status && task.id !== editableTask.id,
                    }}
                    handleToggle={toggleTaskCompletion}
                    // updateTask={updateTask}
                    // isReadOnly={task.id != editableTask.id}
                    // isDisabled={editableTask.status && task.id !== editableTask.id}
                    // editableTask={editableTask}
                    handleEdit={() => {
                      setEditableTask({ status: true, id: task.id });
                      // setUpdateTask({
                      //   user_id: Number(user_id),
                      //   ...task,
                      //   // due_date: task.due_date?.split("T")[0],
                      // });
                    }}
                    handleCancle={() => {
                      setEditableTask({ status: false, id: null });
                    }}
                    handleDelete={async () => {
                      // await fetch(
                      //   `http://localhost:2020/task/delete-task?id=${task.id}`,
                      //   {
                      //     method: "DELETE",
                      //     headers: {
                      //       Authorization: JSON.parse(
                      //         localStorage.getItem("token")
                      //       ),
                      //     },
                      //   }
                      // )
                      //   .then((response) => response.json())
                      //   .then((result) => {
                      //     console.log(result, "task create");
                      //     if (result.status == "success") {
                      //       const filterTasks = userData.tasks.filter(
                      //         ({ id }) => id !== task.id
                      //       );
                      //       setUserData({ ...userData, tasks: [...filterTasks] });
                      //       setsnackbarMessage(result.message);
                      //       // setIsLoading(false);
                      //       // setUserData({ ...userData, tasks: [...userData.tasks, result.data] });
                      //       // setFormTaskData({ user_id });
                      //     } else {
                      //       setsnackbarMessage(result.message);
                      //       setErrorMessage(result.message);
                      //       // setIsLoading(false);
                      //     }
                      //   })
                      //   .catch((error) =>
                      //     console.log(error, "error creating task")
                      //   );
                      // setIsOpenSnackBar(true);
                    }}
                    handleSave={async () => {
                      //   console.log(updateTask, "update");
                      //   setEditableTask({ status: false, id: null });
                      //   await fetch(
                      //     `http://localhost:2020/task/update-task?id=${task.id}`,
                      //     {
                      //       method: "POST",
                      //       headers: {
                      //         "Content-Type": "application/json",
                      //         Authorization: JSON.parse(
                      //           localStorage.getItem("token")
                      //         ),
                      //       },
                      //       body: JSON.stringify({
                      //         ...updateTask,
                      //       }),
                      //     }
                      //   )
                      //     .then((response) => response.json())
                      //     .then((result) => {
                      //       console.log(result, "task update");
                      //       // if (result.status == "success") {
                      //       //   setIsLoading(false);
                      //       //   // setUserData({
                      //       //   //   ...userData,
                      //       //   //   tasks: [...userData.tasks, result.data],
                      //       //   // });
                      //       //   // setFormTaskData({ user_id });
                      //       // } else {
                      //       //   setErrorMessage(result.message);
                      //       //   setIsLoading(false);
                      //       // }
                      //     })
                      //     .catch((error) =>
                      //       console.log(error, "error creating task")
                      //     );
                    }}
                  />
                ))} */}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default TaskHomePage;
