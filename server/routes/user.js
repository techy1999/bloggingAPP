const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const createUserController = require("../controllers/user");
// Importing model
const { isAuthenticatedUser } = require("../middleware/auth");

// Login route /blog/ POST -> Create
router.post("/login", createUserController.login);

// Register route /blog/ GET -> To get Blogs
router.post("/register", createUserController.register);

// Profile route /blog/ GET -> To get Blogs
router.get("/profile", isAuthenticatedUser, createUserController.profile);

module.exports = router;
