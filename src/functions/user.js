const CommentModel = require("../models/comment.model");
const ContentModel = require("../models/content.model");
const userAuth = require("../models/auth.model");
const mongoose = require("mongoose");
const authModel = require("../models/auth.model");
const valid_id = mongoose.Types.ObjectId.isValid;
const resultNew = require("../models/resultNew.model");
const summariseModel = require("../models/summarise.model");
const { filter, filterTwo } = require("../functions/const");
const { tags } = require("../functions/const");
const {
  arrayLower,
  checkTag,
  dataSetFilterByTag,
  dataSetFilterByContentType,
  checkStage,
  formatContent,
  formatResult,
  checkStageContent,
  doSearch,
} = require("../functions/index");
const contentModel = require("../models/content.model");
const resultNewModel = require("../models/resultNew.model");

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
  if (!valid_id(userId)) {
    throw {
      message: "invalid userId",
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
      message: "invalid userId",
      status: 404,
    };
  }
  await resultNewModel.deleteOne({ userid: userId });
  return userAuth.findOneAndUpdate(
    { _id: userId },
    {
      delete_at: new Date(),
      isDeleted: true,
    },
    { new: true }
  );
};

module.exports.getResultUsers = async () => {
  return await resultNew.find();
};

module.exports.createCommnet = async (input, user_id) => {
  const { comment_body, content_id } = input;
  return await CommentModel.create({ comment_body, content_id, uid: user_id });
};

module.exports.createContent = async (input, id) => {
  let { content_body, title, uid_likes, tag, content_type, image } = input;
  if (!title) {
    throw {
      message: "Please specify title",
      status: 203,
    };
  }
  if (!content_body) {
    throw {
      message: "Please specify content_body",
      status: 203,
    };
  }
  if (!content_type) {
    throw {
      message: "Please specify content_type",
      status: 203,
    };
  }
  content_type = content_type.toLowerCase();
  tag = tag.map((item) => {
    return item.toLowerCase();
  });

  return await ContentModel.create({
    content_body,
    title,
    uid_likes,
    author_id: id,
    tag,
    content_type,
    image,
  });
};

module.exports.getAllContents = async () => {
  const content = await ContentModel.find({
    isDeleted: false,
  });

  const content_promise = content.map(async (element) => {
    const user = await authModel.findOne({ _id: element.author_id });
    if (!user) {
      throw {
        status: 404,
        message: `author for the content ${element.title} doesn't exist in the database`,
      };
    }
    const content = await formatContent(element, user.username);
    return content;
  });
  const new_contents = await Promise.all(content_promise);
  return new_contents;
};

module.exports.getSortByTag = async (tag, dataSet, content_type) => {
  let filtered;
  let stage;

  content_type.length ? (content_type = arrayLower(content_type)) : {};
  tag.length
    ? function () {
        tag = arrayLower(tag);
        checkTag(tag);
      }
    : {};

  stage = checkStage(tag, content_type, dataSet, stage);

  switch (stage) {
    case filter.TAG_AND_CONTENT:
      filtered = await ContentModel.find({
        $and: [{ content_type: { $in: content_type } }, { tag: { $in: tag } }],
        isDeleted: false,
      });
      break;
    case filter.TAG_AND_CONTENT_WITH_DATASET:
      const newItem = dataSetFilterByTag(tag, dataSet);
      filtered = dataSetFilterByContentType(content_type, newItem);
      break;
    case filter.NONE:
      filtered = await ContentModel.find({});
      break;
    case filter.CONTENT:
      filtered = await ContentModel.find({
        content_type: { $in: content_type },
        isDeleted: false,
      });
      break;
    case filter.CONTENT_WITH_DATASET:
      filtered = dataSetFilterByContentType(content_type, dataSet);
      break;
    case filter.TAG:
      filtered = await ContentModel.find({
        tag: { $in: tag },
        isDeleted: false,
      });
      break;
    case filter.TAG_WITH_DATASET:
      filtered = dataSetFilterByTag(tag, dataSet);
      break;
    default:
      throw {
        message: "no content found",
        status: 404,
      };
  }
  //add author_username into filtered data
  const content_promise = filtered.map(async (element) => {
    const userId = element.author_id;
    const user = await authModel.findOne({ _id: userId });
    if (!user) {
      throw {
        status: 404,
        message: `author for the content ${element.title} doesn't exist in the database`,
      };
    }
    const content = await formatContent(element, user.username);
    return content;
  });
  return await Promise.all(content_promise);
};

