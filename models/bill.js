const mongoose = require("mongoose");

const BillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A bill name must be provided"],
    },
    item: [
      {
        name: {
          type: String,
          required: [true, "A item name must be provided"],
        },
        quantity: {
          type: Number,
          minlength: 1,
          default: 1,
        },
        price: {
          type: Number,
          required: [true, "A price must be provided"],
          default: 0.0,
        },
      },
    ],
    tax: {
      type: Number,
      default: 0.0,
    },
    tip: {
      type: Number,
      default: 0.0,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    ccFee: {
      type: Number,
      default: 0.0,
    },
    imgURL: {
      type: String,
    },
    status: {
      type: String,
      enum: {
        values: ["Pending", "Paid", "Canceled"],
        message: "{VALUE} is not supported",
      },
      default: "Pending",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "An user must be provided"],
    },
    participants: {
      type: [mongoose.Types.ObjectId],
      ref: "User",
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bill", BillSchema);
