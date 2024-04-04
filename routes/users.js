var express = require('express');
var router = express.Router();
const Users = require("../models/user");
const bcrypt = require("bcrypt");
const verfyToken = require('../middleware/jwt_decode')
const verifyAdmin = require("../middleware/verifyAdmin");
const getUserId = require("../middleware/get_userId");


/* GET users listing. */
router.get("/",verifyAdmin,async function (req, res, next) {
  try {
    const users = await Users.find();
    return res.status(200).send({
      data: users,
      message:'success',
      success: true,
    })
  } catch (error) {
    return res.status(500).send({
      message:'fail',
      success: false,
    })
  }
});

router.post("/", async function (req, res, next) {
  try {
    // let nameImage = "rambo.jpg"
    // if(req.file){
    //   nameImage = req.file.filename
    // }
    let { password, username, firstName, lastName, email } = req.body;
    let hashPassword = await bcrypt.hash(password, 10);
    const newUser = new Users({
      password: hashPassword,
      username,
      firstName,
      // profile_img:nameImage,
      lastName,
      email,
    });
    const user = await newUser.save();
    return res.status(200).send({
      data:{_id: user._id, username, firstName, lastName, email},
      message:'craete success ✅',
      success: true,
    })
  } catch (error) {
    return res.status(500).send({
      message:'Already Have Account !',
      success: false,
    })
  }
});

router.put("/:id", getUserId, async function (req, res, next) {
  try {
    const { username, firstName, lastName, email, status,role } = req.body;
    const user_id = req.userId;

    // Check if the user is an admin
    const user = await Users.findById(user_id);
    if (user.role === 'ADMIN') {
      // Admin can update any user's role
      let updatedUser = await Users.findByIdAndUpdate(
        req.params.id,
        {
          username,
          firstName,
          lastName,
          email,
          status,
          role
        },
        { new: true }
      );
      return res.status(200).send({
        data: updatedUser,
        message: "User updated successfully",
        success: true,
      });
    } else {
      // Normal user can only update their own data
      if (req.params.id !== user_id) {
        return res.status(403).send({
          message: "You are not authorized to update this user",
          success: false,
        });
      }

      let updatedUser = await Users.findByIdAndUpdate(
        user_id,
        {
          username,
          firstName,
          lastName,
          email,
        },
        { new: true }
      );
      return res.status(200).send({
        data: updatedUser,
        message: "User updated successfully",
        success: true,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: "Error updating user",
      success: false,
    });
  }
});


router.get("/:id", async function (req, res, next) {
  try {
    const user = await Users.findById(req.params.id);
    if (!user) {
      return res.status(404).send({
        message: "User not found",
        success: false,
      });
    }
    return res.status(200).send({
      data: user,
      message: "User found",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: "Error fetching user",
      success: false,
    });
  }
});


router.delete("/:id", async function (req, res, next) {
  try {
    let user = await Users.findByIdAndDelete(req.params.id);
    return res.status(200).send({
      data: user,
      message: "User deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: "Error deleting user",
      success: false,
    });
  }
});


module.exports = router;
