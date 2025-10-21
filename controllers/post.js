const Post = require("../models/post");

/*
  INSTRUCTION: setup the Post controller here
*/

/*
  page: Page number (default: 1) 
  per_page: Posts per page (default: 10) 
  sort: Sort field (“title”, “created_on”, “published_on”, default: “published_on”) 
  order: Sort order (“asc” or “desc”, default: “desc”) 
  category: Filter by category ID 
  user: Filter by author/user ID 
*/

const getPosts = async (
  userId,
  category,
  page = 1,
  sort = "published_on", // value of sort will change based on the user's query
  order = "desc",
  per_page = 10
) => {
  const validSortFields = ["title", "created_on", "published_on"];

  // if user passes an invalid sort field, use default
  if (!validSortFields.includes(sort)) {
    sort = "published_on";
  }

  let filter = {
    status: "published",
  };

  if (userId) {
    filter.user = userId;
  }

  if (category) {
    filter.category = category;
  }

  const sortOrder = order === "desc" ? -1 : 1;

  const posts = await Post.find(filter)
    .limit(per_page) // limit the number of items shown
    .skip((page - 1) * per_page) // skip the amount of items;
    .sort({ [sort]: sortOrder }) // sort by the sort value and sort order from the query (default: published_on, desc);
    .populate([{ path: "user" }, { path: "category" }]); // populate user & category
  return posts;
};

const getPost = async (id) => {
  const post = await Post.findById(id);

  if (post.status === "draft") {
    throw new Error("This post doesn't exist or hasn't been published yet.");
  }

  return post;
};

const addPost = async (userId, title, content, category) => {
  const newPost = new Post({
    title,
    content,
    user: userId,
    category,
  });
  await newPost.save();
  return newPost;
};

const updatePost = async (id, title, content, category) => {
  const updatedPost = await Post.findByIdAndUpdate(
    id,
    {
      title,
      content,
      category,
    },
    { new: true }
  );
  return updatedPost;
};

const deletePost = async (id) => {
  return await Post.findByIdAndDelete(id);
};

// change status from "draft" to "published"
const publishPost = async (id) => {
  const publishedPost = await Post.findByIdAndUpdate(
    id,
    {
      status: "published",
      published_on: Date.now(),
    },
    { new: true }
  );
  return publishedPost;
};

module.exports = {
  getPosts,
  getPost,
  addPost,
  updatePost,
  deletePost,
  publishPost,
};
