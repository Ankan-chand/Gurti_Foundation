const Blog = require("../models/Blog");

//exports createBlog function
exports.createBlog = async (req, res) => {
  try {
    //creating a object consisting of title, author,content and image
    const blogData = {
      title: req.body.title,
      author: req.body.author,
      content: req.body.content,
      image: {
        public_id: req.body.public_id,
        url: req.body.url,
      },
    };

    //creating a new blog
    const newBlog = await Blog.create(blogData);

    res.status(200).json({
      success: true,
      message: "Blog created successfully",
      newBlog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//exports deleteBlog function
exports.deleteBlog = async (req, res) => {
  try {
    //find blog using blog id
    const blog = await Blog.findById(req.params.blogId);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    //remove blog
    await Blog.deleteOne({ _id: req.params.blogId });

    res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//exports updateBlog function
exports.updateBlog = async (req, res) => {
  try {
    //find blog using blog id
    const blog = await Blog.findById(req.params.blogId);

    //if not found return
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//exports getAllBlogs function
exports.getAllBlogs = async (req,res) => {
    try {
        //find all blogs in the collection and store as an array
        const blogs = await Blog.find();

        //sending the array of blogs with the response
        res.status(200).json({
            success: true,
            blogs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}


//implement indexing in database

