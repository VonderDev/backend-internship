const { CostExplorer } = require("aws-sdk");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.guestAuthMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.get("Authorization");
    const token = authHeader.split(" ")[1];
    console.log(token);

    jwt.verify(token, process.env.Secret_Key, async (err, userAuth) => {
      if (err) {
        res.sendStatus(403);
      } else {
        const user_info = userAuth;
        req._id = user_info._id;
      }
    });
    return next();
  } catch (err) {
    err.message =
      "Did not specify token id, please add token in header with 'Bearer' ";
    next(err);
  }
};
