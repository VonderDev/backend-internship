const express = require("express");
const router = express.Router();
const guestController = require("../controllers/guestController");
const { guestAuthMiddleware } = require("../middlewares/guestAuth");
const { tryCatch } = require("../middlewares/tryCatchController");

//POST
router.post(
  "/guest/result",
  guestAuthMiddleware,
  tryCatch(guestController.calculateResult)
);

router.get(
  "/guest/result",
  guestAuthMiddleware,
  tryCatch(guestController.getResult)
);
router.post("/guest/create", tryCatch(guestController.createGuest));

module.exports = router;
