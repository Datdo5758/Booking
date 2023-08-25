const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Định nghĩa Schema cho Model "Transaction"
const transactionSchema = new Schema({
  user: {
    type: String,
    ref: "User",
    required: true,
  },
  hotel: { type: Schema.Types.ObjectId, ref: "Hotel", required: true }, // Tham chiếu đến Model "Hotel"
  room: [{ type: String, ref: "Room", required: true }], // Danh sách ID phòng đã đặt
  roomId: [{ type: String, ref: "Room", required: true }], // Danh sách ID phòng đã đặt
  dateStart: { type: Date, required: true },
  dateEnd: { type: Date, required: true },
  price: { type: Number, required: true },
  payment: { type: String, enum: ["Credit Card", "Cash"], required: true },
  status: {
    type: String,
    enum: ["Booked", "Checkin", "Checkout"],
    required: true,
  },
});

module.exports = mongoose.model("Transaction", transactionSchema);
