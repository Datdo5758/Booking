// authMiddleware.js

const jwt = require("jsonwebtoken");
const User = require("../models/user");

module.exports = (req, res, next) => {
  const token = req.header("x-auth-token"); // Assume token is sent in the header
  console.log(token);
  if (!token) {
    return res.status(401).json({ message: "Chưa xác thực" });
  }

  try {
    const decodedToken = jwt.verify(token, "mySuperSecretKey123");
    const userId = decodedToken.userId;

    User.findById(userId)
      .then(user => {
        if (!user) {
          return res.status(401).json({ message: "Người dùng không tồn tại" });
        }

        req.user = user; // Gán thông tin người dùng vào req.user
        next();
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ message: "Lỗi server" });
      });
  } catch (err) {
    console.log(err);
    res.status(401).json({ message: "Token không hợp lệ" });
  }
};
