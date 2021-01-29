const { Router } = require("express");
const
const { Model } = require("sequelize");

let testAccount = await nodemailer.createTestAccount();

const FriendController = Router();

FriendController.route("/friends").get(async (req, res) => {});

FriendController.route("/friends/invite/:token").get(async (req, res) => {});

