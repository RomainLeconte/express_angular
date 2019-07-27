const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const api = require("../serv/api/v1/index");
const bodyParser = require("body-parser");
const connection = mongoose.connection;
app.set("port", process.env.port || 3000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

const uplaodsDir = require("path").join(__dirname, "/uploads");
console.log("uplaodsDir ", uplaodsDir);
app.use(express.static(uplaodsDir));

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
