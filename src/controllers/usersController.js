const {
  // createUser,
  findUserById,
  updateUserById,
  deleteUserById,
  createResultById,
  getResultById,
  getAllUsers,
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
} = require("../functions/user");
const { uploadManyFile } = require("../utils/s3");
const resultNew = require("../models/resultNew.model");
const userAuth = require("../models/auth.model");
const summariseModel = require("../models/summarise.model");
const mongoose = require("mongoose");
const Content = require("../models/content.model");
const authModel = require("../models/auth.model");
const contentModel = require("../models/content.model");
// find user by id
exports.findUserById = async (req, res, next) => {
  try {
    if (req.body._id) {
      const user = await findUserById(req.body._id);
      res.send(user);
    } else {
      const { userId } = req;
      console.log(userId);
      const user = await findUserById(userId);
      res.send(user);
    }
  } catch (err) {
    console.log("err: ", err);
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

//update user by id
exports.updateUserById = async (req, res, next) => {
  try {
    if (req.body._id) {
      const updateUser = await updateUserById(req.body, req.body._id);
      res.send(updateUser);
    } else {
      const { userId } = req;
      const updateUser = await updateUserById(req.body, userId);
      res.send(updateUser);
    }
  } catch (err) {
    console.log("err here: ", err);
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.deleteUserById = async (req, res, next) => {
  try {
    if (req.body._id) {
      const deleteUser = await deleteUserById(req.body._id);
      res.send(deleteUser);
    } else {
      const { userId } = req;
      const deleteUser = await deleteUserById(userId);
      res.send(deleteUser);
    }
  } catch (err) {
    console.log("err:", err);
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.createResultById = async (req, res, next) => {
  try {
    const answers = req.body;
    const user = await createResultById(answers, req);
    res.send(user);
  } catch (err) {
    console.log("err:", err);
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await getAllUsers();
    res.send(users);
  } catch (err) {
    console.log("err: ", err);
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.postComment = async (req, res, next) => {
  try {
    const { userId } = req;
    const comment = await createCommnet(req.body, userId);
    res.send(comment);
  } catch (err) {
    console.log("err: ", err);
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.createGuest = async (req, res) => {
  try {
    const token = await createGuest();
    console.log("token: ", token);
    console.log(token);
    res.status(200).json({ token });
  } catch (err) {
    console.log("err: ", err);
    res.status(err.status || 500).send(err.message || "Internal Server Error");
  }
};

exports.getResultById = async (req, res, next) => {
  try {
    if (req.body._id) {
      const user = await getResultById(req.body._id);
      res.send(user);
    } else {
      const { userId } = req;
      const user = await getResultById(userId);
      res.send(user);
    }
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.postContent = async (req, res) => {
  try {
    const { userId } = req;
    const content = await createContent(req.body, userId);
    res.send(content);
  } catch (err) {
    console.log("err: ", err);
    res.status(err.status || 500).send(err.message || "Internal Server Error");
  }
};

exports.getAllContents = async (req, res) => {
  try {
    const contents = await getAllContents();
    res.send(contents);
  } catch (err) {
    console.log("err: ", err);
    res.status(err.status || 500).send(err.message || "Internal Server Error");
  }
};

exports.getSortByTag = async (req, res, next) => {
  try {
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
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.postImage = async (req, res, next) => {
  //J calling
  try {
    const { userId, files } = req;
    const result = await uploadManyFile(files, userId, "userResult");
    console.log(result);
    res.send(result);
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.contentIsLiked = async (req, res, next) => {
  try {
    const content = await contentIsLiked(req.userId, req.body.content_id);
    res.send(content);
  } catch (err) {
    next(err);
  }
};

exports.getCommentByContentId = async (req, res, next) => {
  try {
    const page = req.params.page || 1;
    const r_limit = req.params.limit || 2;
    const limit = parseInt(r_limit);

    const comments = await getCommentByContentId(
      req.body.content_id,
      page,
      limit
    );
    res.send(comments);
  } catch (err) {
    next(err);
  }
};

exports.deleteContent = async (req, res, next) => {
  try {
    const content = await deleteContent(req.body.content_id);
    res.send(content);
  } catch (err) {
    next(err);
  }
};

exports.deleteComment = async (req, res, next) => {
  try {
    const comment = await deleteComment(req.body.comment_id);
    res.send(comment);
  } catch (err) {
    next(err);
  }
};

exports.search = async (req, res, next) => {
  try {
    if (req.body.content_type && req.body.tag) {
      const search_result = await search(
        req.params.keyword,
        req.body.tag,
        req.body.content_type
      );
      res.send(search_result);
    } else {
      res.send(await search(req.params.keyword, null, null));
    }
  } catch (err) {
    next(err);
  }
};

exports.postNewResult = async (req, res, next) => {
  try {
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
  } catch (error) {
    next(error);
  }
};

exports.getNewResult = async (req, res, next) => {
  try {
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

    let summarise = await summariseModel.find();
    const score = newResult[0].results;
    const obj_arr = [];
    summarise.map((item, index) => {
      const obj_inside = {
        category_id: item.category_id,
        description: item.description,
        description_career: item.description_career,
        image_charactor: item.image_charactor,
        skill_summarize: item.skill_summarize,
        charactor_summarize: item.charactor_summarize,
        skill: item.skill,
        score: score[index] * 10,
        created_at: Date(score[8]),
      };
      obj_arr.push(obj_inside);
    });

    res.send(obj_arr);
  } catch (error) {
    next(error);
  }
};

exports.getNewestContent = async (req, res, next) => {
  try {
    const { userId } = req;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw {
        message: "userid is not defined",
        status: 404,
      };
    }
    let newest = await Content.find({ author_id: userId });
    newest = newest[newest.length - 1];

    const username = await userAuth.find({ _id: newest.author_id });
    const auth_username = username[0].username;

    const new_content = {
      _id: newest._id,
      author_id: newest.author_id,
      content_body: newest.content_body,
      title: newest.title,
      likes: newest.likes,
      uid_likes: newest.uid_likes,
      tag: newest.tag,
      content_type: newest.content_type,
      image: newest.image,
      author_username: auth_username,
      created_at: newest.created_at,
      updated_at: newest.updated_at,
    };
    res.send(new_content);
  } catch (err) {
    console.log("err: ", err);
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.getContentById = async (req, res, next) => {
  try {
    if (req.body.author_id) {
      const user = await getContentById(req.body.author_id);
      res.send(user);
    } else {
      const { userId } = req;
      console.log(userId);
      const user = await getContentById(userId);
      res.send(user);
    }
  } catch (err) {
    console.log("err: ", err);
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.formatResult = async (result) => {
  let summarise = await summariseModel.find();
  const score = result;
  const obj_arr = [];
  summarise.map((item, index) => {
    const obj_inside = {
      category_id: item.category_id,
      description: item.description,
      description_career: item.description_career,
      image_charactor: item.image_charactor,
      skill_summarize: item.skill_summarize,
      charactor_summarize: item.charactor_summarize,
      skill: item.skill,
      score: score[index] * 10,
      created_at: Date(score[8]),
    };
    obj_arr.push(obj_inside);
  });
  return obj_arr;
};

async function formatContent(content, username) {
  const new_content = {
    _id: content._id,
    author_id: content.author_id,
    content_body: content.content_body,
    title: content.title,
    likes: content.likes,
    uid_likes: content.uid_likes,
    tag: content.tag,
    content_type: content.content_type,
    image: content.image,
    author_username: username,
    created_at: content.created_at,
    updated_at: content.updated_at,
  };
  return new_content;
}

exports.getProfile = async (req, res, next) => {
  try {
    const userId = req.userId;
    const authData = await authModel.find({ _id: userId });
    const resultData = await resultNew.find({ userid: userId });
    const contentData = await contentModel.find({ author_id: userId });
    const results_array = resultData[0].results;

    const promises = results_array.map(async (element) => {
      const result = await this.formatResult(element);
      return result;
    });
    const results = await Promise.all(promises);

    const content_promise = contentData.map(async (element) => {
      const content = await formatContent(element, authData[0].username);
      return content;
    });
    const new_contents = await Promise.all(content_promise);
    res.send({ auth: authData, results: results, contents: new_contents });
  } catch (err) {
    next(err);
  }
};
