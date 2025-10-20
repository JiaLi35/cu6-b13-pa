const mongoose = require("mongoose");
const { Schema, model } = mongoose;

/*
  INSTRUCTION: setup the User model according to the following requirements:
    - name: (String, required)
    - email: (String, required, unique)
    - password: (String, required)
    - role: (String, enum: ['reader', 'author', 'admin'], default: 'reader')
*/

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["reader", "author", "admin"], // enum to control the value for role (no random roles)
    default: "reader",
  },
});

// user model
const User = model("User", userSchema);

module.exports = User;
