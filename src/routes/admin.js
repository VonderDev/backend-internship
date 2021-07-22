const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const auth = require("../middlewares/auth");
const { tryCatch } = require("../middlewares/tryCatchController");

//GET
router.get(
  "/results",
  auth.authMiddleware,
  tryCatch(adminController.getAllResult)
);
router.get("/user", auth.authMiddleware, tryCatch(adminController.getAllUsers));
router.get(
  "/admin/find",
  auth.authMiddleware,
  tryCatch(adminController.getAdminById)
);
router.get(
  "/admin",
  auth.authMiddleware,
  tryCatch(adminController.getAllAdmins)
);
router.get("/questions", tryCatch(adminController.getAllQuestions));
router.get(
  "/questions/cat",
  auth.authMiddleware,
  tryCatch(adminController.getQuestionByCat)
);

router.get(
  "/summarize",
  auth.authMiddleware,
  tryCatch(adminController.getSummarise)
);
//POST
router.post("/questions", tryCatch(adminController.postQuestion));
router.post(
  "/summarize",
  auth.authMiddleware,
  tryCatch(adminController.postSummarise)
);

// PUT
router.put(
  "/update",
  auth.authMiddleware,
  tryCatch(adminController.updateFields)
);

module.exports = router;
