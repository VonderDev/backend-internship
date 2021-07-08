const express = require("express");
const authController = require("../controllers/authController");
const { body, validationResult } = require("express-validator");

const router = express.Router();
router.post("/login", authController.login);
router.post(
  "/signup",
  body("username").notEmpty(),
  body("firstName").notEmpty(),
  body("lastName").notEmpty(),
  body("email").notEmpty(),
  body("password").notEmpty(),
  authController.signup
);

module.exports = router;
