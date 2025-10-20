const mongoose = require("mongoose");
const { Schema, model } = mongoose;

/*
  INSTRUCTION: setup the Category model according to the following requirements:
    - name: (String, required, unique)
*/

const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

// category model
const Category = model("Category", categorySchema);

module.exports = Category;
