const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const auth = require("../middlewares/auth");
const multer = require("multer");

router.post(
  "/images",
  auth.authMiddleware,
  multer({ dest: "uploads/" }).array("photo", 10),
  usersController.postImage
);

router.get("/user/find", auth.authMiddleware, usersController.findUserById);
router.put("/user", auth.authMiddleware, usersController.updateUserById);
router.delete("/user", auth.authMiddleware, usersController.deleteUserById);
router.post(
  "/user/result",
  auth.authMiddleware,
  usersController.createResultById
);
router.get("/user", auth.authMiddleware, usersController.getAllUsers);
router.post("/comment", auth.authMiddleware, usersController.postComment);
router.get("/user/result", auth.authMiddleware, usersController.getResultById);
router.post("/user/content", auth.authMiddleware, usersController.postContent);
router.get(
  "/user/content/get",
  auth.authMiddleware,
  usersController.getAllContents
);
router.get(
  "/user/content/tag",
  auth.authMiddleware,
  usersController.getSortByTag
);
router.put(
  "/user/content",
  auth.authMiddleware,
  usersController.contentIsLiked
);
router.get(
  "/user/comment/get/:page-:limit",
  auth.authMiddleware,
  usersController.getCommentByContentId
);
router.delete(
  "/user/comment",
  auth.authMiddleware,
  usersController.deleteComment
);
router.delete(
  "/user/content",
  auth.authMiddleware,
  usersController.deleteContent
);
router.get(
  "/user/search/:keyword",
  auth.authMiddleware,
  usersController.search
);

router.post("/newResult", auth.authMiddleware, usersController.postNewResult);
router.get("/newResult", auth.authMiddleware, usersController.getNewResult);

module.exports = router;
