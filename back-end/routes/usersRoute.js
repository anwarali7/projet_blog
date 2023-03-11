import express from "express";

// Validators to check types, if emails are actually emails...
import * as usersValidator from "../middlewares/validators/usersValidator.js";

// Controllers
import * as usersController from "../controllers/usersController.js";

const router = express.Router();

// Create user, TODO : only allowed for admin.
router.post("/users",
  usersValidator.createUser,
  usersController.createUser
);

// TODO : Show information of user
router.get("/users/:id", (req, res) => {
  res.json({ "message": `Get info on user ${req.params.id}.` });
});

// TODO : Update user info
router.put("/users/:id", (req, res) => {
  res.json({ "message": `Update user ${req.params.id}.` });
});

// TODO : Delete an user
router.delete("/users/:id", (req, res) => {
  res.json({ "message": `Delete user ${req.params.id}.` });
});

export default router;