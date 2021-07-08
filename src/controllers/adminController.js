const questionModel = require("../models/questions.model");
const resultModel = require("../models/result.model");
const {
  findAdminById,
  findAllAdmins,
  postQuestion,
  postSummarise,
  getSummarise,
} = require("../functions/index");

exports.getAllResult = async (req, res) => {
  try {
    const results = await resultModel.find();
    const { role } = req;
    if (role != "admin") {
      return res.status(400).json({
        status: "error",
        message: "only admin can access",
      });
    } else if (!results.length) {
      throw {
        message: "result not found",
        status: 404,
      };
    } else res.send(results);
  } catch (err) {
    next(err);
  }
};

exports.getAdminById = async (req, res, next) => {
  try {
    const { role } = req;
    if (role != "admin") {
      return res.status(400).json({
        status: "error",
        message: "only admin can access",
      });
    } else if (req.body._id) {
      const userId = req.body._id;
      const admin = await findAdminById(userId);
      res.send(admin);
    } else {
      const { userId } = req;
      const admin = await findAdminById(userId);
      res.send(admin);
    }
  } catch (err) {
    next(err);
  }
};

exports.getAllAdmins = async (req, res, next) => {
  try {
    const admins = await findAllAdmins();
    const { role } = req;
    if (role != "admin") {
      return res.status(400).json({
        status: "error",
        message: "only admin can access",
      });
    } else res.send(admins);
  } catch (err) {
    next(err);
  }
};

exports.postQuestion = async (req, res, next) => {
  try {
    const question = await postQuestion(req.body);
    const { role } = req;
    if (role != "admin") {
      return res.status(400).json({
        status: "error",
        message: "only admin can access",
      });
    } else res.send(question);
  } catch (err) {
    next(err);
  }
};

exports.getAllQuestions = async (req, res, next) => {
  try {
    const question = await questionModel.find({});
    const { role } = req;
    if (!question.length) {
      throw {
        message: "question not found",
        status: 404,
      };
    } else res.send(question);
  } catch (err) {
    next(err);
  }
};

exports.getQuestionByCat = async (req, res, next) => {
  try {
    const catName = req.body.categoryIndex;
    const question = await questionModel.find({ categoryIndex: catName });
    const { role } = req;
    if (role != "admin") {
      return res.status(400).json({
        status: "error",
        message: "only admin can access",
      });
    } else if (!question.length) {
      throw {
        message: "Invalid category",
        status: 400,
      };
    }
    res.send(question);
  } catch (err) {
    next(err);
  }
};

exports.updateFields = async (req, res, next) => {
  try {
    const up = await questionModel.updateMany(
      {},
      { $rename: { categoryIndex: "category_id" } }
    );
    const { role } = req;
    if (role != "admin") {
      return res.status(400).json({
        status: "error",
        message: "only admin can access",
      });
    } else res.send(up);
  } catch (err) {
    next(err);
  }
};

exports.postSummarise = async (req, res, next) => {
  try {
    const summarise = await postSummarise(req.body);
    const { role } = req;
    if (role != "admin") {
      return res.status(400).json({
        status: "error",
        message: "only admin can access",
      });
    } else res.send(summarise);
  } catch (err) {
    next(err);
  }
};

exports.getSummarise = async (req, res, next) => {
  try {
    const summarise = await getSummarise();
    res.send(summarise);
  } catch (err) {
    next(err);
  }
};
