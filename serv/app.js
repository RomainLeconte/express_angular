const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const api = require("../serv/api/v1/index");
const auth = require("./auth/routes/index");
const bodyParser = require("body-parser");
const connection = mongoose.connection;

app.set("port", process.env.port || 3000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({credentials: true, origin: 'http://localhost:4200'}));

//passport
const passport = require("passport");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const Strategy = require("passport-local").Strategy;
const User = require("./auth/models/user");

app.use(cookieParser());
app.use(
  session({
    secret: "yesIKnowMySecretIsTheBestSecretForSureTrustMeBoy",
    resave: true,
    saveUninitialized: true,
    name: "auth"
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, callback) => {
  callback(null, user);
});

passport.deserializeUser((user, callback) => {
  callback(null, user);
});

passport.use(
  new Strategy(
    {
      usernameField: "username",
      passwordField: "password"
    },
    (name, password, callback) => {
      User.findOne({ username: name }, (err, user) => {
        console.log('user ???? ', user);
        if (err) {
          console.log("user not found ", name, err.message);
          callback(null, false, { message: "user not found" });
        }
        if (user.password !== password) {
          console.log("wrong password for => ", user);
          callback(null, false, { message: `wrong password. ${user.password} != ${password}` });
        } else {
          console.log(name, " found user => ", user);
          callback(null, user);
        }
      });
    }
  )
);

//upload
const uplaodsDir = require("path").join(__dirname, "/uploads");
console.log("uplaodsDir ", uplaodsDir);
app.use(express.static(uplaodsDir));

app.use("/api/v1", api);
app.use("/auth", auth);

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
