import mongoose from "mongoose";

// TODO : Should add a lot more validation, even if the data is validated
// when received on the server.
const UserSchema = new mongoose.Schema(
  {
    gender: String,
    firstname: {type: String, required: true},
    lastname: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    photo: String,
    category: String,
    isAdmin: Boolean,
  }
);

export const UserModel = mongoose.model("users", UserSchema);