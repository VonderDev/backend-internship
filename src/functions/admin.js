// functions function structure
const AdminModel = require("../models/admin.model");
const QuestionModel = require("../models/questions.model");
const summariseModel = require("../models/summarise.model");
const userAuth = require("../models/auth.model");
const mongoose = require("mongoose");
const valid_id = mongoose.Types.ObjectId.isValid;

module.exports.getAdminById = async (input_id) => {
  if (valid_id(input_id)) {
    return await AdminModel.findOne({
      _id: input_id,
      isDeleted: false,
    });
  } else {
    throw {
      message: "admin not found",
      status: 404,
    };
  }
};

module.exports.getAllUsers = async () => {
  return await userAuth.find({
    role: "user",
    isDeleted: false,
  });
};

module.exports.findAdminById = async (input) => {
  if (valid_id(input)) {
    return await userAuth.findOne({
      _id: input,
      role: "admin",
      isDeleted: false,
    });
  } else {
    throw {
      message: "user not found",
      status: 404,
    };
  }
};

module.exports.findAllAdmins = async () => {
  const admins = await userAuth.find({
    role: "admin",
    isDeleted: false,
  });
  if (!admins.length) {
    throw {
      message: "admin not found",
      status: 404,
    };
  }
  return admins;
};

module.exports.postQuestion = async (input) => {
  const questionIndex = input.questionIndex;
  const category_id = input.category_id;
  const questionBody = input.questionBody;
  if (!(parseInt(category_id) <= 8 && parseInt(category_id) >= 1)) {
    throw {
      message: "out of category index",
      status: 404,
    };
  }
  const ob = await QuestionModel.find({
    questionIndex: questionIndex,
    category_id: category_id,
  });
  console.log(ob.length);
  if (ob.length !== 0) {
    throw {
      message: "question redundant please check question number",
      status: 404,
    };
  } else {
    const question = await QuestionModel.create({
      questionIndex: questionIndex,
      category_id: category_id,
      questionBody: questionBody,
    });
    return question;
  }
};

module.exports.postSummarise = async (input) => {
  if (!(parseInt(category_id) <= 8 && parseInt(category_id) >= 1)) {
    throw {
      message: "out of category index",
      status: 404,
    };
  }
  const ob = await summariseModel.find({
    category_id: category_id,
  });

  if (ob.length !== 0) {
    throw {
      message: "question redundant please check question number",
      status: 404,
    };
  } else {
    const summarise = await summariseModel.create({
      category_id: category_id,
      description: description,
      description_career: description_career,
      image_charactor: image_charactor,
      skill_summarize: skill_summarize,
      charactor_summarize: charactor_summarize,
      img_result: img_result,
    });
    return summarise;
  }
};

module.exports.getSummarise = async () => {
  return await summariseModel.find();
};
