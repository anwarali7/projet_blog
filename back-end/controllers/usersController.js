import { UserModel } from "../Models/UserModel.js";
import bcrypt from "bcrypt";

export async function createUser(req, res) {
  const {
    gender,
    firstname,
    lastname,
    email,
    password,
    photo, // Has to be a file
    category, // "JS" or "PHP"
  } = req.body;

  // Hash password before storing to db
  const saltRounds = 10;
  const hashedPassword = bcrypt.hashSync(password, saltRounds);

  const newUser = new UserModel({
    gender,
    firstname,
    lastname,
    email,
    password: hashedPassword,
    photo,
    category,
  });

  try {
    const doc = await newUser.save();
    // console.log("User created:", doc);
    return res.status(201).json({ message: "User created." });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: "Server error." });
  }
}