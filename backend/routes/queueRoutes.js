const express = require("express");
const router = express.Router();

const queueController = require("../controllers/queueController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", queueController.getQueues);

router.post(
  "/",
  authMiddleware.protect,
  authMiddleware.adminOnly,
  queueController.createQueue,
);

router.get("/:id", queueController.getQueueDetails);

router.post("/:id/join", authMiddleware.protect, queueController.joinQueue);

router.post(
  "/:id/serve-next",
  authMiddleware.protect,
  authMiddleware.adminOnly,
  queueController.serveNextToken,
);

router.put(
  "/token/:id/status",
  authMiddleware.protect,
  authMiddleware.adminOnly,
  queueController.updateTokenStatus,
);

router.delete(
  "/token/:id",
  authMiddleware.protect,
  // authMiddleware.adminOnly,
  queueController.deleteToken,
);

router.delete(
  "/:id",
  authMiddleware.protect,
  authMiddleware.adminOnly,
  queueController.deleteQueue,
);

module.exports = router;
