import express from "express";
const router = express.Router();

router.get("/comments", (req, res) => {
  res.json({ "message": "All the comments." });
});

export default router;