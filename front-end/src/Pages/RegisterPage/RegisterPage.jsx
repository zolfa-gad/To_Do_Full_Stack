import { useContext, useState } from "react";
import FormSection from "../../Components/FormSection/FormSection";
import { AuthorizeContext } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Email,
  Password,
  Key,
  Person,
  VisibilityOff,
  Visibility,
  AccountCircle,
} from "@mui/icons-material";

const RegisterPage = () => {
  const inputsList = [
    {
      label: "Name",
      name: "name",
      type: "text",
      icon: <Person />,
    },
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
      label: "Confirm Password",
      name: "confirm_password",
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

  const { setIsAuthorizeUser } = useContext(AuthorizeContext);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    user_name: "",
    email: "",
    password: "",
    confirm_password: "",
    remember: true,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(formData, "form");
    if (formData.confirm_password == formData.password) {
      setIsLoading(true);

      await fetch(`http://localhost:2020/auth/register`, {
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
    } else {
      setErrorMessage("Passwords do not match");
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center">
      <FormSection
        title={"REGISTER"}
        buttonText={"Register"}
        subButtonText={"LOGIN"}
        subButtonString={"Already Have Account"}
        inputsList={inputsList}
        errorMessage={errorMessage}
        handleSubmit={handleSubmit}
        formData={formData}
        isLoading={isLoading}
      />
    </div>
  );
};

export default RegisterPage;
