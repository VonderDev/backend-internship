const { formatResult } = require("../functions/index");
const guestResultModel = require("../models/guestResult.model");
const mongoose = require("mongoose");
const { tags } = require("../functions/const");
const { getSortByTag } = require("../functions/user");

exports.calculateResult = async (results) => {
  const array = [0, 0, 0, 0, 0, 0, 0, 0];
  results.map((each_test) => {
    const index = each_test.categoryId;
    if (each_test.categoryId == index) {
      if (index - 1 < 0 || index - 1 > 8) {
        throw {
          message: "invalid category",
          status: 422,
        };
      } else array[index - 1] += each_test.score;
    }
  });
  array[8] = Date.now();

  const new_results = await formatResult(array);

  return new_results;
};

exports.guestContentByResult = async (userId) => {
  const guestResult = await guestResultModel.aggregate([
    {
      $match: {
        guest_id: mongoose.Types.ObjectId(userId),
      },
    },
    {
      $addFields: {
        result: {
          $slice: ["$result", -1],
        },
      },
    },
  ]);

  if (!guestResult.length) {
    throw {
      status: 404,
      message:
        "error from trying to get non-existing result, please do the test first",
    };
  }
  const results = guestResult[0].result[0];
  let result = [];
  results.map((item) => {
    result.push(item.score);
  });
  let m = Math.max(...result);
  let maxes = result.reduce((p, c, i, a) => (c == m ? p.concat(i) : p), []);
  const userTags = maxes.map((userTag) => tags[userTag]);
  const contents = await getSortByTag(userTags, null, []);
  return contents;
};
