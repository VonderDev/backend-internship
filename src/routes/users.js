const express = require("express");
const multer = require("multer");
const router = express.Router();
const usersController = require("../controllers/usersController");
const auth = require("../middlewares/auth");
const { tryCatch } = require("../middlewares/tryCatchController");

//GET
router.get(
  "/user/find",
  auth.authMiddleware,
  tryCatch(usersController.findUserById)
);
router.get("/user/content/get", tryCatch(usersController.getAllContents));
router.get(
  "/user/comment/get/:page-:limit/:contentId",
  tryCatch(usersController.getCommentByContentId)
);
router.post("/user/search/:keyword", tryCatch(usersController.search));
router.get(
  "/user/newResult",
  auth.authMiddleware,
  tryCatch(usersController.getNewResult)
);
router.get(
  "/user/content",
  auth.authMiddleware,
  tryCatch(usersController.getContentById)
);

router.get(
  "/user/contentID/:_id",
  tryCatch(usersController.getContentByContentId)
);

router.get(
  "/user/newestContent",
  auth.authMiddleware,
  tryCatch(usersController.getNewestContent)
);

router.get(
  "/user/profile",
  auth.authMiddleware,
  tryCatch(usersController.getProfile)
);

router.get(
  "/user/getResultbyIndex/:user_id/:array_index",
  auth.authMiddleware,
  tryCatch(usersController.getResultByIndex)
);

//POST
router.post(
  "/images",
  auth.authMiddleware,
  multer({ dest: "uploads/" }).array("photo", 10),
  tryCatch(usersController.postImage)
);

router.post(
  "/comment",
  auth.authMiddleware,
  tryCatch(usersController.postComment)
);

router.post(
  "/user/content",
  auth.authMiddleware,
  tryCatch(usersController.postContent)
);

router.post("/user/content/tag", tryCatch(usersController.getSortByTag));

router.post(
  "/user/newResult",
  auth.authMiddleware,
  tryCatch(usersController.postNewResult)
);

router.put(
  "/user/content",
  auth.authMiddleware,
  tryCatch(usersController.contentIsLiked)
);

//PUT
router.put(
  "/user",
  auth.authMiddleware,
  tryCatch(usersController.updateUserById)
);

router.delete(
  "/user",
  auth.authMiddleware,
  tryCatch(usersController.deleteUserById)
);

//DELETE
router.delete(
  "/user/comment",
  auth.authMiddleware,
  tryCatch(usersController.deleteComment)
);
router.delete(
  "/user/content",
  auth.authMiddleware,
  tryCatch(usersController.deleteContent)
);

router.get(
  "/user/content/sort/like/:page-:limit",
  tryCatch(usersController.getSortedContentByLike)
);

router.get(
  "/user/content/result",
  auth.authMiddleware,
  tryCatch(usersController.getContentByResult)
);

router.get(
  "/user/content/result/:index",
  auth.authMiddleware,
  tryCatch(usersController.getContentByResultIndex)
);

module.exports = router;
