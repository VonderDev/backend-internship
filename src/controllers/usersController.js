const {
  findUserById,
  updateUserById,
  deleteUserById,
  createResultById,
  getResultById,
  createCommnet,
  createGuest,
  createContent,
  getAllContents,
  getSortByTag,
  contentIsLiked,
  getCommentByContentId,
  deleteContent,
  deleteComment,
  search,
  getContentById,
  getContentByContentId,
  getResultByIndex
} = require("../functions/user");
const { formatContent, formatResult } = require("../functions/index");
const { uploadManyFile } = require("../utils/s3");
const resultNew = require("../models/resultNew.model");
const userAuth = require("../models/auth.model");
const mongoose = require("mongoose");
const Content = require("../models/content.model");
const authModel = require("../models/auth.model");

// find user by id
exports.findUserById = async (req, res, next) => {
  if (req.body._id) {
    const user = await findUserById(req.body._id);
    res.send(user);
  } else {
    const { userId } = req;
    console.log(userId);
    const user = await findUserById(userId);
    res.send(user);
  }
};

exports.updateUserById = async (req, res, next) => {
  if (req.body._id) {
    const updateUser = await updateUserById(req.body, req.body._id);
    res.send(updateUser);
  } else {
    const { userId } = req;
    const updateUser = await updateUserById(req.body, userId);
    res.send(updateUser);
  }
};

exports.deleteUserById = async (req, res, next) => {
  if (req.body._id) {
    const deleteUser = await deleteUserById(req.body._id);
    res.send(deleteUser);
  } else {
    const { userId } = req;
    const deleteUser = await deleteUserById(userId);
    res.send(deleteUser);
  }
};

exports.createResultById = async (req, res, next) => {
  const answers = req.body;
  const user = await createResultById(answers, req);
  res.send(user);
};

exports.postComment = async (req, res, next) => {
  const { userId } = req;
  const comment = await createCommnet(req.body, userId);
  res.send(comment);
};

exports.createGuest = async (req, res) => {
  const token = await createGuest();
  console.log("token: ", token);
  console.log(token);
  res.status(200).json({ token });
};

exports.getResultById = async (req, res, next) => {
  if (req.body._id) {
    const user = await getResultById(req.body._id);
    res.send(user);
  } else {
    const { userId } = req;
    const user = await getResultById(userId);
    res.send(user);
  }
};

exports.postContent = async (req, res) => {
  const { userId } = req;
  const content = await createContent(req.body, userId);
  res.send(content);
};

exports.getAllContents = async (req, res) => {
  const contents = await getAllContents();
  res.send(contents);
};

exports.getSortByTag = async (req, res, next) => {
  if (req.body.dataSet) {
    const contents = await getSortByTag(
      req.body.tag,
      req.body.dataSet,
      req.body.content_type
    );
    res.send(contents);
  } else {
    const contents = await getSortByTag(
      req.body.tag,
      null,
      req.body.content_type
    );
    res.send(contents);
  }
};

exports.postImage = async (req, res, next) => {
  const { userId, files } = req;
  const result = await uploadManyFile(files, userId, "userResult");
  console.log(result);
  res.send(result);
};

exports.contentIsLiked = async (req, res, next) => {
  const content = await contentIsLiked(req.userId, req.body.content_id);
  res.send(content);
};

exports.getCommentByContentId = async (req, res, next) => {
  const page = req.params.page || 1;
  const r_limit = req.params.limit || 2;
  const limit = parseInt(r_limit);
  const contentId = req.params.contentId;

  const comments = await getCommentByContentId(contentId, page, limit);
  res.send(comments);
};

exports.deleteContent = async (req, res, next) => {
  const content = await deleteContent(req.body.content_id);
  res.send(content);
};

exports.deleteComment = async (req, res, next) => {
  const comment = await deleteComment(req.body.comment_id);
  res.send(comment);
};

exports.search = async (req, res, next) => {
  if (req.body.content_type && req.body.tag) {
    const search_result = await search(
      req.params.keyword,
      req.body.tag,
      req.body.content_type
    );
    res.send(search_result);
  } else if (!req.body.content_type && req.body.tag) {
    const search_result = await search(req.params.keyword, req.body.tag, null);
    res.send(search_result);
  } else if (req.body.content_type && !req.body.tag) {
    const search_result = await search(
      req.params.keyword,
      null,
      req.body.content_type
    );
    res.send(search_result);
  } else {
    res.send(await search(req.params.keyword, null, null));
  }
};

