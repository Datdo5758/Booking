const Hotel = require("../models/hotel");
const Room = require("../models/room");
const Transaction = require("../models/transaction");

// hotel
exports.getHotels = (req, res, next) => {
  Hotel.find()

    .then(items => res.status(200).json(items))
    .catch(err => console.log(err));
};

exports.getTopRate = (req, res, next) => {
  Hotel.find()
    // Use arrow function and add closing parenthesis for sort()
    .then(items => items.sort((a, b) => b.rating - a.rating))
    .then(items => res.status(200).json(items.slice(0, 3)))
    .catch(err => console.log(err));
};

exports.getSearch = (req, res, next) => {
  const city = req.params.city;
  const people = parseInt(req.params.people); // Chuyển đổi thành số nguyên
  const numRoom = parseInt(req.params.numRoom);
  const date = new Date(req.params.date);

  Room.find({ maxPeople: { $gte: people }, updatedAt: { $lte: date } })

    .then(rooms => {
      const roomIds = rooms.map(room => room._id.toString());

      // Lấy thông tin khách sạn dựa trên các id phòng và thành phố
      return (
        Hotel.find({ rooms: { $in: roomIds } })
          .populate({
            path: "rooms",
            match: { maxPeople: { $gte: people } }, // Lọc phòng dựa trên số người tối thiểu
          })
          // loc phong theo city
          .then(items =>
            items.filter(
              item => item.city.toLowerCase().replace(/\s/g, "") === city
            )
          )
          .then(items => items.filter(item => item.rooms.length >= numRoom))
          .then(hotels => {
            res.json(hotels); // Trả về thông tin khách sạn cho client
          })
      );
    })
    .catch(err => console.log(err));
};

exports.getDetail = (req, res, next) => {
  const hotelId = req.params.hotelId;
  Hotel.findById(hotelId).then(item => res.json(item));
};

exports.deleteHotel = (req, res, next) => {
  const hotelId = req.params.hotelId;

  // Kiểm tra nếu có giao dịch liên quan đến khách sạn
  Transaction.findOne({ hotel: hotelId }).then(transaction => {
    if (transaction) {
      res.status(400).json({ message: "Khách sạn đang có giao dịch" });
    } else {
      // Nếu không có giao dịch, tiến hành xoá khách sạn
      Hotel.findByIdAndRemove(hotelId)
        .then(deletedHotel => {
          if (!deletedHotel) {
            return res
              .status(404)
              .json({ message: "Không tìm thấy khách sạn" });
          }

          return res.status(200).json({ message: "Xoá thành công" });
        })
        .catch(error => {
          console.error(error);
          res.status(500).json({ message: "Đã xảy ra lỗi" });
        });
    }
  });
};

// create 1 new hotel
exports.postHotel = async (req, res, next) => {
  try {
    const address = req.body.address;
    const cheapestPrice = req.body.price;
    const city = req.body.city;
    const desc = req.body.desc;
    const distance = req.body.distance;
    const featured = req.body.featured;
    const name = req.body.name;
    const photos = req.body.photos;

    const rooms = await Room.find({ title: { $in: req.body.rooms } }).then(
      items => items.map(item => item._id)
    );

    console.log(rooms);

    const title = req.body.title;
    const type = req.body.type;
    const rating = req.body.rating;

    const hotel = new Hotel({
      address: address,
      cheapestPrice: cheapestPrice,
      city: city,
      desc: desc,
      distance: distance,
      featured: featured,
      name: name,
      photos: photos,
      rooms: rooms,
      title: title,
      type: type,
      rating: rating,
    });

    await hotel.save();
    res.status(200).json({ message: "success" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "error" });
  }
};

// edit
exports.postEditHotel = async (req, res, next) => {
  try {
    const hotelId = req.body._id;
    const {
      address,
      cheapestPrice,
      city,
      desc,
      distance,
      featured,
      name,
      photos,
      rooms,
      title,
      type,
    } = req.body;

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    hotel.address = address;
    hotel.cheapestPrice = cheapestPrice;
    hotel.city = city;
    hotel.desc = desc;
    hotel.distance = distance;
    hotel.featured = featured;
    hotel.name = name;
    hotel.photos = photos;
    hotel.rooms = rooms;
    hotel.title = title;
    hotel.type = type;

    await hotel.save();

    console.log("UPDATED!");
    res.status(200).json({ message: "Hotel updated successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "An error occurred" });
  }
};
