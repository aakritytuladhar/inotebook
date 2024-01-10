// const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const JWT_SECRET = "aakruisagoodG$irl";

const fetchuser = (req, res, next) => {
  //get the user from the jwt token and add id to req object
  const token = req.header("auth-token");
  if (!token) {
    res.status(401).send({ error: "pls authenicate the valid token" });
  }
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user;
    next();
  } catch (error) {
    console.error(error.message);

    res.status(500).send("Internal server  error occors");
  }
};
module.exports = fetchuser;
