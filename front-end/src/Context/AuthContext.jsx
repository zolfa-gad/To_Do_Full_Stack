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

  // useEffect(() => {
  //   const fetchData = async () => {
  //     await checkAuthorizeUser();
  //   };

  //   fetchData();
  // }, []);
  //   const [currentUserID, setCurrentUserID] = useState(null);

  //   useEffect(() => {
  //     checkAuthorizeUser();

  //     // console.log(tokenSession, "session");

  //     // if (!tokenLocal && !tokenSession) {
  //     //   setIsAuthorizeUser(false);
  //     //   console.log("is auth false");
  //     // } else {
  //     //   setIsAuthorizeUser(true);
  //     //   console.log("is auth true");
  //     // }
  //   }, []);

  // const checkAuthorizeUser = async () => {
  //   const token = JSON.parse(localStorage.getItem("token"));
  //   console.log(token, "token");

  //   await fetch("http://localhost:2020/", {
  //     method: "POST",
  //     headers: {
  //       // "Content-Type": "application/json",
  //       Authorization: token,
  //     },
  //     // body: JSON.stringify({ token }),
  //   })
  //     .then((response) => response.json())
  //     .then((result) => {
  //       console.log(result, "auth user");
  //       if (result.status == "success") {
  //         //   setCurrentUserID(result.id);
  //         setIsAuthorizeUser({ status: true, id: result.id });
  //       } else {
  //         setIsAuthorizeUser({ status: false, id: null });
  //       }
  //     })
  //     .catch((error) => console.log(error, "error while auth"));
  // };

  //   useEffect(() => {
  //     checkUserAuth();
  //   }, []);

  //   async function checkUserAuth() {
  //     const savedToken = JSON.parse(localStorage.getItem("token"));
  //     console.log(savedToken, "token");
  //     await fetch(`http://localhost:2020/auth`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         token: savedToken,
  //       }),
  //     })
  //       .then((response) => response.json())
  //       .then((result) => {
  //         console.log(result, "data create");

  //         if (result.status == "error") {
  //           // navigate("/login");
  //           setIsAuthorizeUser(false);
  //           // localStorage.setItem("Token", JSON.stringify(result.token));
  //           // navigator(`/admin`);
  //           // save token to local storage
  //         } else {
  //           setIsAuthorizeUser(true);
  //           // navigate("/admin/new-licenes");
  //         }
  //         // else {
  //         //   setErrorMsg(result.message);
  //         //   // setIsLoading(false);
  //         // }
  //       })
  //       .catch((error) => console.log(error, "error"));
  //   }

  return (
    <AuthorizeContext.Provider
      value={{
        isAuthorizeUser,
        setIsAuthorizeUser,
        // currentUserID,
        // setCurrentUserID,
        // checkAuthorizeUser,
      }}
    >
      {children}
    </AuthorizeContext.Provider>
  );
};

export default AuthorizeContextProvider;
