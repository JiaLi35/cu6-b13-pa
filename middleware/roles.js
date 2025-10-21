/* 
  INSTRUCTION: setup the roles middleware here
*/

const jwt = require("jsonwebtoken");
const { getUserByEmail } = require("../controllers/auth");

// to check if the user is a valid user (control whether anyone who calls the API is a valid logged in user)
const isValidUser = async (req, res, next) => {
  try {
    const { authorization = "" } = req.headers;
    // 1. extract the token from authorization header
    // method 1 - .replace
    const token = authorization.replace("Bearer ", "");
    // 2. verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // 3. get the user data by email
    const user = await getUserByEmail(decoded.email);
    // 4. verify if user exists
    if (user) {
      // add the user data into the request
      req.user = user;
      // trigger the next function
      next();
    } else {
      // trigger error if not admin
      res.status(403).send({ error: "YOU SHALL NOT PASS" });
    }
  } catch (error) {
    console.log(error);
    res.status(403).send({ error: "YOU SHALL NOT PASS" });
  }
};

// to check if the user is an author or not
const isAuthorOrAdmin = async (req, res, next) => {
  try {
    const { authorization = "" } = req.headers;
    /* step 1: extract the token from authorization header */
    // method 1: using .replace
    const token = authorization.replace("Bearer ", "");
    // 2. verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // 3. get the user data by email
    const user = await getUserByEmail(decoded.email);
    // 4. verify if the user exists and is an admin
    if (user && (user.role === "author" || user.role === "admin")) {
      // add the user data into the request
      req.user = user;
      // trigger the next function
      next();
    } else {
      res.status(403).send({ error: "YOU SHALL NOT PASS" });
    }
  } catch (error) {
    console.log(error);
    res.status(403).send({ error: "YOU SHALL NOT PASS" });
  }
};

// to check if the user is an admin or not
const isAdmin = async (req, res, next) => {
  try {
    const { authorization = "" } = req.headers;
    /* step 1: extract the token from authorization header */
    // method 1: using .replace
    const token = authorization.replace("Bearer ", "");
    // 2. verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // 3. get the user data by email
    const user = await getUserByEmail(decoded.email);
    // 4. verify if the user exists and is an admin
    if (user && user.role === "admin") {
      // add the user data into the request
      req.user = user;
      // trigger the next function
      next();
    } else {
      res.status(403).send({ error: "YOU SHALL NOT PASS" });
    }
  } catch (error) {
    console.log(error);
    res.status(403).send({ error: "YOU SHALL NOT PASS" });
  }
};

module.exports = {
  isValidUser,
  isAuthorOrAdmin,
  isAdmin,
};
