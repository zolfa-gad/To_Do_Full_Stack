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
import FormSection from "../../Components/FormSection/FormSection";
import { AuthorizeContext } from "./../../Context/AuthContext";

const LoginPage = () => {
  const inputsList = [
    {
      label: "Email",
      name: "email",
      type: "email",
      icon: <Person />,
    },
    {
      label: "Password",
      name: "password",
      type: "password",
      icon: <Key />,
    },
    {
      label: "Remember Me",
      name: "remember",
      type: "checkbox",
    },
  ];

  const navigator = useNavigate();
  //   const { setIsAdminUser } = useContext(GlobalContext);
  //   const setIsAdminUser = () => {};

  //   const [isVisiblePassword, setIsVisiblePassword] = useState(false);
  const { setIsAuthorizeUser } = useContext(AuthorizeContext);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: true,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(formData, "form");

    setIsLoading(true);

    await fetch(`http://localhost:2020/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...formData,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result, "user login");

        if (result.status == "success") {
          localStorage.setItem("token", JSON.stringify(result.data.token));

          setIsAuthorizeUser(true);

          setTimeout(() => {
            navigator("/");
          }, 1000);
          
        } else {
          setErrorMessage(result.message);
          setIsLoading(false);
          setIsAuthorizeUser(false);
        }
      })
      .catch((error) => console.log(error, "error"));

    // inputsList.map((input) => {
    //   formData[input.name] =
    //     input.type == "checkbox"
    //       ? e.target[input.name].checked
    //       : e.target[input.name].value;

    //   console.log(input.name, e.target[input.name].value);
    // });

    // userLogIn();
  };

  //   async function userLogIn() {
  //     console.log(formData, "form data");
  //     await fetch(`https://user-licenes-details.onrender.com/login`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         ...formData,
  //       }),
  //     })
  //       .then((response) => response.json())
  //       .then((result) => {
  //         console.log(result, "data create");

  //         if (result.status == "success") {
  //           localStorage.setItem("AdminToken", JSON.stringify(result.token));
  //           setIsAdminUser(true);

  //           navigator(`/admin/new-licenes`);
  //           // save token to local storage
  //         } else {
  //           setIsAdminUser(false);

  //           setErrorMsg(result.message);
  //           setIsLoading(false);
  //           // setIsLoading(false);
  //         }
  //       })
  //       .catch((error) => console.log(error, "error"));
  //   }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center">
      <FormSection
        title={"LOGIN"}
        buttonText={"Log In"}
        subButtonText={"REGISTER"}
        subButtonString={"Don't Have Account"}
        inputsList={inputsList}
        errorMessage={errorMessage}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        formData={formData}
      />
    </div>
  );

  //   return (
  //     <div className="min-vh-100 border d-flex align-items-center justify-content-center">
  //       <form
  //         className="py-4 container col-11 col-lg-6 col-md-7 border shadow rounded-2"
  //         onSubmit={handleSubmit}
  //       >
  //         <h2 className="py-2 text-primary">LOGIN</h2>
  //         {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}
  //         {inputsList.map((input) =>
  //           input.type !== "checkbox" ? (
  //             <TextField
  //               key={input.name}
  //               sx={{
  //                 ".Mui-focused": {
  //                   "& .MuiSvgIcon-root": {
  //                     color: "#1976d2",
  //                   },
  //                 },
  //               }}
  //               fullWidth
  //               //   color="success"
  //               margin="normal"
  //               defaultValue=""
  //               label={input.label}
  //               name={input.name}
  //               type={
  //                 input.name == "password" && isVisiblePassword
  //                   ? "text"
  //                   : input.type
  //               }
  //               InputProps={{
  //                 startAdornment: (
  //                   <InputAdornment position="start">{input.icon}</InputAdornment>
  //                 ),
  //                 endAdornment: input.name == "password" && (
  //                   <IconButton
  //                     onClick={() => {
  //                       console.log("hello");
  //                       setIsVisiblePassword(!isVisiblePassword);
  //                     }}
  //                   >
  //                     {isVisiblePassword ? <Visibility /> : <VisibilityOff />}
  //                   </IconButton>
  //                 ),
  //               }}
  //             />
  //           ) : (
  //             <FormControlLabel
  //               key={input.name}
  //               label={input.label}
  //               fullWidth
  //               control={<Checkbox defaultChecked name={input.name} />}
  //             />
  //           )
  //         )}

  //         <div className="pt-5 d-flex flex-column justify-content-center align-items-center ">
  //           <Button
  //             variant="contained"
  //             type="submit"
  //             sx={{ paddingX: "100px", paddingY: "10px", marginBottom: "5px" }}
  //           >
  //             Log In
  //           </Button>

  //           <div className="d-flex justify-content-center gap-2">
  //             <span>Don't Have Account</span>
  //             <Link to={"/register"}>Register</Link>
  //           </div>
  //         </div>
  //       </form>
  //     </div>
  //   );
};

export default LoginPage;