module.exports.contentIsLiked = async (input_uid, input_content_id) => {
  if (!valid_id(input_content_id)) {
    throw {
      message: "invalid comment id",
      status: 404,
    };
  }
  const content_obj = await ContentModel.find({
    _id: input_content_id,
    isDeleted: false,
  });

  const array = content_obj[0].uid_likes;
  let unlike = false;

  for (let i = 0; i < array.length; i++) {
    if (array[i] == input_uid) {
      array.splice(i, 1);
      unlike = true;
    }
  }
  console.log(input_uid);
  !unlike ? array.push(input_uid) : console.log("unlike");

  const content = await ContentModel.findOneAndUpdate(
    { _id: input_content_id, isDeleted: false },
    { uid_likes: array },
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
      message: "invalid comment id",
      status: 404,
    };
  }
  const comments = await CommentModel.aggregate([
    [
      {
        $lookup: {
          from: "userauths",
          localField: "uid",
          foreignField: "_id",
          as: "personData",
        },
      },
      {
        $unwind: {
          path: "$personData",
        },
      },
      {
        $addFields: {
          username: "$personData.username",
        },
      },
      {
        $project: {
          personData: 0,
        },
      },
      {
        $match: {
          content_id: new mongoose.Types.ObjectId(input_content_id),
        },
      },
    ],
  ])
    .skip((page - 1) * limit)
    .limit(limit);

  if (!comments.length) {
    return [];
  }

  return comments;
};

module.exports.deleteContent = async (input_content_id) => {
  if (!valid_id(input_content_id)) {
    throw {
      message: "invalid content id",
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
      message: "invalid comment id",
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

module.exports.search = async (input, tag, content_type) => {
  let stage;
  let new_input = new RegExp(input, "i");

  stage = checkStageContent(tag, content_type, stage);

  content_type.length ? (content_type = arrayLower(content_type)) : {};
  tag.length
    ? function () {
        tag = arrayLower(tag);
        checkTag(tag);
      }
    : {};

  switch (stage) {
    case filterTwo.TAG_AND_CONTENT:
      return await doSearch(tag, content_type, new_input);
      break;
    case filterTwo.TAG:
      return await doSearch(tag, content_type, new_input);
      break;
    case filterTwo.CONTENT:
      return await doSearch(tag, content_type, new_input);
      break;
    case filterTwo.NONE:
      return await doSearch(tag, content_type, new_input);
      break;
  }
};

module.exports.getContentById = async (input) => {
  const user = await userAuth.findOne({
    _id: input,
    isDeleted: false,
  });
  if (!user) {
    throw {
      message: "invalid user id",
      status: 404,
    };
  }
  if (valid_id(input)) {
    const content = await ContentModel.find({
      author_id: input,
      isDeleted: false,
    });
    if (content == "") {
      throw {
        message:
          "Error from trying to get non-existing content, please create content first",
        status: 404,
      };
    }
    const username = await authModel.find({
      _id: content[0].author_id,
    });
    const auth_username = username[0].username;

    const content_promise = content.map(async (element) => {
      const content = await formatContent(element, auth_username);
      return content;
    });
    const new_contents = await Promise.all(content_promise);
    return new_contents;
  } else {
    throw {
      message:
        "Error from trying to get non-existing content, please create content first",
      status: 404,
    };
  }
};

module.exports.getContentByContentId = async (input) => {
  if (valid_id(input)) {
    input = new mongoose.Types.ObjectId(input);
    const content = await ContentModel.find({
      _id: input,
      isDeleted: false,
    });
    if (content == "") {
      throw {
        message: "Invalid Content id",
        status: 404,
      };
    }
    const username = await authModel.find({ _id: content[0].author_id });
    const auth_username = username[0].username;
    return await formatContent(content[0], auth_username);
  } else {
    throw {
      message:
        "Error from trying to get non-existing content, please create content first",
      status: 404,
    };
  }
};

exports.getResultByIndex = async (user_id, index) => {
  const userid = await userAuth.findOne({
    _id: user_id,
    isDeleted: false,
  });
  if (!userid) {
    throw {
      message: "invalid user id",
      status: 404,
    };
  }

  const user = await resultNew.findOne({ userid: user_id });

  if (!user) {
    throw {
      message:
        "Error from trying to get non-existing result, please do the test first",
      status: 404,
    };
  }

  const index_number = parseInt(index);

  const newResult = await resultNew.aggregate([
    {
      $match: { userid: mongoose.Types.ObjectId(user_id) },
    },
    {
      $addFields: {
        results: "$results",
      },
    },
    {
      $unwind: {
        path: "$results",
      },
    },
  ]);

  const score = newResult[index_number].results;
  const new_result = await formatResult(score);
  return new_result;
};

exports.userContentByResult = async (userId) => {
  const userResult = await resultNew.aggregate([
    {
      $match: {
        userid: mongoose.Types.ObjectId(userId),
      },
    },
    {
      $addFields: {
        results: {
          $slice: ["$results", -1],
        },
      },
    },
  ]);
  if (!userResult.length) {
    throw {
      status: 404,
      message:
        "error from trying to get non-existing result, please do the test first",
    };
  }
  const result = userResult[0].results[0];
  result.pop();
  let m = Math.max(...result);
  let maxes = result.reduce((p, c, i, a) => (c == m ? p.concat(i) : p), []);
  const userTags = maxes.map((userTag) => tags[userTag]);
  const contents = await this.getSortByTag(userTags, null, []);
  return contents;
};
