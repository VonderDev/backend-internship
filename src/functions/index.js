// functions function structure
const UserModel = require("../models/user.model");
const UserResult = require("../models/result.model");
const AdminModel = require("../models/admin.model");
const CommentModel = require("../models/comment.model");
const GuestModel = require("../models/guest.model");
const ContentModel = require("../models/content.model");
const QuestionModel = require("../models/questions.model");
const AuthModel = require("../models/auth.model");

var mongoose = require("mongoose");

module.exports.findUserById = async (input) => {
  //mongoose.Types.ObjectId.isValid ใช้เยอะ ประกาศตัวแปรดีกว่า
  if (mongoose.Types.ObjectId.isValid(input)) {
    return await AuthModel.findOne({ _id: input, isDeleted: false });
  } else {
    throw {
      message: "user not found",
      status: 404,
    };
  }
};

module.exports.updateUserById = async (payload, userId) => {
  const { name, username, email } = payload;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw {
      message: "Invalid ID",
      status: 404,
    };
  }

  const user = await AuthModel.findOne({
    _id: userId,
    isDeleted: false,
  });

  if (user == null) {
    throw { message: "user not found", status: 404 };
  }

  return AuthModel.findOneAndUpdate(
    { _id: userId },
    { name, username, email },
    { new: true, omitUndefined: true }
  );
};

module.exports.deleteUserById = async (userId) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw {
      message: "Invalid ID",
      status: 404,
    };
  }

  return AuthModel.findOneAndUpdate(
    { _id: userId },
    {
      delete_at: new Date(),
      isDeleted: true,
    },
    { new: true }
  );
};

module.exports.createResultById = async (results, userid) => {
  let questions = results.length;
  let category = {
    "Word Smart": 0,
    "Logic Smart": 0,
    "Picture Smart": 0,
    "Body Smart": 0,
    "Music Smart": 0,
    "People Smart": 0,
    "Self Smart": 0,
    "Nature Smart": 0,
  };

  for (let i = 0; i < questions; i++) {
    category_id = results[i]["categoryId"];
    question_index = results[i]["questionIndex"];
    score = results[i]["score"];
    if (category_id == 1) {
      category["Word Smart"] += score;
    } else if (category_id == 2) {
      category["Logic Smart"] += score;
    } else if (category_id == 3) {
      category["Picture Smart"] += score;
    } else if (category_id == 4) {
      category["Body Smart"] += score;
    } else if (category_id == 5) {
      category["Music Smart"] += score;
    } else if (category_id == 6) {
      category["People Smart"] += score;
    } else if (category_id == 7) {
      category["Self Smart"] += score;
    } else if (category_id == 8) {
      category["Nature Smart"] += score;
    } else {
      throw { message: "invalid category" };
    }
  }
  return await UserResult.create({
    userid: userid,
    category: category,
  });
};

module.exports.getResultById = async (userid) => {
  return await UserResult.find({ userid: userid });
};

module.exports.getResultUsers = async () => {
  return await UserResult.find();
};

module.exports.getAdminById = async (input_id) => {
  if (mongoose.Types.ObjectId.isValid(input_id)) {
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
  return await AuthModel.find({
    role: "user",
    isDeleted: false,
  });
};

module.exports.createCommnet = async (input, user_id) => {
  const { comment_body } = input;
  return await CommentModel.create({ comment_body, uid: user_id });
};

// มีตัวเดียวรับเป็น parameter ได้เลย
module.exports.createGuest = async (input) => {
  const { name } = input;
  return await GuestModel.create({ name });
};

module.exports.createContent = async (input, id, name) => {
  const { content_body, title, likes, uid_likes, comment_id, tag, image } =
    input;
  return await ContentModel.create({
    content_body,
    title,
    likes,
    uid_likes,
    comment_id,
    author_username: name,
    author_id: id,
    tag,
    image,
  });
};

module.exports.getAllContents = async () => {
  return await ContentModel.find({
    isDeleted: false,
  });
};

module.exports.getSortByTag = async (tag) => {
  return await ContentModel.find({
    tag: { $in: tag },
  });
};

module.exports.findAdminById = async (input) => {
  if (mongoose.Types.ObjectId.isValid(input)) {
    return await AuthModel.findOne({
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
  const admins = await AuthModel.find({
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
  const question_no = input.question_no;
  const question_category = input.question_category;
  const check_question_no = await QuestionModel.find({
    question_no: question_no,
  });

  //available question no.
  if (!check_question_no.length) {
    //invalid category
    if (
      question_category != "Word Smart" &&
      question_category != "Logic Smart" &&
      question_category != "Picture Smart" &&
      question_category != "Body Smart" &&
      question_category != "Nature Smart" &&
      question_category != "Self Smart" &&
      question_category != "People Smart" &&
      question_category != "Music Smart"
    ) {
      throw {
        message: "Invalid category",
        status: 400,
      };
    }
    //available question no. and valid category
    else {
      const question = await QuestionModel.create(input);
      return question;
    }
    //question no. is not available
  } else {
    throw {
      message: "Duplicate question number",
      status: 409,
    };
  }
};
