const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const bcrypt = require("bcrypt");

const User = require("../models/user");

router.post("/signup", (req, res, next) => {
    User.find({ email:req.body.email })
    .exec()
    .then(user => {
            if(user.length >= 1){
                return res.status(409).json({
                    message: "Email Already Exists" 
                })
            } else{

                bcrypt.hash(req.body.password, 10, (err, hash) => {
                  if (err) {
                    return res.status(500).json({
                      error: err
                    });
                  } else {
                    const user = new User({
                      _id: new mongoose.Types.ObjectId(),
                      email: req.body.email,
                      password: hash
                    });
                    user
                      .save()
                      .then(result => {
                        console.log(result);
                        res.status(201).json({
                          message: "Created User",
                          createdUser: result
                        });
                      })
                      .catch(err => {
                        console.log(err);
                        res.status(500).json({ error: err });
                      });
                  }
                });
            }
    })
});

router.post('/login', (req,res,next) => {
    User.find({ email: req.body.email})
    .exec()
    .then(user => {
        if(user.length < 1){
            return res.status(401).json({
                message: "Email not Found/ User Doesn't Exist!"
            })
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
            if(err){
                return res.status(401).json({
                    message: "Email not Found/ User Doesn't Exist!"
                })  
            } 
            if(result){
                return res.status(200).json({message: "Authorization Successful!"})
            }
            res.status(401).json({
                message: "Email or Password Incorrect!"
            })
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err})
    })
})

router.delete('/:userId',(req ,res ,next)=>{
    const id = req.params.userId;
    User.remove({_id: id})
    .exec()
    .then(result => {
        res.status(200).json({message: "User Deleted"});
    }).
    catch(err => {
        console.log(err);
        res.status(500).json({error: err})
        
    })
})

module.exports = router;
