const { Router } = require("express");

// defining transaction endpoint Controller
const TransactionController = Router();

// external actions
TransactionController.route("/pay").post(async (req, res) => {});

module.exports = TransactionController;
