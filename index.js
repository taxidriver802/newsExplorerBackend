const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const { PORT = 3001 } = process.env;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/", require("./routes/index.js"));

mongoose.set("strictQuery", true);

mongoose
  .connect("mongodb://localhost:27017/finalproject")
  .then(() => {
    console.log("Connected to DB"); // eslint-disable-line no-console
  })
  .catch((err) => {
    console.error("Error connecting to DB", err); // eslint-disable-line no-console
  });

app.listen(PORT, () => {
  console.log(`PORT environment variable: ${process.env.PORT}`); // eslint-disable-line no-console
  console.log(`Server is running on port ${PORT}`); // eslint-disable-line no-console
});
