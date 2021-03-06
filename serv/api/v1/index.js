const express = require("express");
const router = express.Router();
const Blogpost = require("../models/blogpost");
const mongoose = require("mongoose");
const multer = require("multer");
const crypto = require("crypto");
const path = require("path");

const resize = require("../../utils/resize");

router.get("/ping", (req, res) => {
  res.status(200).json({ msg: "pong", date: new Date() });
});

router.get("/blog-posts", (req, res) => {
  console.log("req.user => ", req.user);
  Blogpost.find()
    .sort({ createdOn: -1 })
    .exec()
    .then(blogPost => res.status(200).json(blogPost))
    .catch(err =>
      res.status(500).json({
        message: "post not found",
        error: err.message
      })
    );
});

router.get("/blog-posts/:id", (req, res) => {
  const id = req.params.id;
  Blogpost.findById(id)
    .then(blogPost => res.status(200).json(blogPost))
    .catch(err => {
      res.status(500).json({
        message: `post with id ${id} not found`,
        error: err.message
      });
    });
});

router.post("/blog-posts", (req, res) => {
  console.log("req.body", req.body);
  //const blogPost = new Blogpost(req.body);
  //const blogPost = new Blogpost({ ...req.body, image: uploadImageName });
  const smallImagePath = `./uploads/${uploadImageName}`;
  const outputName = `./uploads/small-${uploadImageName}`;
  resize({
    path: smallImagePath,
    width: 200,
    height: 200,
    outputName: outputName
  })
    .then(data => {
      console.log("resize ", data.size);
    })
    .catch(err => console.log("err resize=> ", err));

  const blogPost = new Blogpost({
    ...req.body,
    image: uploadImageName,
    smallImage: `small-${uploadImageName}`
  });
  blogPost.save((err, blogPost) => {
    if (err) {
      return res.status(500).json(err);
    }
    res.status(201).json(blogPost);
  });
});

router.delete("/blog-posts/:id", (req, res) => {
  if (!req.isAuthenticated()) {
    return res
      .status(401)
      .json({ result: "ko", msg: "not authorized to delete a post" });
  }
  const id = req.params.id;
  Blogpost.findByIdAndDelete(id, (err, blogPost) => {
    if (err) {
      return res.status(500).json(err);
    }
    res.status(202).json({ msg: `post ${blogPost._id} deleted success` });
  });
});

router.delete("/blog-posts", (req, res) => {
  if (!req.isAuthenticated()) {
    return res
      .status(401)
      .json({ result: "ko", msg: "not authorized to delete a post" });
  }
  const ids = req.query.ids;
  console.log(ids);
  const allIds = ids.split(",").map(id => {
    if (id.match(/^[0-9a-zA-Z]{24}$/)) {
      return mongoose.Types.ObjectId(id);
    } else {
      console.log("id invalide ", id);
    }
  });
  const condition = { _id: { $in: allIds } };
  Blogpost.deleteMany(condition, (err, result) => {
    if (err) {
      return res.status(500).json(err.message);
    }
    res.status(202).json(result);
  });
});

let uploadImageName = "";

//upload
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: function(req, file, callback) {
    crypto.pseudoRandomBytes(16, function(err, raw) {
      if (err) {
        return callback(err);
      }
      // callback(null, raw.toString("hex") + path.extname(file.originalname));
      uploadImageName = raw.toString("hex") + path.extname(file.originalname);
      console.log(uploadImageName);
      callback(null, uploadImageName);
    });
  }
});

const upload = multer({ storage: storage, limits: { fileSize: 100000 } });

//file uploaded
router.post("/blog-posts/images", upload.single("image"), (req, res) => {
  if (!req.file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return res.status(400).json({ msg: "only images file authorized" });
  }
  res.status(201).send({ filename: req.file.filename, file: req.file });
});

router.put("/blog-posts/:id", upload.single("image"), (req, res) => {
  const id = req.params.id;
  const conditions = { _id: id };
  const post = { ...req.body, image: uploadImageName };
  const update = { $set: post };
  const options = {
    upsert: true,
    new: true
  };
  Blogpost.findOneAndUpdate(conditions, update, options, (err, response) => {
    if (err) return res.status(500).json({ msg: "update failed", error: err });
    res
      .status(200)
      .json({ msg: `document with id ${id} updated`, response: response });
  });
});

module.exports = router;
