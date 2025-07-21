const mongoose = require("mongoose");

const devUserSchema = new mongoose.Schema(
  {
    fullName: String,
    email: String,
    mobile: String,
    skill: String,
    password: String,
    confirmPassword: String,
    image: String, // optional: for profile image
  },
  { timestamps: true } // ✅ this enables createdAt and updatedAt
);

module.exports = mongoose.model("DevUser", devUserSchema);
