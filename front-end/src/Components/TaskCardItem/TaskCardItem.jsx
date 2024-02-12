import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { Edit, Delete, Save, Close } from "@mui/icons-material";

const TaskCardItem = ({
  task,
  handleToggle,
  handleEdit,
  handleCancle,
  handleDelete,
  handleTitleChange,
  handleSave,
}) => {
  const editButtons = [
    {
      idBtn: "editBtn",
      icon: <Edit />,
      handle: handleEdit,
    },
    {
      idBtn: "deleteBtn",
      icon: <Delete />,
      handle: handleDelete,
    },
  ];

  const saveButtons = [
    {
      idBtn: "saveBtn",
      icon: <Save />,
      handle: handleSave,
    },
    {
      idBtn: "cancleBtn",
      icon: <Close />,
      handle: handleCancle,
    },
  ];

  return (
    <div className="d-flex flex-column p-1 my-3 border shadow-sm rounded-2">
      <div
        className={`d-flex justify-content-between ${
          task.disabled && "opacity-50"
        }`}
      >
        <span className="px-1 m-1 fst-italic">{task.due_date}</span>

        <span
          className={`px-1 p-0 m-1 alert alert-${
            task.status ? "success" : "danger"
          } fst-italic`}
        >
          {task.status ? "Done" : "Pending"}
        </span>
      </div>

      <Box
        component={"div"}
        className="d-flex align-items-center justify-content-center"
      >
        <FormControlLabel
          className="m-0"
          fullwidth
          control={
            <Checkbox
              defaultChecked={task.status}
              name="status"
              disabled={task.disabled}
              onChange={(e) => handleToggle(e, task.id)}
            />
          }
        />
        <TextField
          onChange={handleTitleChange}
          type="text"
          name="title"
          margin="dense"
          variant="outlined"
          defaultValue={task.title}
          disabled={task.disabled}
          fullWidth
          InputProps={{ readOnly: task.readOnly }}
          sx={{
            ".MuiInputLabel-root": {
              color: "black",
              fontWeight: "900 !important",
            },

            "& fieldset": task.readOnly && { border: "none" },
          }}
          InputLabelProps={{
            shrink: true,
            style: {
              fontWeight: "900",
              borderColor: "black",
            },
          }}
        />

        <div
          className="px-2 d-flex align-items-center justify-content-center"
          style={{ minWidth: "90px" }}
        >
          {task.readOnly && !task.disabled
            ? editButtons.map((btn) => (
                <IconButton
                  key={btn.idBtn}
                  color="primary"
                  onClick={() => btn.handle(task.id)}
                >
                  {btn.icon}
                </IconButton>
              ))
            : !task.readOnly &&
              saveButtons.map((btn) => (
                <IconButton
                  key={btn.idBtn}
                  color="primary"
                  onClick={btn.handle}
                >
                  {btn.icon}
                </IconButton>
              ))}
        </div>
      </Box>
    </div>
  );
};

export default TaskCardItem;
