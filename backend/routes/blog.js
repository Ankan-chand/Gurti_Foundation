const express = require('express');
const { isAuthenticated } = require('../middlewares/auth');
const { createBlog, deleteBlog, updateBlog, getAllBlogs } = require('../controller/blog');

const router = express.Router();


router.route("/blog/create").post(isAuthenticated, createBlog);
router.route("/blog/delete/:blogId").delete(isAuthenticated, deleteBlog).put(isAuthenticated, updateBlog);
router.route("/blog/update/:blogId").put(isAuthenticated, updateBlog);
router.route("/blogs").get(getAllBlogs);


module.exports = router;