exports.postNewResult = async (req, res, next) => {
  const array = [0, 0, 0, 0, 0, 0, 0, 0];

  const tests = req.body;
  tests.map((each_test) => {
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
  const userId = req.userId;
  const user = await resultNew.find({ userid: userId });
  if (!user.length) {
    newResult = await resultNew.create({
      userid: userId,
      results: array,
    });
    res.send(newResult);
  } else {
    newResult = await resultNew.findOneAndUpdate(
      { userid: userId },
      { $push: { results: array } },
      { new: true }
    );
    res.send(newResult);
  }
};

exports.getNewResult = async (req, res, next) => {
  const userid = req.userId;
  if (!mongoose.Types.ObjectId.isValid(userid)) {
    throw {
      message: "Invalid user id",
      status: 404,
    };
  }

  const user = await resultNew.findOne({ userid: userid });

  if (!user) {
    throw {
      message:
        "Error from trying to get non-existing result, please do the test first",
      status: 404,
    };
  }

  const newResult = await resultNew.aggregate([
    {
      $match: { userid: mongoose.Types.ObjectId(userid) },
    },
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
      },
    },
  ]);

  const score = newResult[0].results;
  const new_result = await formatResult(score);
  res.send(new_result);
};

exports.getNewestContent = async (req, res, next) => {
  const { userId } = req;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw {
      message: "userid is not defined",
      status: 404,
    };
  }
  let newest = await Content.find({ author_id: userId, isDeleted: false });
  newest = newest[newest.length - 1];

  const username = await userAuth.find({
    _id: newest.author_id,
    isDeleted: false,
  });
  const auth_username = username[0].username;

  const new_content = await formatContent(newest, auth_username);
  res.send(new_content);
};

exports.getContentById = async (req, res, next) => {
  if (req.body.author_id) {
    const user = await getContentById(req.body.author_id);
    res.send(user);
  } else {
    const { userId } = req;
    console.log(userId);
    const user = await getContentById(userId);
    res.send(user);
  }
};
exports.getContentByContentId = async (req, res, next) => {
  if (req.params._id) {
    const ContentID = await getContentByContentId(req.params._id);
    res.send(ContentID);
  }
};

exports.getProfile = async (req, res, next) => {
  const userId = req.userId;
  let results_array;
  const authData = await authModel.find({ _id: userId, isDeleted: false });
  const resultData = await resultNew.find({
    userid: userId,
  });
  const contentData = await Content.find({
    author_id: userId,
    isDeleted: false,
  });

  resultData.length
    ? (results_array = resultData[0].results)
    : (results_array = new Array());

  const promises = results_array.map(async (element) => {
    const result = await formatResult(element);
    return result;
  });
  const results = await Promise.all(promises);

  const content_promise = contentData.map(async (element) => {
    const content = await formatContent(element, authData[0].username);
    return content;
  });

  const new_contents = await Promise.all(content_promise);

  res.send({ auth: authData, results: results, contents: new_contents });
};

exports.getSortedContentByLike = async (req, res, next) => {
  const page = req.params.page || 1;
  const r_limit = req.params.limit || 2;
  const limit = parseInt(r_limit);

  const contents = await Content.find({ isDeleted: false })
    .sort({
      uid_likes: -1,
    })
    .skip((page - 1) * limit)
    .limit(limit);

  const content_promise = contents.map(async (element) => {
    const authorId = element.author_id;
    const username = await userAuth.findOne({
      _id: authorId,
      isDeleted: false,
    });
    const content = await formatContent(element, username.username);
    return content;
  });

  const new_contents = await Promise.all(content_promise);

  res.send(new_contents);
};


exports.getResultByIndex = async (req,res,next) => {
  
  const user_id = mongoose.Types.ObjectId(req.params.user_id);
  const index = req.params.array_index;

  const result = await getResultByIndex(user_id,index);
  res.send(result);
};
