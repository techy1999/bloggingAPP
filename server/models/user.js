const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

// User Model
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      min: 3,
      max: 10,
      required: [true, "Name is required"],
    },
    password: {
      type: String,
      min: 6,
      required: [true, "password is required"],
      select: false,
    },
    email: {
      type: String,
      required: [true, "email is required"],
    },
    experience: {
      type: Number,
      required: [true, "Enter Experience"],
    },
    social_profile: {
      type: String,
      required: [true, "Enter any social profile"],
    },
  },
  { timestamps: true, createdAt: "created_at", updatedAt: "updated_at" }
);

// Return JSON Web Token [UTIL FOLDER]
userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME,
  });
};

// Pre hook to convert the date to a localized string before saving

// Exporting farmerSchema as Farmer
module.exports = mongoose.model("User", userSchema);
