const mongoose = require("mongoose");

const queueSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Hospital",
        "Bank",
        "College Office",
        "Government Office",
        "Salon",
        "Clinic",
        "Service Center",
      ],
    },
    avgServiceTime: {
      type: Number,
      required: true,
      default: 5,
    },
    isOpen: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    currentServingToken: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Queue", queueSchema);
