require("dotenv").config();

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
app.use(express.json());

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
