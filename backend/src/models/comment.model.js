import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    issue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Issue",
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    content: {
      type: String,
      required: true
    },
    edited: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;