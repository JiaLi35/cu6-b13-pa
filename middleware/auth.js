/* INSTRUCTION: setup authentication middleware here */
const jwt = require("jsonwebtoken");
const Post = require("../models/post");
const Comment = require("../models/comment");
const { getUserByEmail } = require("../controllers/auth");

// to check if the user's id in their token is the same as the user field in the post
const isOwnPost = async (req, res, next) => {
  try {
    /* step 1: extract the token from authorization header */
    const { authorization = "" } = req.headers;

    // method 1: using .replace
    const token = authorization.replace("Bearer ", "");
    // 2. verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // 3. Fetch user and post
    const user = await getUserByEmail(decoded.email);
    if (!user) {
      return res.status(401).send({ message: "User not found" });
    }

    const post = await Post.findById(req.params.id).populate("user");
    if (!post) {
      return res.status(404).send({ message: "Post not found" });
    }

    // 4. Check if user is owner or admin
    const isOwner = post.user._id.toString() === user._id.toString();
    const isAdmin = user.role === "admin";

    // If not the owner or the admin,
    if (!isOwner || !isAdmin) {
      return res.status(403).send({ message: "YOU SHALL NOT PASS" });
    }

    // Attach to request and continue
    req.user = user;
    req.post = post;
    next();
  } catch (error) {
    console.log(error);
    res.status(403).send({ error: "YOU SHALL NOT PASS" });
  }
};

// to check if the user's id in their token is the same as the user field in the comment
const isOwnComment = async (req, res, next) => {
  try {
    /* step 1: extract the token from authorization header */
    const { authorization = "" } = req.headers;

    // method 1: using .replace
    const token = authorization.replace("Bearer ", "");
    // 2. verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // 3. Fetch user and comment
    const user = await getUserByEmail(decoded.email);
    if (!user) {
      return res.status(401).send({ message: "User not found" });
    }

    const comment = await Comment.findById(req.params.commentId).populate(
      "user"
    );
    if (!comment) {
      return res.status(404).send({ message: "Post not found" });
    }

    // 4. Check if user is owner or admin
    const isOwner = comment.user._id.toString() === user._id.toString();
    const isAdmin = user.role === "admin";

    // If not the owner or the admin,
    if (!isOwner || !isAdmin) {
      return res.status(403).send({ message: "YOU SHALL NOT PASS" });
    }

    // Attach to request and continue
    req.user = user;
    req.comment = comment;
    next();
  } catch (error) {
    console.log(error);
    res.status(403).send({ error: "YOU SHALL NOT PASS" });
  }
};

module.exports = {
  isOwnPost,
  isOwnComment,
};
