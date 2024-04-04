var express = require("express");
var router = express.Router();
var productModel = require("../models/product");
const getUserId = require("../middleware/get_userId");
const mongoose = require("mongoose");
const Users = require("../models/user");

router.use(express.json());

/* GET users listing. */
router.get("/", async function (req, res, next) {
  try {
    let products = await productModel.find();
    return res.status(200).send({
      data: products,
      message: "success",
      success: true,
    });
  } catch (error) {
    return res.status(500).send({
      message: "error",
      success: false,
    });
  }
});
router.get("/my-products", getUserId, async function (req, res, next) {
  try {
    const user_id = req.userId;
    let products = await productModel.find({ user_id: user_id });
    return res.status(200).send({
      data: products,
      message: "success",
      success: true,
    });
  } catch (error) {
    return res.status(500).send({
      message: "error",
      success: false,
    });
  }
});


router.get("/:id", async function (req, res, next) {
  try {
    let id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({
        message: "id Invalid",
        success: false,
        error: ["id is not a ObjectId"],
      });
    }
    let products = await productModel.findById(id);
    return res.status(200).send({
      data: products,
      message: "success",
      success: true,
    });
  } catch (error) {
    return res.status(500).send({
      message: "server error",
      success: false,
    });
  }
});

router.post("/", getUserId, async function (req, res, next) {
  try {
    const { prod_name, price, stock } = req.body;
    const user_id = req.userId;

    // Check if user status is "APPROVED"
    const user = await Users.findById(user_id);
    if (user.status !== 'APPROVED') {
      return res.status(401).send({
        message: "User status is not approved. Please wait for admin approval.",
        success: false,
      });
    }

    let newProduct = new productModel({
      prod_name: prod_name,
      price: price,
      stock: stock,
      user_id: user_id,
    });
    let product = await newProduct.save();
    return res.status(201).send({
      data: product,
      message: "Product created successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Error creating product",
      success: false,
    });
  }
});

router.put("/:id", getUserId, async function (req, res, next) {
  try {
    const { prod_name, price, amount } = req.body;
    const user_id = req.userId;

    // Check if user is an ADMIN
    const user = await Users.findById(user_id);
    if (user.role === 'USER') {
      // Check if the product belongs to the user
      const product = await productModel.findById(req.params.id);
      if (product.user_id.toString() !== user_id) {
        return res.status(401).send({
          message: "You are not authorized to edit this product",
          success: false,
        });
      }
    }

    let updatedProduct = await productModel.findByIdAndUpdate(
      req.params.id,
      {
        prod_name: prod_name,
        price: price,
        amount: amount,
        // img:nameImage,
      },
      { new: true }
    );
    return res.status(200).send({
      data: updatedProduct,
      message: "Product updated successfully",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: "Error updating product",
      success: false,
    });
  }
});

router.delete("/:id", getUserId, async function (req, res, next) {
  try {
    const user_id = req.userId;

    // Check if user is an ADMIN
    const user = await Users.findById(user_id);
    if (user.role === 'USER') {
      // Check if the product belongs to the user
      const product = await productModel.findById(req.params.id);
      if (product.user_id.toString() !== user_id) {
        return res.status(401).send({
          message: "You are not authorized to delete this product",
          success: false,
        });
      }
    }

    let deletedProduct = await productModel.findByIdAndDelete(req.params.id);
    return res.status(200).send({
      data: deletedProduct,
      message: "Product deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: "Error deleting product",
      success: false,
    });
  }
});


module.exports = router;
