const { filter, filterTwo } = require("../functions/const");
const summariseModel = require("../models/summarise.model");
const contentModel = require("../models/content.model");
module.exports.arrayLower = (array) => {
  array = array.map((item) => {
    return item.toLowerCase();
  });
  return array;
};

module.exports.checkTag = (tag) => {
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

  tag.map((item) =>
    tags.indexOf(item) == -1
      ? (function () {
          throw { message: "Out of Tag", status: 404 };
        })()
      : console.log("pass")
  );
};

module.exports.dataSetFilterByTag = (tag, dataSet) => {
  let newItem = dataSet.filter((item) =>
    item.tag.some((r) => tag.indexOf(r) >= 0)
  );
  return newItem;
};

module.exports.dataSetFilterByContentType = (content_type, dataSet) => {
  const filters = dataSet.filter((item) =>
    content_type.includes(item.content_type)
  );
  return filters;
};

module.exports.checkStage = (tag, content_type, dataSet, stage) => {
  const tag_content = tag.length && content_type.length;
  const none = !content_type.length && !tag.length;

  if (tag_content && !dataSet) stage = filter.TAG_AND_CONTENT;
  else if (tag_content && dataSet) stage = filter.TAG_AND_CONTENT_WITH_DATASET;
  else if (none && !dataSet) stage = filter.NONE;
  else if (!tag.length && !dataSet) stage = filter.CONTENT;
  else if (!tag.length && dataSet) stage = filter.CONTENT_WITH_DATASET;
  else if (!content_type.length && !dataSet) stage = filter.TAG;
  else if (!content_type.length && dataSet) stage = filter.TAG_WITH_DATASET;

  return stage;
};

function formatDate(date) {
  const monthNames = [
    "ม.ค.",
    "ก.พ.",
    "มี.ค.",
    "เม.ย.",
    "พ.ค.",
    "มิ.ย.",
    "ก.ค.",
    "ส.ค.",
    "ก.ย.",
    "ต.ค.",
    "พ.ย.",
    "ธ.ค.",
  ];

  const day = date.getDate();
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  const format_date = day + " " + month + year;
  return format_date;
}

//takes only 1 content object
module.exports.formatContent = async (content, username) => {
  const create_date = content.created_at;
  const update_date = content.updated_at;

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
    created_at: create_date,
    updated_at: update_date,
  };
  return new_content;
};

//takes result = [score,score,score,score,score,score,score,score,date]
module.exports.formatResult = async (result) => {
  let summarise = await summariseModel.find();
  const score = result;
  const date = new Date(score[8]);
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
      created_at: date,
      img_result: item.img_result,
    };
    obj_arr.push(obj_inside);
  });
  return obj_arr;
};

module.exports.checkStageContent = (tag, content_type, stage) => {
  if (tag && content_type) stage = filterTwo.TAG_AND_CONTENT;
  else if (!tag && !content_type) stage = filterTwo.NONE;
  else if (!tag && content_type) stage = filterTwo.CONTENT;
  else if (!content_type && tag) stage = filterTwo.TAG;

  return stage;
};

module.exports.doSearch = async (tag, content_type, new_input) => {
  let query = {
    $or: [
      {
        isDeleted: false,
        title: { $regex: new_input },
      },
      {
        isDeleted: false,
        "author_data.username": { $regex: new_input },
      },
      {
        isDeleted: false,
        tag: { $regex: new_input },
      },
    ],
  };

  if (content_type.length > 0) {
    query["$or"][0]["content_type"] = { $in: content_type };
    query["$or"][1]["content_type"] = { $in: content_type };
  }

  if (tag.length > 0) {
    query["$or"][0]["tag"] = { $in: tag };
    query["$or"][1]["tag"] = { $in: tag };
  }

  return await contentModel.aggregate([
    {
      $lookup: {
        from: "userauths",
        localField: "author_id",
        foreignField: "_id",
        as: "author_data",
      },
    },

    { $match: query },
    {
      $unwind: {
        path: "$author_data",
      },
    },
    {
      $addFields: {
        author_username: "$author_data.username",
      },
    },
    {
      $project: {
        content_body: 1,
        title: 1,
        uid_likes: 1,
        tag: 1,
        image: 1,
        created_at: 1,
        author_username: 1,
        content_type: 1,
      },
    },
  ]);
};
