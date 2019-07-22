const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const api = require("../serv/api/v1/index");
const connection = mongoose.connection;
app.set("port", process.env.port || 3000);

app.use(cors());
app.use("/api/v1", api);
app.use((req, res) => {
  const err = new Error("404 - Not Found");
  err.status = 404;
  res.json({ msg: "404 | not found", err: err });
});

mongoose.connect("mongodb://localhost:27017/expressangul", {
  useNewUrlParser: true
});
connection.on("error", err => {
  console.error(`connection to mongodb error ${err.message}`);
});

connection.once("open", () => {
  console.log("connected to mongoDB");
  app.listen(app.get("port"), () => {
    console.log(`express listening port ${app.get("port")}`);
  });
});
