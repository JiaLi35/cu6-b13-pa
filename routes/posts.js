/* INSTRUCTION: setup the posts & comments router here */
const express = require("express");
const router = express.Router();
const {
  getPosts,
  getPost,
  addPost,
  updatePost,
  deletePost,
  publishPost,
} = require("../controllers/post");
const {
  getComments,
  addComment,
  updateComment,
  deleteComment,
} = require("../controllers/comment");
const { isAuthorOrAdmin, isValidUser } = require("../middleware/roles");
const { isOwnPost, isOwnComment } = require("../middleware/auth");

/* POSTS routes */
// get posts
/*
  page: Page number (default: 1) 
  per_page: Posts per page (default: 10) 
  sort: Sort field (“title”, “created_on”, “published_on”, default: “published_on”) 
  order: Sort order (“asc” or “desc”, default: “desc”) 
  category: Filter by category ID 
  user: Filter by author/user ID 
*/
router.get("/", async (req, res) => {
  try {
    // query params
    const { userId, category, page, sort, order } = req.query;
    const categories = await getPosts(
      userId,
      category,
      page,
      sort, // value of sort will change based on the user's query
      order
    );
    res.status(200).send(categories);
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: error.message });
  }
});

// get 1 post by id
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const post = await getPost(id);
    res.status(200).send(post);
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: error.message });
  }
});

router.post("/", isAuthorOrAdmin, async (req, res) => {
  try {
    const userId = req.user._id;
    const { title, content, category } = req.body;
    const newPost = await addPost(userId, title, content, category);
    res.status(200).send(newPost);
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: error.message });
  }
});

router.put("/:id", isOwnPost, async (req, res) => {
  try {
    const id = req.params.id;
    const { title, content, category } = req.body;
    const updatedPost = await updatePost(id, title, content, category);
    res.status(200).send(updatedPost);
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: error.message });
  }
});

router.delete("/:id", isOwnPost, async (req, res) => {
  try {
    const id = req.params.id;
    await deletePost(id);
    res
      .status(200)
      .send({ message: `Post with id ${id} has been deleted successfully.` });
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: error.message });
  }
});

router.post("/:id/publish", isOwnPost, async (req, res) => {
  try {
    const id = req.params.id;
    const publishedPost = await publishPost(id);
    res.status(200).send(publishedPost);
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: error.message });
  }
});

/* COMMENTS routes */
// get one post's comments
router.get("/:postId/comments", async (req, res) => {
  try {
    const postId = req.params.postId;
    const page = req.query.page;
    const order = req.query.order;
    const comments = await getComments(postId, page, order);
    res.status(200).send(comments);
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: error.message });
  }
});

// add a comment under a post
router.post("/:postId/comments", isValidUser, async (req, res) => {
  try {
    const userId = req.user._id;
    const postId = req.params.postId;
    const content = req.body.content;
    const newComment = await addComment(content, postId, userId);
    res.status(200).send(newComment);
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: error.message });
  }
});

// edit your comment under that post
router.put("/:postId/comments/:commentId", isOwnComment, async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const content = req.body.content;
    const updatedComment = await updateComment(commentId, content);
    res.status(200).send(updatedComment);
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: error.message });
  }
});

// delete your comment under that post
router.delete(
  "/:postId/comments/:commentId",
  isOwnComment,
  async (req, res) => {
    try {
      const commentId = req.params.commentId;
      await deleteComment(commentId);
      res.status(200).send({
        message: `Comment with id ${commentId} has been deleted successfully`,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({ message: error.message });
    }
  }
);

module.exports = router;
