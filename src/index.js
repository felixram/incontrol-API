require("dotenv").config();

//security packages
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");

//async errors
require("express-async-errors");

const express = require("express");
const app = express();

//middleware to autenticate data
const authUser = require("../middleware/authentication");

const authRouter = require("../routes/auth");
const billsRouter = require("../routes/bill");

const errorHandleMiddleware = require("../middleware/error-handler");
const notFound = require("../middleware/not-found");

const connectDB = require("../db/connect");
//middlewares

app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, //15 minutes
    max: 100, //limit each IP requests per windowMs
  })
);

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

//routes

app.use("/", (req, res) => {
  res.send("incontrol api");
});

app.use("/api/v1/auth", authRouter);

app.use("/api/v1/bills", authUser, billsRouter);

//error handler middlewares
app.use(errorHandleMiddleware);
app.use(notFound);
//connection

const port = process.env.PORT || 5500;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, console.log(`server is listening on port ${port}`));
  } catch (error) {
    console.log(error);
  }
};

start();
