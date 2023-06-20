const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "a name must be provided"],
  },
  lastname: {
    type: String,
    required: [true, "a lastname must be provided"],
  },
  birthDate: {
    type: Date,
    required: [true, "a date must be provided"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "a email must be provided"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      ,
      "please provide a valid email",
    ],
  },
  password: {
    type: String,
    required: [true, "a password must be provided"],
    minLength: 6,
  },
  rol: {
    type: String,
    enum: {
      values: ["Admin", "User"],
    },
    default: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

//set pre middleware to hash password with bcryptjs

UserSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

//set Method to create JWT for the actual user.

UserSchema.methods.createJWT = function () {
  return jwt.sign(
    {
      userId: this._id,
      name: this.name,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
};
//check if password match with db
UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};
module.exports = mongoose.model("User", UserSchema);
