const express = require('express');
const { isAuthenticated } = require('../middlewares/auth');
const { createBlog, deleteBlog, updateBlog, getAllBlogs } = require('../controller/blog');
const singleUpload = require('../middlewares/multer');

const router = express.Router();


router.route("/blog/create").post(isAuthenticated, singleUpload, createBlog);
router.route("/blog/delete/:blogId").delete(isAuthenticated, deleteBlog).put(isAuthenticated, updateBlog);
router.route("/blog/update/:blogId").put(isAuthenticated, updateBlog);
router.route("/blogs").get(getAllBlogs);


module.exports = router;