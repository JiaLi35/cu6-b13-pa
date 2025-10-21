/*
  INSTRUCTION: setup the Category controller here
*/
const Category = require("../models/category");
const Post = require("../models/post");

/* 
  query parameters for getCategories: 
  page: Page number (default: 1)
  per_page: Categories per page (default: 20)
  sort: Sort field (default: “name”)
  order: Sort order (“asc” or “desc”, default: “asc”)
  name: Filter by category name
*/

const getCategories = async (name, page = 1, order = "asc", per_page = 20) => {
  let filter = {};

  if (name) {
    filter.name = name;
  }

  const sortOrder = order === "desc" ? -1 : 1;

  const categories = await Category.find(filter)
    .limit(per_page) // limit the number of items shown
    .skip((page - 1) * per_page) // skip the amount of items;
    .sort({ name: sortOrder }); // sort by name (default ascending)
  return categories;
};

const addCategory = async (name) => {
  const newCategory = new Category({
    name,
  });
  await newCategory.save();
  return newCategory;
};

const updateCategory = async (id, name) => {
  const updatedCategory = await Category.findByIdAndUpdate(
    id,
    { name },
    { new: true }
  );
  return updatedCategory;
};

const deleteCategory = async (id) => {
  // if post with this category exists, throw an error
  const existingPost = await Post.findOne({ category: id });

  if (existingPost) {
    throw new Error("This category is still attached to a post.");
  }

  return await Category.findByIdAndDelete(id);
};

module.exports = {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
};
