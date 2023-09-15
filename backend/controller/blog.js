const ErrorHandler = require("../utils/ErrorHandler");
const { catchAsyncError } = require("../middlewares/catchAsyncError");
const Blog = require("../models/Blog");
const getDataUri = require("../utils/dataUri");
const cloudinary = require("cloudinary");

//exports createBlog function
exports.createBlog = catchAsyncError(async (req, res, next) => {

  const {title, author, content} = req.body;
  const file = req.file;

  if(!title || !author || !content){
    return next(new ErrorHandler("Please fill all fields", 400));
  }
  
  
  //creating a object consisting of title, author,content and image
  const blogData = {
    title : title,
    author : author,
    content : content,
  };

  if(file){
    const fileuri = getDataUri(file);
    const myCloud = await cloudinary.v2.uploader.upload(fileuri.content);
    blogData["image"] = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url
    }
  }


  //creating a new blog
  await Blog.create(blogData);

  res.status(200).json({
    success: true,
    message: "Blog created successfully",
  });
});

//exports deleteBlog function
exports.deleteBlog = catchAsyncError(async (req, res, next) => {
    //find blog using blog id
    const blog = await Blog.findById(req.params.blogId);

    if (!blog) {
      return next(new ErrorHandler("Blog not found", 404));
    }

    //remove blog
    await Blog.deleteOne({ _id: req.params.blogId });

    res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
 
});

//exports updateBlog function
exports.updateBlog = catchAsyncError(async (req, res, next) => {
    //find blog using blog id
    const blog = await Blog.findById(req.params.blogId);

    //if not found return
    if (!blog) {
      return next(new ErrorHandler("Blog not found", 404));
    }

    //extracting title, author, content form requrest body
    const { title, content, author } = req.body;

    if (title) {
      blog.title = title;
    }

    if (content) {
      blog.content = content;
    }

    if (author) {
      blog.author = author;
    }

    await blog.save();

    res.status(200).json({
      success: true,
      message: "Blog updated successfully",
    });

});

//exports getAllBlogs function
exports.getAllBlogs = catchAsyncError(async (req, res, next) => {
    //find all blogs in the collection and store as an array
    const blogs = await Blog.find();

    //sending the array of blogs with the response
    res.status(200).json({
      success: true,
      blogs,
    });

});


//implement indexing in database
