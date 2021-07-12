// functions function structure
const UserResult = require("../models/result.model");
const AdminModel = require("../models/admin.model");
const CommentModel = require("../models/comment.model");
const GuestModel = require("../models/guest.model");
const ContentModel = require("../models/content.model");
const QuestionModel = require("../models/questions.model");
const summariseModel = require("../models/summarise.model");
const resultModel = require("../models/result.model");
const userAuth = require("../models/auth.model");
const jwt = require("jsonwebtoken");
var mongoose = require("mongoose");
const authModel = require("../models/auth.model");
const valid_id = mongoose.Types.ObjectId.isValid;
const ObjectID = mongoose.Types.ObjectId;

module.exports.findUserById = async (input) => {
  if (valid_id(input)) {
    return await userAuth.findOne({ _id: input, isDeleted: false });
  } else {
    throw {
      message: "userid is not defined",
      status: 404,
    };
  }
};

module.exports.updateUserById = async (payload, userId) => {
  let { firstName, lastName, email, username } = payload;
  /*password = await bcrypt.hash(password, 10);*/
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw {
      message: "userid is not defined",
      status: 404,
    };
  }

  console.log(isNaN(lastName), isNaN(firstName));
  if (isNaN(lastName) && isNaN(firstName)) {
    return userAuth.findOneAndUpdate(
      { _id: userId },
      { firstName, lastName, email, username },
      { new: true, omitUndefined: true }
    );
  }
  throw {
    message: "digit is not allowed in firstname or lastname",
    status: 404,
  };
};

module.exports.deleteUserById = async (userId) => {
  if (!valid_id(userId)) {
    throw {
      message: "userid is not defined",
      status: 404,
    };
  }

  return userAuth.findOneAndUpdate(
    { _id: userId },
    {
      delete_at: new Date(),
      isDeleted: true,
    },
    { new: true }
  );
};

module.exports.calculateResult = async (results) => {
  let questions = results.length;
  const createAt = Date(Date.now);

  let category = [
    {
      category_id: 1,
      skill: "ปัญญาด้านภาษา",
      score: 0,
    },
    {
      category_id: 2,
      skill: "ปัญญาด้านตรรกะ",
      score: 0,
    },
    {
      category_id: 3,
      skill: "ปัญญาด้านมิติสัมพันธ์",
      score: 0,
    },
    {
      category_id: 4,
      skill: "ปัญญาด้านการเคลื่อนไหว",
      score: 0,
    },
    {
      category_id: 5,
      skill: "ปัญญาด้านดนตรี",
      score: 0,
    },
    {
      category_id: 6,
      skill: "ปัญญาด้านมนุษย์สัมพันธ์",
      score: 0,
    },
    {
      category_id: 7,
      skill: "ปัญญาด้านการเข้าใจตนเอง",
      score: 0,
    },
    {
      category_id: 8,
      skill: "ปัญญาด้านธรรมชาติ",
      score: 0,
    },
  ];

  //calculate result
  for (let i = 0; i < questions; i++) {
    category_id = results[i]["categoryId"];
    score = results[i]["score"];
    if (category_id == 1) {
      category[0]["score"] += score;
    } else if (category_id == 2) {
      category[1]["score"] += score;
    } else if (category_id == 3) {
      category[2]["score"] += score;
    } else if (category_id == 4) {
      category[3]["score"] += score;
    } else if (category_id == 5) {
      category[4]["score"] += score;
    } else if (category_id == 6) {
      category[5]["score"] += score;
    } else if (category_id == 7) {
      category[6]["score"] += score;
    } else if (category_id == 8) {
      category[7]["score"] += score;
    } else {
      throw { message: "invalid category" };
    }
  }

  return { category, createAt };
};

module.exports.createResultById = async (results, req) => {
  const userid = req.userId;

  //Invalid id
  if (!valid_id(userid)) {
    throw {
      message: "user not found",
      status: 404,
    };
  }

  //find existing result
  const user = await UserResult.find({ userid: userid });

  //calculate result
  let results_array = [];
  const calculated_result = await this.calculateResult(results);

  results_array.push(calculated_result);

  //no results in database
  if (!user.length) {
    return await UserResult.create({
      userid: userid,
      results: results_array,
    });
  } else {
    //there is an existing result in database
    const array = user[0].results;

    array.push(calculated_result);

    const results = await UserResult.findOneAndUpdate(
      { userid: userid },
      { results: array },
      { new: true }
    );
    const len = results.results.length;
    return results.results[len - 1];
  }
};

