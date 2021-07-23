const express = require("express");
const authController = require("../controllers/authController");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const { tryCatch } = require("../middlewares/tryCatchController");
//POST
router.post("/login", tryCatch(authController.login));
router.post(
  "/signup",
  body("username").notEmpty(),
  body("firstName").notEmpty(),
  body("lastName").notEmpty(),
  body("email").notEmpty(),
  body("password").notEmpty(),
  tryCatch(authController.signup)
);

module.exports = router;
