import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel } from "../Models/UserModel.js";

export default async function loginController(req, res) {
  // TODO: These have to be validated.
  const { email, password } = req.body;

  // TODO: Put this in a validator function with custom().
  const user = await UserModel.findOne({ email });
  if (!user) {
    return res.status(404).json({
      errors: [
        {
          value: email,
          msg: "This email doesn't exist.",
          param: "email",
          location: "body",
        }
      ]
    });
  }

  // Verify password
  const passwordIsValid = bcrypt.compareSync(password, user.password);

  if (!passwordIsValid) {
    return res.status(401).json({
      errors: [
        {
          value: "",
          msg: "Invalid password.",
          param: "password",
          location: "body",
        }
      ]
    });
  }

  // Make a token by hashing the user id
  const id = user._id.toString();
  const token = jwt.sign(
    { id },
    process.env.APP_TOKEN_SECRET,
    {
      // Seconds
      expiresIn: 60 * 30
    }
  );

  // Send the token with the user data
  return res.status(200).json({
    token,
    user: {
      gender: user.gender,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      photo: user.photo,
      category: user.category,
      isAdmin: user.isAdmin,
    }
  });
}
