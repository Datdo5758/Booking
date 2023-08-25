const express = require("express");

const transactionController = require("../controllers/transaction");

const router = express.Router();
router.post("/add/transaction", transactionController.postTransaction);
router.get("/transaction/:user", transactionController.getTransactionUser);
router.get("/transaction", transactionController.getTransaction);
router.get("/rooms", transactionController.getRooms);
router.get("/room/:roomId", transactionController.getARoom);
router.delete("/delete-room/:roomId", transactionController.deleteRoom);
router.post("/edit-room", transactionController.postEditRoom);
router.post("/add/new-room", transactionController.postRoom);
module.exports = router;
