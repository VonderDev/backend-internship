module.exports.tryCatch = (fn) => async (req, res, next) => {
  try {
    const response = await fn(req, res, next);
    res.status(200).send(response);
  } catch (error) {
    console.log("error occure ", error.message);
    next(error);
  }
};
