import mongoose from "mongoose";

const issueSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    status: {
      type: String,
      enum: ["Todo", "In Progress", "Done"],
      default: "Todo"
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium"
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true
    },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    dueDate: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

// 🔹 Compound index (good for filtering)
issueSchema.index({ project: 1, status: 1 });

const Issue = mongoose.model("Issue", issueSchema);

export default Issue;