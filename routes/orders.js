var express = require("express");
var router = express.Router();
var ordersSchema = require("../models/order");
const getUserId = require("../middleware/get_userId");
const mongoose = require("mongoose");
const Users = require("../models/user");
var productModel = require("../models/product");


//api get all Order
router.get("/", async function (req, res, next) {
    try {
      const orders = await ordersSchema.find();
      return res.status(200).send({
        data: orders,
        message: "success",
        success: true,
      });
    } catch (error) {
      return res.status(500).send({
        message: "fail",
        success: false,
      });
    }
  });
  

//api post Order by ref with product one order choose 1 product and amount order shouldn't be more than stock of product and not negative number after order stock oof product should decrease and only user that login can order product also status is APPROVED 
const randomReceiptNumber = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    let receiptNumber = '';
    for (let i = 0; i < 3; i++) {
      receiptNumber += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    for (let i = 0; i < 3; i++) {
      receiptNumber += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
    return receiptNumber;
  };
  
  router.post("/", getUserId, async function (req, res, next) {
    try {
      const { product_id, quantity } = req.body;
      const user_id = req.userId;
  
      // Check if user is approved
      const user = await Users.findById(user_id);
      if (user.status !== 'APPROVED') {
        return res.status(401).send({
          message: "User status is not approved. Please wait for admin approval.",
          success: false,
        });
      }
  
      // Check if product exists and has enough stock
      const product = await productModel.findById(product_id);
      if (!product || product.stock <= 0) {
        return res.status(400).send({
          message: "Out of Stock.",
          success: false,
        });
      }
  
      // Check if there are existing orders for the product
      const existingOrders = await ordersSchema.find({ product_id: product_id });
      const orderedQuantity = existingOrders.reduce((total, order) => total + order.quantity, 0);
  
      if (product.stock - orderedQuantity < quantity) {
        return res.status(400).send({
          message: "Not enough stock.",
          success: false,
        });
      }
  
      // Create order with random receipt number
      const order = new ordersSchema({
        user_id: user_id,
        product_id: product_id,
        quantity: quantity,
        total: typeof product.price === 'number' && typeof quantity === 'number' ? product.price * quantity : 0,
        receipt_number: randomReceiptNumber(),
      });
      await order.save();
  
      // Update product stock
      product.stock -= quantity;
      await product.save();
  
      return res.status(201).send({
        data: order,
        message: "Order placed successfully",
        success: true,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send({
        message: "Error placing order",
        success: false,
      });
    }
  });

// Get orders for a specific product
router.get("/product-orders/:product_id", async function (req, res, next) {
  try {
      const { product_id } = req.params;
      const orders = await ordersSchema.find({ product_id: product_id });

      return res.status(200).send({
          data: orders,
          message: "success",
          success: true,
      });
  } catch (error) {
      console.error(error);
      return res.status(500).send({
          message: "Error getting product orders",
          success: false,
      });
  }
});


// Get order by ID
router.get("/:id", async function (req, res, next) {
  try {
      const order = await ordersSchema.findById(req.params.id);
      if (!order) {
          return res.status(404).send({
              message: "Order not found",
              success: false,
          });
      }
      return res.status(200).send({
          data: order,
          message: "success",
          success: true,
      });
  } catch (error) {
      console.error(error);
      return res.status(500).send({
          message: "Error getting order",
          success: false,
      });
  }
});


module.exports = router;