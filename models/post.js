const mongoose = require("mongoose");
const { Schema, model } = mongoose;

/*
  INSTRUCTION: setup the Post model according to the following requirements:
    - title: (String, required)
    - content: (String, required)
    - user: (ObjectId, ref: "User", required)
    - category: (ObjectId, ref: "Category", required)
    - status: (String, enum: ["draft", "published"], default: "draft")
    - created_on: (Date, default: Date.now)
    - published_on: (Date, default: null)
*/

const postSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  status: {
    type: String,
    enum: ["draft", "published"], // enum to control the value for role (no random roles)
    default: "draft",
  },
  created_on: {
    type: Date,
    default: Date.now(),
  },
  published_on: {
    type: Date,
    default: null,
  },
});

// post model
const Post = model("Post", postSchema);

module.exports = Post;
