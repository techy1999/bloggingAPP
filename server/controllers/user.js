// Importing model
const User = require("../models/user");
const sendToken = require("../utils/jwtToken");
const bcrypt = require("bcryptjs");

const Joi = require("joi");

const registerSchema = Joi.object({
  name: Joi.string().min(3).required().messages({
    "string.name": "name must be at least 3 characters long",
    "any.required": "name is required",
  }),
  email: Joi.string().min(3).required().email().messages({
    "string.email": "email must be at least 3 characters long",
    "any.required": "email is required",
  }),

  password: Joi.string().min(6).required().messages({
    "string.password": "password must be at least 6 characters long",
    "any.required": "password is required",
  }),
  experience: Joi.number(),
  social_profile: Joi.string().min(3).required().messages({
    "string.social_profile":
      "social_profile must be at least 3 characters long",
    "any.required": "social_profile is required",
  }),
});

exports.register = async (req, res, next) => {
  // Validate req.body using the registerSchema
  const { error, value } = registerSchema.validate(req.body, {
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
    !req.body.name ||
    !req.body.email ||
    !req.body.password ||
    !req.body.experience ||
    !req.body.social_profile
  ) {
    return res.status(400).json({
      success: false,
      message: "field is empty",
    });
  }

  try {
    const userExist = await User.findOne({ email: req.body.email });

    if (!userExist) {
      // Generate a salt
      const salt = await bcrypt.genSalt(10);

      // Hash password
      const hashPassword = await bcrypt.hash(req.body.password, salt);

      const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword,
        experience: req.body.experience,
        social_profile: req.body.social_profile,
      });
      return res.status(201).json({
        success: true,
        message: "User created successfully",
        data: user,
      });
    } else {
      return res.status(201).json({
        success: false,
        message: "Email already exists",
      });
    }
  } catch (error) {
    console.log("error", error);
    return res.status(400).json({
      success: false,
      meesage: `Created failed`,
    });
  }
};

exports.login = async (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({
      success: false,
      message: "field is empty",
    });
  }

  try {
    const user = await User.findOne({ email: req.body.email }).select(
      "+password"
    );

    if (user) {
      //check for pasword
      const hashPasswordCheck = await bcrypt.compare(
        req.body.password,
        user.password
      );

      console.log("hashPasswordCheck ", hashPasswordCheck);

      if (hashPasswordCheck) {
        sendToken(user, res);
        // return res.status(200).json({
        //   success: true,
        //   message: "Login Successful",
        //   data:
        // });
      } else {
        return res.status(200).json({
          success: false,
          message: "User password do not match",
        });
      }
    } else {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: `failed operation ${error}`,
    });
  }
};

exports.profile = async (req, res, next) => {
  const userId = req.user._id;

  try {
    const userProfile = await User.findOne({ _id: userId });

    console.log("userProfile : ", userProfile);
    if (userProfile) {
      return res.status(200).json({
        success: true,
        data: {
          ...userProfile._doc,
          createdAt: userProfile.createdAt.toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
          }),
          updatedAt: userProfile.updatedAt.toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
          }),
        },
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "operation failed",
    });
  }
};
