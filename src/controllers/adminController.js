const questionModel = require("../models/questions.model");
const resultModel = require("../models/guestResult.model");
const {
  findAdminById,
  findAllAdmins,
  getAllUsers,
  postQuestion,
  postSummarise,
  getSummarise,
} = require("../functions/admin");

exports.getAllResult = async (req, res, next) => {
  if (req.role != "admin") {
    throw {
      status: 400,
      message: "only admin can access",
    };
  }
  const results = await resultModel.find();
  if (!results.length) {
    throw {
      message: "no results found in database",
      status: 404,
    };
  }
  res.send(results);
};

exports.getAdminById = async (req, res, next) => {
  if (req.role != "admin") {
    throw {
      status: 400,
      message: "only admin can access",
    };
  }
  req.body._id
    ? res.send(await findAdminById(req.body._id))
    : res.send(await findAdminById(req.userId));
};

exports.getAllAdmins = async (req, res, next) => {
  if (req.role != "admin") {
    throw {
      status: 400,
      message: "only admin can access",
    };
  }
  res.send(await findAllAdmins());
};

exports.getAllUsers = async (req, res, next) => {
  if (req.role != "admin") {
    throw {
      status: 400,
      message: "only admin can access",
    };
  }
  res.send(await getAllUsers());
};

exports.getAllQuestions = async (req, res, next) => {
  const question = await questionModel.find({});
  if (!question.length) {
    throw {
      message: "no questions found in database",
      status: 404,
    };
  }
  res.send(question);
};

exports.getQuestionByCat = async (req, res, next) => {
  if (req.role != "admin") {
    throw {
      status: 400,
      message: "only admin can access",
    };
  }
  const catName = req.body.categoryIndex;
  const question = await questionModel.find({ categoryIndex: catName });
  if (!question.length) {
    throw {
      message: `could not find question from category ${catName}`,
      status: 404,
    };
  }
  res.send(question);
};

exports.getSummarise = async (req, res, next) => {
  const summarise = await getSummarise();
  res.send(summarise);
};

exports.postQuestion = async (req, res, next) => {
  if (req.role != "admin") {
    throw {
      status: 400,
      message: "only admin can access",
    };
  }
  const question = await postQuestion(req.body);
  res.send(question);
};

exports.postSummarise = async (req, res, next) => {
  if (req.role != "admin") {
    throw {
      status: 400,
      message: "only admin can access",
    };
  }
  const summarise = await postSummarise(req.body);
  res.send(summarise);
};

exports.updateFields = async (req, res, next) => {
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
};
