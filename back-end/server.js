import * as dotenv from "dotenv";
// Put .env file variables in process.env
dotenv.config();
import mongoose from "mongoose";
import express from "express";
import cors from "cors";

import authChecker from "./middlewares/authChecker.js";
import usersRoute from "./routes/usersRoute.js";
import postsRoute from "./routes/postsRoute.js";
import commentsRoute from "./routes/commentsRoute.js";
import loginController from "./controllers/loginController.js";

const { APP_HOSTNAME, APP_PORT } = process.env;

// Allow front-end to use back-end
const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200,
}

// =====================================================================
// MongoDB initialization
// =====================================================================

/*
https://stackoverflow.com/questions/69957163/mongooseserverselectionerror-connect-econnrefused-127017-in-node-v17-and-mon
https://dba.stackexchange.com/questions/173781/bind-mongodb-to-ipv4-as-well-as-ipv6/302609#302609
If it doesn't work with localhost, change /bin/mongod.cfg file like so :

# network interfaces
net:
  ipv6: true
  port: 27017
  bindIpAll: true

(Or use 127.0.0.1 instead of localhost.)
*/

mongoose
  .connect(`mongodb://${APP_HOSTNAME}:27017/tpblog`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`Mongo connected to : mongodb://${APP_HOSTNAME}:27017/tpblog`);
    // Start server after mongodb connection
    init();
  })
  .catch(err => console.error("Mongo error.", err));


// =====================================================================
// App initialization
// =====================================================================

async function init() {
  const app = express();

  // ===================================================================
  // App middlewares
  // ===================================================================

  app.use(cors(corsOptions));
  app.use(express.json());

  // ===================================================================
  // App routes
  // ===================================================================

  // Login before checking if user is authenticated.
  app.post("/login", loginController);

  // Check if user is authenticated
  app.use(authChecker);

  app.get("/", (req, res) => {
    res.json({ "message": "Wow, it works!" });
  });

  app.use(usersRoute);
  app.use(postsRoute);
  app.use(commentsRoute);

  // If no route found
  app.use((req, res) => {
    res.status(404).json({ "error": "Invalid route." })
  })

  // Handle errors
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ "message": "Something broke!" });
  })

  // ===================================================================
  // App start
  // ===================================================================

  app.listen(APP_PORT, () => {
    console.log(`App listening at http://${APP_HOSTNAME}:${APP_PORT}`);
  });
}
