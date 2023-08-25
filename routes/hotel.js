const express = require("express");

const router = express.Router();
const Hotels = require("../controllers/hotel");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/hotels", Hotels.getHotels);

router.get("/toprate", Hotels.getTopRate);
router.get("/search/:city/:people/:numRoom/:date", Hotels.getSearch);
router.get("/detail/:hotelId", Hotels.getDetail);
router.delete("/delete-hotel/:hotelId", Hotels.deleteHotel);
router.post("/add/new-hotel", Hotels.postHotel);
router.post("/edit-hotel", Hotels.postEditHotel);

module.exports = router;
