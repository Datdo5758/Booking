const path = require("path");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
require("dotenv").config();

const hotelRouters = require("./routes/hotel");
const userRouters = require("./routes/user");
const transactionRouters = require("./routes/transaction");

// Sử dụng cổng mà bạn đã định nghĩa trong tệp .env
const port = process.env.PORT || 8000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(cors());
app.use(express.json());

app.use(userRouters);
app.use(hotelRouters);
app.use(transactionRouters);

const databaseURL = process.env.DATABASE_URL;

mongoose
  .connect(databaseURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch(err => console.error("Error connecting to MongoDB:", err.message));
