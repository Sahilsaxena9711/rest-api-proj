const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const User = require("../models/user");

router.post("/signup", (res, req, next) => {
  const user = new User({
    _id: new mongoose.Types.ObjectId(),
    email: req.body.email,
    password: req.body.password
  });
  user
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "User created",
        cretedUser: result
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router;
