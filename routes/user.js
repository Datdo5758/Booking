const express = require("express");

const router = express.Router();
const userController = require("../controllers/user");

router.post("/user/register", userController.postUser);
router.post("/user/login", userController.loginUser);
router.post("/admin/login", userController.loginAdmin);

module.exports = router;