module.exports.getResultById = async (userid) => {
  const result = await UserResult.aggregate([
    { $match: { userid: ObjectID(userid) } },
    {
      $addFields: {
        results: {
          $slice: ["$results", -1],
        },
      },
    },
    {
      $unwind: {
        path: "$results",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        _id: 1,
        category: "$results.category",
        created_at: "$results.createAt",
      },
    },
    {
      $unwind: {
        path: "$category",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "summarises",
        localField: "category.category_id",
        foreignField: "category_id",
        as: "category.category_id",
      },
    },
    {
      $unwind: {
        path: "$category.category_id",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        _id: false,
        categoryID: "$category.category_id.category_id",
        skill: "$category.skill",
        score: "$category.score",
        description: "$category.category_id.description",
        description_career: "$category.category_id.description_career",
        image_charactor: "$category.category_id.image_charactor",
        charactor_summarize: "$category.category_id.charactor_summarize",
        skill_summarize: "$category.category_id.skill_summarize",
        created_at: "$created_at",
      },
    },
  ]);

  return result;
};

module.exports.getResultUsers = async () => {
  return await UserResult.find();
};

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

module.exports.createCommnet = async (input, user_id) => {
  const { comment_body, content_id } = input;
  return await CommentModel.create({ comment_body, content_id, uid: user_id });
};

// มีตัวเดียวรับเป็น parameter ได้เลย
module.exports.createGuest = async () => {
  const resuit = await GuestModel.create({});
  console.log(resuit);
  const token = jwt.sign({ _id: resuit._id }, process.env.Secret_Key, {
    expiresIn: "1d",
  });
  return token;
};

module.exports.createContent = async (input, id) => {
  let { content_body, title, likes, uid_likes, tag, content_type, image } =
    input;
  tag = tag.map((x) => {
    return x.toLowerCase();
  });
  var ct = content_type.toLowerCase();
  return await ContentModel.create({
    content_body,
    title,
    likes,
    uid_likes,
    author_id: id,
    tag,
    content_type: ct,
    image,
  });
};

module.exports.getAllContents = async () => {
  return await ContentModel.find({
    isDeleted: false,
  });
};

