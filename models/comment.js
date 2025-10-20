const mongoose = require("mongoose");
const { Schema, model } = mongoose;

/*
  INSTRUCTION: setup the Comment model according to the following requirements:
    - content: (String, required)
    - post: (ObjectId, ref: "Post", required)
    - user: (ObjectId, ref: "User", required)
*/

const commentSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

// comment model
const Comment = model("Comment", commentSchema);

module.exports = Comment;
