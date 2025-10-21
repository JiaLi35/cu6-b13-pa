/* INSTRUCTION: setup the categories router here */
const express = require("express");
const router = express.Router();
const {
  getCategories,
  addCategory,
  deleteCategory,
  updateCategory,
} = require("../controllers/category");

/* 
  query parameters for getCategories: 
  page: Page number (default: 1)
  per_page: Categories per page (default: 20)
  sort: Sort field (default: “name”)
  order: Sort order (“asc” or “desc”, default: “asc”)
  name: Filter by category name
*/

router.get("/", async (req, res) => {
  try {
    // query params
    const name = req.query.name;
    const page = req.query.page;
    const order = req.query.order;
    const categories = await getCategories(name, page, order);
    res.status(200).send(categories);
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: error.message });
  }
});

/* ADD MIDDLEWARE FOR ADMIN ONLY ACCESS FOR THESE THREE BELOW */

router.post("/", async (req, res) => {
  try {
    const name = req.body.name;
    const newCategory = await addCategory(name);
    res.status(200).send(newCategory);
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const name = req.body.name;
    const updatedCategory = await updateCategory(id, name);
    res.status(200).send(updatedCategory);
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await deleteCategory(id);
    res.status(200).send({
      message: `Category with id ${id} has been deleted successfully.`,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: error.message });
  }
});

module.exports = router;
