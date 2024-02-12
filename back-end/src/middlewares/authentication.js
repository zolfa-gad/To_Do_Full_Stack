const jwt = require("jsonwebtoken");

function TokenVerification(request, response, next) {
  const token = request.header("Authorization");

  if (!token) {
    return response.status(401).json({
      status: "error",
      message: "Not Authorized.",
    });
  }

  // try {
  jwt.verify(token, process.env.JWT_SECRET_KEY, (error, decoded) => {
    if (error) {
      response
        .status(401)
        .json({ status: "error", message: "Not Authorized." });
    } else {
      console.log(decoded.userID, "user id");
      request.userID = decoded.userID;
      next();
    }
    console.log(decoded, "decoded");
    console.log(error, "error");
  });

  // } catch (error) {
  //   response.status(401).json({
  //     status: "error",
  //     message: "Faild to authorize try again later",
  //   });
  // }
}

module.exports = TokenVerification;
