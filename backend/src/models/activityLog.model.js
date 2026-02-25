import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema(
  {
    issue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Issue",
      required: true
    },
    action: {
      type: String,
      required: true
    },
    previousValue: {
      type: String
    },
    newValue: {
      type: String
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true
    }
  },
  {
    timestamps: true
  }
);

const ActivityLog = mongoose.model("ActivityLog", activityLogSchema);

export default ActivityLog;