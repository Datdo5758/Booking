const User = require("../models/user");
const jwt = require("jsonwebtoken");
const secretKey = "mySuperSecretKey123";
const bcrypt = require("bcrypt");

exports.postUser = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    // Kiểm tra xem người dùng đã tồn tại chưa
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: "Người dùng đã tồn tại" });
    }

    const newUser = new User({
      email: email,
      password: password,
    });

    const savedUser = await newUser.save();
    const token = jwt.sign({ userId: savedUser._id }, secretKey, {
      expiresIn: "1h",
    });
    res.status(200).json({ message: "Đăng ký thành công", token: token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// login for user
exports.loginUser = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email: email })
    .then(user => {
      if (password === user.password) {
        // Tạo token hoặc gán thông tin người dùng vào session (tuỳ theo yêu cầu của bạn)
        const token = jwt.sign({ userId: user._id }, secretKey, {
          expiresIn: "1h",
        });
        res.status(200).json({ message: "Đăng ký thành công", token: token });
        next();
      } else {
        res.status(401).json({ message: "Authentication failed" });
      }
    })

    .catch(err => {
      console.log(err);
      res.status(400).json({ message: "Bad request" });
    });
};

// login for admin
exports.loginAdmin = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email: email })
    .then(user => {
      if (user && user.password === password && user.isAdmin === true) {
        // Tạo token hoặc gán thông tin người dùng vào session (tuỳ theo yêu cầu của bạn)
        res.status(200).json({ message: "Đăng nhap thành công" });
      } else {
        res.status(400).json({ message: "Authentication failed" });
      }
    })
    .catch(err => {
      res.status(400).json({ message: "Bad request" });
    });
};
