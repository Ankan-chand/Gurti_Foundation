const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  date: {
    type: Date,
    default: Date.now,
  },

  author: {
    type: String,
    required: true,
  },

  image: {
    // type: String,
    public_id: String,
    url: String,
  },

  content: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Blog", blogSchema);
