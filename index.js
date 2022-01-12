const express = require("express");
const mongoose = require("mongoose");
const authRouter = require("./authRouter");

const PORT = process.env.PORT || 5000;
const DB_LINK =
  "mongodb+srv://user:123@cluster0.nm6ws.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const app = express();

app.use(express.json());
app.use("/auth", authRouter);

const start = async () => {
  try {
    await mongoose.connect(DB_LINK);
    app.listen(PORT, () => console.log(`Server works on PORT ${PORT}`));
  } catch (error) {
    console.log(error);
  }
};

start();
