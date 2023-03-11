// https://express-validator.github.io/docs/check-api/
import { body, validationResult } from "express-validator";
import { UserModel } from "../../Models/UserModel.js";

// Checks if all fields are valid:
// Email is email 📧, password is strong 💪,
// user doesn't already exist 👥.
export const createUser = [
  body('gender')
    .matches(/^male$|^female$/)
    .withMessage("Gender has to be 'male' or 'female'.")
    .bail(),
  body('firstname').isString()
    .withMessage("Firstname has to be a string.")
    .trim().escape().not().isEmpty()
    .withMessage("Firstname cannot be empty.")
    .bail(),
  body('lastname').isString()
    .withMessage("Lastname has to be a string.")
    .trim().escape().not().isEmpty()
    .withMessage("Lastname cannot be empty.")
    .bail(),
  body('email').trim().isEmail().normalizeEmail({ gmail_remove_dots: false })
    .withMessage("Invalid email address.")
    .bail()
    .custom((value) => {
      return UserModel.findOne({ email: value })
        .then(user => {
          if (user) throw new Error("This email is already in use.");
        });
    })
    .withMessage("This email is already in use.")
    .bail(),
  body('password').isStrongPassword()
    .withMessage("Invalid password.")
    .bail(),
  body('photo').isURL()
    .withMessage("Has to be an url to an image.")
    .bail(),
  body('category').trim().matches(/^JS$|^PHP$|^$/)
    .withMessage("Category has to be 'JS', 'PHP' or empty string.")
    .bail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
];

