import mongoose from "mongoose";


const CommentSchema = new mongoose.Schema(
  {
    //TODO
  }
);

export const CommentModel = mongoose.model("comments", CommentSchema);