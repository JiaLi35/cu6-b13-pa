/*
  INSTRUCTION: setup the Comment controller here
*/
const Comment = require("../models/comment");

/*
  page: Page number (default: 1)
  limit: Comments per page (default: 10)
  sort: Sort field (default: “created_on”)
  order: Sort order (“asc” or “desc”, default: “desc”)
 */

const getComments = async (postId, page = 1, per_page = 10, order = "desc") => {
  const sortOrder = order === "desc" ? -1 : 1;

  const comments = await Comment.find({ post: postId })
    .limit(per_page) // limit the number of items shown
    .skip((page - 1) * per_page) // skip the amount of items;;
    .sort({
      created_on: sortOrder,
    })
    .populate("user");

  return comments;
};

const addComment = async (content, postId, userId) => {
  const newComment = new Comment({
    content,
    post: postId,
    user: userId,
  });
  await newComment.save();
  return newComment;
};

const updateComment = async (id, content) => {
  const updatedComment = await Comment.findByIdAndUpdate(
    id,
    { content },
    { new: true }
  );
  return updatedComment;
};

const deleteComment = async (id) => {
  return await Comment.findByIdAndDelete(id);
};

module.exports = {
  getComments,
  addComment,
  updateComment,
  deleteComment,
};
