import express from "express";
import { PostModel } from "../Models/PostModel.js";

// TODO : use UserModel to send author name when getting a single Post.
import { UserModel } from "../Models/UserModel.js";

const router = express.Router();

// Send only the data needed for displaying the posts on the /posts page.
// At most 6, sorted from newest to oldest.
router.get("/posts", async (req, res) => {
  const posts = [];
  const postsData = await PostModel.find().sort({ date: "desc" }).limit(6);

  postsData.forEach(({ _id, author, title, image, date, likedBy, comments }) => {
    console.log("postsRoute :");
    console.log(likedBy);
    console.log(author);

    posts.push({
      id: _id,
      title,
      image,
      date,
      likeCount: likedBy.length,
      commentsCount: comments.length,
      likedByUser: likedBy.includes(author)
    });
  });

  return res.status(200).json({ posts });
});

// At most 6 posts, sorted from newest to oldest, tag is equal to
// the :tag string parameter.
router.get("/posts/:tag", async (req, res) => {
  const posts = [];
  const postsData = await PostModel.find({ tag: req.params.tag }).sort({ date: "desc" }).limit(6);

  postsData.forEach(({ _id, title, author, image, date, likedBy, comments }) => {
    posts.push({
      id: _id,
      title,
      image,
      date,
      likeCount: likedBy.length,
      commentsCount: comments.length,
      likedByUser: likedBy.includes(author)
    });
  });

  return res.status(200).json({ posts });
});


// Create a post
router.post("/posts", async (req, res) => {
  const { title, content, image, tag } = req.body;

  const newPost = new PostModel({
    author: res.locals.userID,
    title,
    content,
    image,
    tag,
  });

  try {
    const doc = await newPost.save();
    // console.log("Post created:", doc);
    return res.status(201).json({ message: "Post created." });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: "Server error." });
  }
});

// Like a post
router.post("/posts/:id/like", async (req, res) => {
  const postDoc = await PostModel.findById(req.params.id);
  console.log("Post to like:", postDoc);
  console.log(postDoc.likedBy);

  const alreadyLiked = postDoc.likedBy.includes(res.locals.userID);
  // If author already liked this post, do nothing.
  if (alreadyLiked) {
    return res.status(200).json({ message: "Already liked." });
  } else { // else, push user id in likedby and save
    postDoc.likedBy.push(res.locals.userID);
    try {
      await postDoc.save();
      return res.status(200).json({ message: "Post liked" });
    } catch (err) {
      console.error(err);
      return res.status(500)._construct({ error: "Server error." });
    }
  }
});

// Unlike a post
router.post("/posts/:id/unlike", async (req, res) => {
  const postDoc = await PostModel.findById({ _id: req.params.id });
  console.log("Post to unlike:", postDoc);

  const index = postDoc.likedBy.indexOf(res.locals.userID);
  // If author already liked the post, do nothing
  if (index === -1) {
    return res.status(200).json({ message: "Already unliked." });
  } else { // else remove the author from likes
    postDoc.likedBy.splice(index, 1);
    try {
      await postDoc.save();
      return res.status(200).json({ message: "Post unliked" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Server error." });
    }
  }
});

export default router;