const Queue = require("../models/Queue");
const Token = require("../models/Token");

let ioInstance = null;

// ✅ Set socket instance
const setSocketInstance = (io) => {
  ioInstance = io;
};

// ✅ Emit real-time update
const emitQueueUpdate = (queueId) => {
  if (ioInstance) {
    ioInstance.to(queueId.toString()).emit("queueUpdated", {
      queueId: queueId.toString(),
    });
  }
};

// ✅ Get service time safely
const getServiceTime = (queue) => {
  return Number(queue.avgServiceTime || queue.averageServiceTime || 5);
};

// ✅ 🔥 IMPROVED RECALCULATION (AUTO SHIFT FIX)
const recalculateQueueTokens = async (queueId) => {
  const queue = await Queue.findById(queueId);
  if (!queue) return;

  const serviceTime = getServiceTime(queue);

  const tokens = await Token.find({ queue: queueId }).sort({
    tokenNumber: 1,
  });

  let current = 0;

  for (const token of tokens) {
    if (token.status === "completed" || token.status === "cancelled") {
      token.estimatedWaitTime = 0;
      continue;
    }

    if (token.status === "serving") {
      current = token.tokenNumber;
      token.estimatedWaitTime = 0;
      continue;
    }

    if (token.status === "waiting") {
      const peopleAhead = tokens.filter(
        (t) =>
          t.status === "waiting" &&
          t.tokenNumber < token.tokenNumber &&
          t.tokenNumber > current,
      ).length;

      token.estimatedWaitTime = peopleAhead * serviceTime;
    }

    await token.save();
  }

  queue.currentServingToken = current;
  await queue.save();

  emitQueueUpdate(queueId);
};

// ✅ CREATE QUEUE (ADMIN)
const createQueue = async (req, res) => {
  try {
    const { title, location, category, avgServiceTime } = req.body;

    const queue = await Queue.create({
      title,
      location,
      category,
      avgServiceTime: Number(avgServiceTime || 5),
      createdBy: req.user._id,
    });

    res.status(201).json(queue);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed to create queue",
    });
  }
};

// ✅ GET QUEUES (SEARCH + FILTER + LIMIT)
const getQueues = async (req, res) => {
  try {
    const { search, location, category } = req.query;

    let filter = {};

    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }

    if (category) {
      filter.category = category;
    }

    const queues = await Queue.find(filter).sort({ createdAt: -1 }).limit(7); // 🔥 default 7 queues

    res.json(queues);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed to fetch queues",
    });
  }
};

// ✅ GET SINGLE QUEUE DETAILS
const getQueueDetails = async (req, res) => {
  try {
    const queue = await Queue.findById(req.params.id);

    if (!queue) {
      return res.status(404).json({ message: "Queue not found" });
    }

    const tokens = await Token.find({ queue: req.params.id })
      .sort({ tokenNumber: 1 })
      .populate("user", "name email");

    res.json({ queue, tokens });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed to fetch queue details",
    });
  }
};

// ✅ JOIN QUEUE
const joinQueue = async (req, res) => {
  try {
    const queue = await Queue.findById(req.params.id);

    if (!queue) {
      return res.status(404).json({ message: "Queue not found" });
    }

    if (!queue.isOpen) {
      return res.status(400).json({ message: "Queue is closed" });
    }

    // ❌ Prevent duplicate join
    const existingToken = await Token.findOne({
      queue: req.params.id,
      user: req.user._id,
      status: { $in: ["waiting", "serving"] },
    });

    if (existingToken) {
      return res.status(400).json({
        message: "You already joined this queue",
      });
    }

    const lastToken = await Token.findOne({
      queue: req.params.id,
    }).sort({ tokenNumber: -1 });

    const tokenNumber = lastToken ? lastToken.tokenNumber + 1 : 1;

    const serviceTime = getServiceTime(queue);

    const activeAhead = await Token.countDocuments({
      queue: req.params.id,
      status: { $in: ["waiting", "serving"] },
    });

    const token = await Token.create({
      queue: req.params.id,
      user: req.user._id,
      tokenNumber,
      status: "waiting",
      estimatedWaitTime: activeAhead * serviceTime,
    });

    await recalculateQueueTokens(req.params.id);

    const populatedToken = await Token.findById(token._id).populate(
      "user",
      "name email",
    );

    res.status(201).json(populatedToken);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed to join queue",
    });
  }
};

// ✅ SERVE NEXT TOKEN
const serveNextToken = async (req, res) => {
  try {
    const queue = await Queue.findById(req.params.id);

    if (!queue) {
      return res.status(404).json({ message: "Queue not found" });
    }

    const currentServing = await Token.findOne({
      queue: req.params.id,
      status: "serving",
    });

    if (currentServing) {
      currentServing.status = "completed";
      currentServing.estimatedWaitTime = 0;
      await currentServing.save();
    }

    const nextWaiting = await Token.findOne({
      queue: req.params.id,
      status: "waiting",
    }).sort({ tokenNumber: 1 });

    if (!nextWaiting) {
      await recalculateQueueTokens(req.params.id);
      return res.json({ message: "No waiting tokens left" });
    }

    nextWaiting.status = "serving";
    nextWaiting.estimatedWaitTime = 0;
    await nextWaiting.save();

    queue.currentServingToken = nextWaiting.tokenNumber;
    await queue.save();

    await recalculateQueueTokens(req.params.id);

    res.json({
      message: "Next token is now serving",
      token: nextWaiting,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed to serve next token",
    });
  }
};

// ✅ UPDATE TOKEN STATUS
const updateTokenStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const token = await Token.findById(req.params.id);

    if (!token) {
      return res.status(404).json({ message: "Token not found" });
    }

    token.status = status;

    if (["serving", "completed", "cancelled"].includes(status)) {
      token.estimatedWaitTime = 0;
    }

    await token.save();

    await recalculateQueueTokens(token.queue);

    res.json({
      message: "Token status updated successfully",
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed to update token status",
    });
  }
};

// ✅ DELETE TOKEN (AUTO SHIFT FIX)
const deleteToken = async (req, res) => {
  try {
    const token = await Token.findById(req.params.id);

    if (!token) {
      return res.status(404).json({ message: "Token not found" });
    }

    const queueId = token.queue;

    await Token.findByIdAndDelete(req.params.id);

    await recalculateQueueTokens(queueId);

    res.json({ message: "Token deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed to delete token",
    });
  }
};

// ✅ DELETE QUEUE
const deleteQueue = async (req, res) => {
  try {
    const queue = await Queue.findById(req.params.id);

    if (!queue) {
      return res.status(404).json({ message: "Queue not found" });
    }

    await Token.deleteMany({ queue: req.params.id });
    await Queue.findByIdAndDelete(req.params.id);

    emitQueueUpdate(req.params.id);

    res.json({ message: "Queue deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed to delete queue",
    });
  }
};

module.exports = {
  setSocketInstance,
  createQueue,
  getQueues,
  getQueueDetails,
  joinQueue,
  serveNextToken,
  updateTokenStatus,
  deleteToken,
  deleteQueue,
};
