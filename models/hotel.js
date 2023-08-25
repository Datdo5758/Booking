const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Định nghĩa Schema cho Model "Hotel"
const hotelSchema = new Schema({
  name: { type: String, required: true },
  type: {
    type: String,
    required: true,
  },
  city: { type: String, required: true },
  address: { type: String, required: true },
  distance: { type: Number, required: true },
  photos: [{ type: String, required: true }], // Danh sách các link ảnh, mỗi link là một chuỗi
  desc: { type: String, required: true },
  cheapestPrice: { type: Number, required: true },
  title: { type: String, required: true },
  rating: { type: Number, min: 0, max: 5, required: true },
  featured: { type: Boolean, default: false, required: true },
  rooms: [{ type: String, ref: "Room", required: true }], // Danh sách các ID phòng
});

module.exports = mongoose.model("Hotel", hotelSchema);
