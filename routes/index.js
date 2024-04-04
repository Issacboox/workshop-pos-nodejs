var express = require('express');
var router = express.Router();
const Users = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post("/login", async function (req, res, next) {
  try {
    let { username, password } = req.body;
    let user = await Users.findOne({ username: username });
    if (!user) {
      return res.status(500).send({
        message: "User not found",
        success: false,
      });
    }
    const checkPassword = bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return res.status(500).send({
        message: "Wrong password",
        success: false,
      });
    }
    const { _id, firstName, lastName, email } = user;
    const token = jwt.sign({ _id, firstName, lastName, email }, process.env.JWT_KEY)

    return res.status(201).send({
      data:{ _id, firstName, lastName, email, token},
      message: "Login Success",
      success: true,
    });
  } catch (error) {
    return res.status(500).send({
      message: 'unauthorization',
      success: false,
    })
  }
});


module.exports = router;
