import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true
    },
    title: { type: String, required: true },
    content: String,
    image: String,
    date: { type: Date, default: Date.now },
    tag: String,
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "comments" }],
    likedBy: [{
      type: mongoose.Schema.Types.ObjectID,
      ref: "users"
    }]
     
  }
);

export const PostModel = mongoose.model("posts", PostSchema);