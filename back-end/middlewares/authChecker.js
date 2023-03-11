import jwt from "jsonwebtoken";

/*
Authorization: Bearer <token>
Get token from header, verifies it and gets the user id
from it, pass user id value to res.locals for the following
middlewares and controllers to use.
*/

export default function authChecker(req, res, next) {

  // Parse the header to get the token.
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ "error": "Login before proceeding." });
  }

  // Verify token to get the user id.
  // Pass id to res.locals
  try {
    const decoded = jwt.verify(token, process.env.APP_TOKEN_SECRET);
    res.locals.userID = decoded.id;
    return next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token." })
  }

}
