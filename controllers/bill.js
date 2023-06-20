const Bill = require("../models/bill");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllBills = async (req, res) => {
  const bills = await Bill.find({ createdBy: req.user.userId }).sort(
    "createdAt"
  );
  const sharedBills = await Bill.find({ participants: req.user.userId }).sort(
    "createdAt"
  );

  res
    .status(StatusCodes.OK)
    .json({ bills, sharedBills, count: bills.length + sharedBills.length });
};

const createBill = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const bill = await Bill.create(req.body);
  res.status(StatusCodes.CREATED).json({ bill });
};

const getBill = async (req, res) => {
  const {
    user: { userId },
    params: { id: billId },
  } = req;

  const bill = await Bill.findOne({
    _id: billId,
    createdBy: userId,
  });

  if (!bill) {
    throw new NotFoundError(`No Bill with ${billId} found.`);
  }
  res.status(StatusCodes.OK).json({ bill });
};

const updateBill = async (req, res) => {
  const {
    body: { name, item, status, date, participants },
    user: { userId },
    params: { id: billId },
  } = req;

  if (!name && !item && !status && !date && !participants) {
    throw new BadRequestError("Please, fill all the required fields.");
  }

  const bill = await Bill.findOneAndUpdate(
    {
      _id: billId,
      createdBy: userId,
    },
    req.body,
    { new: true, runValidators: true }
  );

  if (!bill) {
    throw new NotFoundError("Bill not found.");
  }

  res.status(StatusCodes.OK).json({ bill });
};

const deleteBill = async (req, res) => {
  const {
    user: { userId },
    params: { id: billId },
  } = req;

  const bill = await Bill.findOneAndRemove({ _id: billId, createdBy: userId });

  if (!bill) {
    throw new NotFoundError(`No bill with id ${billId}`);
  }

  res.status(StatusCodes.OK).send("Deleted");
};

module.exports = {
  getAllBills,
  getBill,
  createBill,
  updateBill,
  deleteBill,
};
