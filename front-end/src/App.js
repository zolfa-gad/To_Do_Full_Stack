import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import TaskHomePage from "../src/Pages/TaskHomePage/TaskHomePage";
import LoginPage from "./Pages/LoginPage/LoginPage";
import { AuthorizeContext } from "./Context/AuthContext";
import { useContext } from "react";
import RegisterPage from "./Pages/RegisterPage/RegisterPage";

const App = () => {
  const { isAuthorizeUser } = useContext(AuthorizeContext);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/"
          element={
            isAuthorizeUser ? <TaskHomePage /> : <Navigate to={"/login"} />
          }
        />

        {/* {isAuthorizeUser.status ? (
          <>
            <Route path="/" element={<TaskHomePage />} />
            <Route path=":user_id" element={<TaskHomePage />} />
          </>
        ) : (
          <Route path="/" element={<Navigate to="/login" />} />
        )} */}

        <Route
          path="*"
          element={
            <div className="min-vh-100 bg-primary-subtle d-flex align-items-center justify-content-center">
              <h2 className="fw-bolder">Not Found</h2>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
