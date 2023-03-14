// Importing model
const Blog = require("../models/blog");

const Joi = require("joi");

const blogSchema = Joi.object({
  title: Joi.string().min(3).required().messages({
    "string.title": "title must be at least 3 characters long",
    "any.required": "title is required",
  }),
  content: Joi.string().min(5).required().messages({
    "string.content": "content must be at least 5 characters long",
    "any.required": "content is required",
  }),
  image_url: Joi.string().min(6).required().messages({
    "string.image_url": "image_url must be at least 6 characters long",
    "any.required": "image_url is required",
  }),
  video_url: Joi.string().min(3).required().messages({
    "string.vide_url": "vide_url must be at least 3 characters long",
    "any.required": "vide_url is required",
  }),
});

exports.createBlog = async (req, res, next) => {
  // Validate req.body using the registerSchema
  const { error, value } = blogSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    const errors = {};
    error.details.forEach((err) => {
      errors[err.path[0]] = err.message;
    });
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: errors,
    });
  }

  //Checking req.body is empty
  if (
    !req.body.title ||
    !req.body.content ||
    !req.body.image_url ||
    !req.body.video_url
  ) {
    return res.status(400).json({
      success: false,
      message: "field is empty",
    });
  }

  try {
    const blog = await Blog.create({ ...req.body, author: req.user.id });
    return res.status(201).json({
      success: true,
      message: "Created successfully",
      data: blog,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      meesage: `Created failed ${error}`,
    });
  }
};

exports.updateBlog = async (req, res, next) => {
  const userLogged = req.user;
  const blogId = req.params.id;
  //Checking req.body is empty

  try {
    // Find blog first...
    const blog = await Blog.findOne({ _id: blogId, author: userLogged.id });

    if (blog) {
      const result = await Blog.updateOne(
        { _id: blogId, author: userLogged._id },
        {
          title: req.body.title,
          content: req.body.content,
        }
      );

      return res.status(200).json({
        success: true,
        meesage: `update successful`,
      });
    } else {
      return res.status(404).json({
        success: false,
        meesage: `Blog not found`,
      });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      meesage: `failed operation ${error}`,
    });
  }
};

exports.deleteBlog = async (req, res, next) => {
  const userLogged = req.user;
  const blogId = req.params.id;
  //Checking req.body is empty

  try {
    // Find blog first...
    const blog = await Blog.findOne({ _id: blogId, author: userLogged.id });

    if (blog) {
      await Blog.deleteOne({ _id: blogId });
      return res.status(200).json({
        success: true,
        meesage: `delete successful`,
      });
    } else {
      return res.status(404).json({
        success: false,
        meesage: `Blog not found`,
      });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      meesage: `failed operation ${error}`,
    });
  }
};

// Get all blog
// exports.getAllBlog = async (req, res, next) => {
//   try {
//     const blogs = await Blog.find();
//     console.log("123", blogs);
//     res.status(200).json({
//       success: true,
//       data: blogs.map((blog) => ({
//         ...blog._doc,
//         createdAt: blog.createdAt.toLocaleString("en-IN", {
//           timeZone: "Asia/Kolkata",
//         }),
//         updatedAt: blog.updatedAt.toLocaleString("en-IN", {
//           timeZone: "Asia/Kolkata",
//         }),
//       })),
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       meesage: "fetch failed",
//     });
//   }
// };

// Get all blog 2
exports.getAllBlog = async (req, res, next) => {
  try {
    const blogs = await Blog.find().populate("author", "name email");
    console.log("123", blogs);
    res.status(200).json({
      success: true,
      data: blogs.map((blog) => ({
        ...blog._doc,
        createdAt: blog.createdAt.toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
        }),
        updatedAt: blog.updatedAt.toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
        }),
        author: {
          name: blog.author.name,
          email: blog.author.email,
        },
      })),
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      meesage: "fetch failed",
    });
  }
};

// Get all the blog of logged in user
exports.getUserBlog = async (req, res, next) => {
  try {
    // Get all the Blogs of the loggedIn user
    const userLoggedBlogs = await Blog.find({ author: req.user.id });
    return res.status(200).json({
      success: true,
      data: userLoggedBlogs.map((userLoggedBlog) => ({
        ...userLoggedBlog._doc,
        createdAt: userLoggedBlog.createdAt.toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
        }),
        updatedAt: userLoggedBlog.updatedAt.toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
        }),
      })),
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: `failed operation ${error}`,
    });
  }
};
