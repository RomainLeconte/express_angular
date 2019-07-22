const express = require("express");
const cors = require("cors");
const app = express();
const api = require("../serv/api/v1/index");

app.set("port", process.env.port || 3000);

app.use(cors());
app.use("/api/v1", api);

app.listen(app.get("port"), () => {
  console.log(`express listening port ${app.get("port")}`);
});
