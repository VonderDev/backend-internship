const { calculateResult } = require("../functions/index");

module.exports.calculateResult = async (req, res, next) => {
  try {
    const result = await calculateResult(req.body.question_data);
    res.send(result);
  } catch (err) {
    next(err);
  }
};
