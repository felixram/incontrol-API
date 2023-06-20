const express = require("express");
const router = express.Router();

const {
  getAllBills,
  getBill,
  createBill,
  updateBill,
  deleteBill,
} = require("../controllers/bill");

router.route("/").get(getAllBills).post(createBill);
router.route("/:id").get(getBill).patch(updateBill).delete(deleteBill);

module.exports = router;