module.exports.getSortByTag = async (tag, dataSet, content_type) => {
  tags = [
    "word smart",
    "logic smart",
    "picture smart",
    "body smart",
    "nature smart",
    "self smart",
    "people smart",
    "music smart",
  ];
  tag = tag.map((x) => {
    return x.toLowerCase();
  });

  tag.map((x) =>
    tags.indexOf(x) == -1
      ? (function () {
          throw { message: "Out of Tag", status: 404 };
        })()
      : console.log("pass")
  );
  if (dataSet == null) {
    return await ContentModel.find({
      tag: { $in: tag },
      content_type: { $in: content_type },
      isDeleted: false,
    });
  } else {
    let newItem = dataSet.filter((item) =>
      item.tag.some((r) => tag.indexOf(r) >= 0)
    );
    newItem = dataSet.filter((item) => item.content_type == content_type);

    return newItem;
  }
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

module.exports.contentIsLiked = async (input_uid, input_content_id) => {
  if (!valid_id(input_content_id)) {
    throw {
      message: "content not found",
      status: 404,
    };
  }
  const content_obj = await ContentModel.find({
    _id: input_content_id,
    isDeleted: false,
  });
  const array = content_obj[0].uid_likes;
  for (let i = 0; i < array.length; i++) {
    if (array[i] == input_uid) {
      throw {
        message: "you already liked this post",
        status: 409,
      };
    }
  }
  array.push(input_uid);

  const content = await ContentModel.findOneAndUpdate(
    { _id: input_content_id, isDeleted: false },
    { uid_likes: array, $inc: { likes: 1 } },
    { new: true }
  );

  return content;
};

module.exports.getCommentByContentId = async (
  input_content_id,
  page,
  limit
) => {
  if (!valid_id(input_content_id)) {
    throw {
      message: "content not found",
      status: 404,
    };
  }

  const comments = await CommentModel.find({
    content_id: input_content_id,
    isDeleted: false,
  })
    .skip((page - 1) * limit)
    .limit(limit);

  if (!comments.length) {
    throw {
      message: "no comment found",
      status: 404,
    };
  }

  return comments;
};

module.exports.deleteContent = async (input_content_id) => {
  if (!valid_id(input_content_id)) {
    throw {
      message: "content not found",
      status: 404,
    };
  }

  const content = await ContentModel.findOneAndUpdate(
    { _id: input_content_id, isDeleted: false },
    { isDeleted: true },
    { new: true }
  );

  if (!content)
    throw {
      message: "content not found",
      status: 404,
    };
  else {
    await CommentModel.updateMany(
      { content_id: input_content_id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );
  }

  return content;
};

module.exports.deleteComment = async (input_comment_id) => {
  if (!valid_id(input_comment_id)) {
    throw {
      message: "comment not found",
      status: 404,
    };
  }

  const comment = await CommentModel.findOneAndUpdate(
    { _id: input_comment_id, isDeleted: false },
    { isDeleted: true },
    { new: true }
  );

  if (!comment)
    throw {
      message: "comment not found",
      status: 404,
    };

  return comment;
};

module.exports.postSummarise = async (input) => {
  if (!(parseInt(category_index) <= 8 && parseInt(category_index) >= 1)) {
    throw {
      message: "out of category index",
      status: 404,
    };
  }
  const ob = await summariseModel.find({
    category_id: category_id,
  });
  console.log(ob.length);
  if (ob.length !== 0) {
    throw {
      message: "question redundant please check question number",
      status: 404,
    };
  } else {
    console.log(category_index);
    const summarise = await summariseModel.create({
      category_id: category_id,
      description: description,
      description_career: description_career,
      image_charactor: image_charactor,
      skill_summarize: skill_summarize,
      charactor_summarize: charactor_summarize,
    });
    return summarise;
  }
};

module.exports.getSummarise = async () => {
  return await summariseModel.find();
};

// module.exports.getSummarise = async (input) => {
//   return await resultModel.aggregate([
//     [
//       {
//         $match: {
//           _id: new mongoose.Types.ObjectId("60e2864a3db29d5f10370b26"),
//         },
//       },
//       {
//         $project: {
//           _id: 1,
//           results: {
//             $slice: ["$results", -1],
//           },
//           userid: 1,
//           created_at: 1,
//           updated_at: 1,
//         },
//       },
//       {
//         $unwind: {
//           path: "$results",
//           preserveNullAndEmptyArrays: true,
//         },
//       },
//       {
//         $unwind: {
//           path: "$results",
//           preserveNullAndEmptyArrays: true,
//         },
//       },
//       {
//         $lookup: {
//           from: "summarises",
//           localField: "results.category.category_id",
//           foreignField: "category_id",
//           as: "string",
//         },
//       },
//       {
//         $project: {
//           userid: 1,
//           createAt: "$results.createAt",
//           results: {
//             $map: {
//               input: "$results.category",
//               as: "one",
//               in: {
//                 $mergeObjects: [
//                   "$$one",
//                   {
//                     $arrayElemAt: [
//                       {
//                         $filter: {
//                           input: "$string",
//                           as: "two",
//                           cond: {
//                             $eq: ["$$one.category_id", "$$two.category_id"],
//                           },
//                         },
//                       },
//                       0,
//                     ],
//                   },
//                 ],
//               },
//             },
//           },
//         },
//       },
//     ],
//   ]);
// };

module.exports.search = async (input, tag, con_ty) => {
  let new_input = new RegExp(input, "i");
  if (tag) {
    tag = tag.map((x) => {
      return x.toLowerCase();
    });

    return await ContentModel.aggregate([
      {
        $lookup: {
          from: "userauths",
          localField: "author_id",
          foreignField: "_id",
          as: "author_data",
        },
      },

      {
        $match: {
          $or: [
            {
              content_type: con_ty,
              tag: { $in: tag },
              isDeleted: false,
              "author_data.username": { $regex: new_input },
            },
            {
              content_type: con_ty,
              tag: { $in: tag },
              isDeleted: false,
              title: { $regex: new_input },
            },
          ],
        },
      },
    ]);
  } else {
    return await ContentModel.aggregate([
      {
        $lookup: {
          from: "userauths",
          localField: "author_id",
          foreignField: "_id",
          as: "author_data",
        },
      },
      {
        $match: {
          $or: [
            {
              isDeleted: false,
              "author_data.username": { $regex: new_input },
            },
            {
              isDeleted: false,
              title: { $regex: new_input },
            },
            {
              tag: { $regex: new_input },
            },
          ],
        },
      },
      {
        $project: {
          _id: 1,
          content_body: 1,
          title: 1,
          likes: 1,
          uid_likes: 1,
          tag: 1,
          image: 1,
          isDeleted: 1,
          author_id: 1,
          created_at: 1,
          "author_data.username": 1,
          content_type: 1,
        },
      },
    ]);
  }
};
