require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userAuth = require("../models/auth.model");
const mongoose = require("mongoose");
const { validationResult } = require("express-validator");

exports.login = async (req, res, next) => {
  let { email, password } = req.body;
  email = email.toLowerCase();
  const user = await userAuth.findOne({ email });
  //must be 401 for unauthorize
  if (!user) {
    throw {
      message: "User donesn't exist.",
      status: 404,
    };
  }
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  //must be 403 for forbidden
  if (!isPasswordCorrect) {
    throw {
      message: "Invalid credentials.",
      status: 404,
    };
  }
  const token = jwt.sign(
    { _id: user._id, email: user.email, role: user.role },
    process.env.Secret_Key, //should declare a variable to uppercase ex: SECRET_KEY
    { expiresIn: "1d" }
  );
  res.status(200).json({ resuit: user, token }); // resuit or result ?
};

exports.signup = async (req, res, next) => {
  let { email, password, username, role, firstName, lastName } = req.body;
  email = email.toLowerCase();
  // user promise.all for save time
  // ex:
  // const [hasEmail, hasUser] = await Promise.all([
  //   userAuth.findOne({ email }),
  //   userAuth.findOne({ username }),
  // ]);
  const hasEmail = await userAuth.findOne({ email });
  const hasUser = await userAuth.findOne({ username });
  // use error status 409 for conflict database (duplicate data)
  if (hasEmail && hasUser) {
    throw {
      message: "Email and Username has been used.",
      status: 500,
    };
  }
  // use if(hasEmail || hasUser) for save line
  if (hasEmail) {
    throw {
      message: "Email has been used.",
      status: 500,
    };
  }
  if (hasUser) {
    throw {
      message: "Username has been used.",
      status: 500,
    };
  }
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error("Validation failed.");
    //should be 400 ? but it's ok to 422
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  const hashedpassword = await bcrypt.hash(password, 10);
  const emailLowercase = email.toLowerCase();
  const resuit = await userAuth.create({
    _id: req._id ? req._id : mongoose.Types.ObjectId(), // Will _id be auto generate ?
    email: emailLowercase, // use email.toLowerCase() here to save line
    password: hashedpassword,
    username,
    role,
    firstName,
    lastName,
  });

  const token = jwt.sign(
    { _id: resuit._id, email: resuit.email, role: resuit.role },
    process.env.Secret_Key,
    { expiresIn: "1d" }
  );
  console.log(res);
  res.status(200).json({ resuit, token });
};
