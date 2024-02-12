import { createContext, useEffect, useState } from "react";
export const AuthorizeContext = createContext(0);

const AuthorizeContextProvider = ({ children }) => {
  const [isAuthorizeUser, setIsAuthorizeUser] = useState(true);

  useEffect(() => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      setIsAuthorizeUser(true);
    } catch (error) {
      setIsAuthorizeUser(false);
    }
  }, []);

  return (
    <AuthorizeContext.Provider
      value={{
        isAuthorizeUser,
        setIsAuthorizeUser,
      }}
    >
      {children}
    </AuthorizeContext.Provider>
  );
};

export default AuthorizeContextProvider;
