const mongoose = require("mongoose");

// const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;

// Định nghĩa Schema cho Model "User"
const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // username: { type: String, unique: true, sparse: true },
  // fullName: { type: String },
  // phoneNumber: { type: Number },
  isAdmin: { type: Boolean, default: false },
});

// Hàm so sánh mật khẩu
// userSchema.methods.comparePassword = function (password) {
//   return this.password === password;
// };

module.exports = mongoose.model("User", userSchema);
