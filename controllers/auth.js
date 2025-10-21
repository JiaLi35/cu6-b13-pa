/* INSTRUCTION: setup authentication related functions here */
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

const getUserByEmail = async (email) => {
  return await User.findOne({ email: email });
};

const login = async (email, password) => {
  // 1. check if the email provided is in the system
  const user = await getUserByEmail(email);
  // if not exist, throw an error
  if (!user) {
    throw new Error("Inavlid email or password");
  }

  // if exists, compare the passwords
  const passwordMatch = bcrypt.compareSync(password, user.password);
  if (!passwordMatch) {
    throw new Error("Invalid email or password");
  }

  // generate the JWT token
  let token = jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET, // secret
    { expiresIn: 60 * 60 * 8 }
  );

  // if password is correct, return the user data
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: token,
  };
};

const signup = async (name, email, password, role) => {
  // 1. check if email provided already exists or not
  const emailExists = await User.findOne({ email: email });
  // if email exists, throw an error
  if (emailExists) {
    throw new Error(
      "Email already exists. Please use another email or login with your existing email."
    );
  }

  // 2. create new user
  const newUser = new User({
    name: name,
    email: email,
    password: bcrypt.hashSync(password, 10), // hash the password with 10 rounds of salt
    role: role,
  });

  // 3. save the user
  await newUser.save();

  // 4. generate the JWT token
  let token = jwt.sign(
    {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    },
    process.env.JWT_SECRET, // secret
    { expiresIn: 60 * 60 * 8 }
  );

  // 5. return the new user data
  return {
    _id: newUser._id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
    token: token,
  };
};

module.exports = {
  getUserByEmail,
  login,
  signup,
};
