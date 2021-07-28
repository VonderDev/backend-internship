const { calculateResult } = require("../functions/guest");
const GuestModel = require("../models/guest.model");
const GuestResultsModel = require("../models/guestResult.model");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

module.exports.calculateResult = async (req, res, next) => {
  const _id = req._id;
  const result = await calculateResult(req.body);
  const guest = await GuestResultsModel.findOne({ guest_id: _id });

  res.send(
    guest
      ? await GuestResultsModel.findOneAndUpdate(
          { guest_id: _id },
          { $push: { result: result } }
        )
      : await GuestResultsModel.create({
          guest_id: _id,
          result: result,
        })
  );
};

module.exports.createGuest = async (req, res, next) => {
  const resuit = await GuestModel.create({});
  const token = jwt.sign({ _id: resuit._id }, process.env.Secret_Key, {
    expiresIn: "1d",
  });
  res.status(200).json({ token });
};

module.exports.getResult = async (req, res, next) => {
  const results = await GuestResultsModel.aggregate([
    {
      $match: {
        guest_id: new mongoose.Types.ObjectId(req._id),
      },
    },
    {
      $addFields: {
        result: {
          $slice: ["$result", -1],
        },
      },
    },
    {
      $unwind: {
        path: "$result",
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
  ]);
  res.send(results[0].result);
};
