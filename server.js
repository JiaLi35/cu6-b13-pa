require("dotenv").config();
// import express
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// create the express app
const app = express();

// middleware to handle JSON request
app.use(express.json());

// setup cors policy
app.use(cors());

// connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URL + "/blogdb")
  .then(() => {
    // if mongodb is successfully connected
    console.log("MongoDB is connected");
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error);
  });

// root route
app.get("/", (req, res) => {
  res.json({ message: "Blog API is running" });
});

// INSTRUCTION: setup the routes here
app.use("/auth", require("./routes/auth"));
app.use("/categories", require("./routes/categories"));
app.use("/posts", require("./routes/posts"));

// start the server
const PORT = process.env.PORT || 5123;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
