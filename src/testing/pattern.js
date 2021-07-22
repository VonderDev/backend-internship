module.exports.authPattern = {
  role: String,
  isDeleted: Boolean(),
  _id: String,
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  username: String,
  created_at: String,
  updated_at: String,
};

module.exports.contentPattern = {
  _id: String,
  author_id: String,
  content_body: String,
  title: String,
  uid_likes: [String],
  tag: [String],
  content_type: String,
  image: String,
  author_username: String,
  created_at: String,
  updated_at: String,
};

module.exports.createContentPattern = {
  _id: String,
  author_id: String,
  content_body: String,
  title: String,
  uid_likes: [String],
  tag: [String],
  content_type: String,
  image: String,
  isDeleted: Boolean(),
  created_at: String,
  updated_at: String,
};

module.exports.commentPattern = {
  _id: String,
  comment_body: String,
  isDeleted: Boolean(),
  content_id: String,
  uid: String,
  created_at: String,
  updated_at: String,
  username: String,
};

module.exports.arraySearchPatten = [
  {
    _id: String,
    content_body: String,
    title: String,
    uid_likes: [String],
    tag: [String],
    content_type: String,
    image: String,
    created_at: String,
    author_data: [
      {
        username: String,
      },
    ],
  },
];

module.exports.resultPattern = {
  category_id: Number,
  description: String,
  description_career: String,
  image_charactor: String,
  skill_summarize: String,
  charactor_summarize: String,
  skill: String,
  score: Number,
  created_at: String,
};

module.exports.userProfilePattern = {
  auth: [this.authPattern],
  results: [[this.resultPattern]],
  contents: [this.contentPattern],
};
module.exports.questionPattern = {
  questionIndex: Number,
  category_id: Number,
  questionBody: String,
  _id: String,
  created_at: String,
  updated_at: String,
};

module.exports.summarizePattern = {
  description: String,
  description_career: String,
  image_charactor: String,
  skill_summarize: String,
  charactor_summarize: String,
  skill: String,
  _id: String,
  created_at: String,
  updated_at: String,
  category_id: Number,
};
