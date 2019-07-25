const express = require("express");
const router = express.Router();
const Blogpost = require("../models/blogpost");
const mongoose = require("mongoose");

router.get("/ping", (req, res) => {
  res.status(200).json({ msg: "pong", date: new Date() });
});

router.get("/blog-posts", (req, res) => {
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

router.post("/blog-posts", (req, res) => {
  console.log("req.body", req.body);
  const blogPost = new Blogpost(req.body);
  blogPost.save((err, blogPost) => {
    if (err) {
      return res.status(500).json(err);
    }
    res.status(201).json(blogPost);
  });
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

router.delete("/blog-posts/:id", (req, res) => {
  const id = req.params.id;
  Blogpost.findByIdAndDelete(id, (err, blogPost) => {
    if (err) {
      return res.status(500).json(err);
    }
    res.status(202).json({ msg: `post ${blogPost._id} deleted success` });
  });
});

router.delete("/blog-posts", (req, res) => {
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

module.exports = router;
