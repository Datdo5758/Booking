const Transaction = require("../models/transaction");
const Room = require("../models/room");

// create 1 transaction
exports.postTransaction = (req, res, next) => {
  const user = req.body.user;

  const hotel = req.body.hotel;
  const room = req.body.roomNumbers;
  const roomId = req.body.roomIds;
  const dateStart = new Date(req.body.dateStart);
  const dateEnd = new Date(req.body.dateEnd);
  const price = req.body.price;
  const payment = req.body.payMethod;
  const status = "Booked";
  const transaction = new Transaction({
    user: user,
    hotel: hotel,
    room: room,
    roomId: roomId,
    dateStart: dateStart,
    dateEnd: dateEnd,
    price: price,
    payment: payment,
    status: status,
  });
  transaction
    .save()
    .then(result => {
      console.log("created a transaction");
      res.redirect("/add/transaction");
    })
    .catch(err => console.log(err));
};

// get all transaction for a user
exports.getTransactionUser = (req, res, next) => {
  const user = req.params.user;

  Transaction.find({ user: user })
    .populate("hotel")
    .then(item => {
      res.json(item);
    })
    .catch(err => console.log(err));
};

exports.getTransaction = (req, res, next) => {
  Transaction.find()
    .then(item => {
      res.json(item);
    })
    .catch(err => console.log(err));
};

// room
exports.getRooms = (req, res, next) => {
  Room.find()

    .then(items => res.status(200).json(items))
    .catch(err => console.log(err));
};
// delete 1 room
exports.deleteRoom = async (req, res, next) => {
  const roomId = req.params.roomId;

  try {
    const items = await Transaction.find({ roomId: { $in: roomId } });
    // nếu phòng này không có trong transaction thì xoá
    if (items.length === 0) {
      await Room.findByIdAndRemove(roomId);
      res.status(200).json({ message: "delete success" });
    } else {
      res.status(400).json({ message: "đang có giao dịch" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "internal server error" });
  }
};

// create 1  new room
exports.postRoom = async (req, res, next) => {
  try {
    const desc = req.body.desc;
    const rooms = req.body.rooms;
    const title = req.body.title;
    const maxPeople = req.body.maxPeople;
    const price = req.body.price;
    const updatedAt = new Date();
    const createdAt = new Date();

    const room = new Room({
      desc: desc,
      maxPeople: maxPeople,
      title: title,
      roomNumbers: rooms,
      price: price,
      updatedAt: updatedAt,
      createdAt: createdAt,
    });

    await room.save();
    res.status(200).json({ message: "success" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "error" });
  }
};

exports.getARoom = (req, res, next) => {
  const roomId = req.params.roomId;
  Room.findById(roomId).then(item => res.json(item));
};

// edit 1 room
exports.postEditRoom = async (req, res, next) => {
  try {
    const roomId = req.body._id;
    const { desc, roomNumbers, maxPeople, price, title } = req.body;

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "room not found" });
    }

    room.desc = desc;

    room.roomNumbers = roomNumbers;
    room.maxPeople = maxPeople;
    room.title = title;
    room.price = price;

    await room.save();

    console.log("UPDATED!");
    res.status(200).json({ message: "Room updated successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "An error occurred" });
  }
};
