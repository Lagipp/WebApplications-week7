var express = require('express');
var router = express.Router();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("../models/User");
// const jwt = require("jsonwebtoken");
// const validationToken = require ("../auth/validateToken.js");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET users' register page. */
router.get('/api/user/register', function(req, res, next) {
  res.render('register');
});


router.post('/api/user/register/', 
  body("email").isLength({min: 5}).trim(),
  body("password").isLength({min: 5}),
  (req, res, next) => {

    User.findOne({email: req.body.email}, (err, user) => {
      if(err) {
        console.log(err);
        throw err
      };

      if(user){
        return res.status(403).json({email: "Email already in use"});
      } else {
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(req.body.password, salt, (err, hash) => {
            if(err) throw err;
            User.create(
              {
                email: req.body.email,
                password: hash
              },
              (err, ok) => {
                if(err) throw err;
                return res.redirect("api/user/login");
              }
            );
          });
        });
      }
    });
    
  });

/*
router.post('/api/user/register', function(req, res, next) {
  //res.render('register');
  //res.send("ok")
  console.log(req.body.email)
  next();

});
*/


module.exports = router;
