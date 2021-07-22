const { formatResult } = require("../functions/index");

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
