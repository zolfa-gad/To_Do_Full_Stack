import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  InputLabel,
  InputAdornment,
  FormControl,
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  IconButton,
  Box,
} from "@mui/material";

import {
  Email,
  Password,
  Key,
  Person,
  VisibilityOff,
  Visibility,
  AccountCircle,
} from "@mui/icons-material";
import LoaderItem from "../LoaderItem/LoaderItem";

const FormSection = ({
  handleSubmit,
  title,
  errorMessage,
  inputsList,
  buttonText,
  subButtonText,
  subButtonString,
  isLoading,
  formData,
}) => {
  const [isVisiblePassword, setIsVisiblePassword] = useState(false);

  return (
    <form
      className="p-4 col-11 col-lg-6 col-md-7 border shadow rounded-2"
      onSubmit={handleSubmit}
    >
      <h2 className="py-2 text-primary">{title}</h2>
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      {inputsList.map((input) =>
        input.type == "checkbox" ? (
          <FormControlLabel
            key={input.name}
            label={input.label}
            fullwidth
            control={
              <Checkbox
                defaultChecked
                name={input.name}
                onChange={(e) => {
                  formData[input.name] = e.target.checked;
                }}
              />
            }
          />
        ) : (
          <TextField
            key={input.name}
            label={input.label}
            name={input.name}
            sx={{
              ".Mui-focused": {
                "& .MuiSvgIcon-root": {
                  color: "#1976d2",
                },
              },
            }}
            fullWidth
            margin="normal"
            defaultValue=""
            // required
            type={
              input.name == "password" && isVisiblePassword
                ? "text"
                : input.type
            }
            InputProps={{
              // readOnly: input.type == "date",
              startAdornment: (
                <InputAdornment position="start">{input.icon}</InputAdornment>
              ),
              endAdornment: input.name == "password" && (
                <IconButton
                  onClick={() => {
                    console.log("hello");
                    setIsVisiblePassword(!isVisiblePassword);
                  }}
                >
                  {isVisiblePassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              ),
            }}
            onChange={(e) => {
              formData[input.name] = e.target.value;
            }}
          />
        )
      )}

      {isLoading ? (
        <LoaderItem />
      ) : (
        <div className="pt-5 d-flex flex-column justify-content-center align-items-center ">
          <Button
            variant="contained"
            type="submit"
            sx={{ paddingX: "100px", paddingY: "10px", marginBottom: "5px" }}
          >
            {buttonText}
          </Button>

          <div className="d-flex justify-content-center gap-2">
            <span>{subButtonString}</span>
            <Link replace to={`/${subButtonText?.toLowerCase()}`}>
              {subButtonText}
            </Link>
          </div>
        </div>
      )}
    </form>
  );
};

export default FormSection;
