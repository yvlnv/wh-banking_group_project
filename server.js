const express = require("express");
const { auth, requiresAuth } = require("express-openid-connect");
const Handlebars = require("handlebars");
const expressHandlebars = require("express-handlebars");
const fs = require("fs");

const Transaction = require("./transaction");
const { User, sequelize } = require("./models");

// loading dotenv
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
const { verify, decode } = require("jsonwebtoken");
const { Verify } = require("crypto");

const handlebars = expressHandlebars({
  handlebars: allowInsecurePrototypeAccess(Handlebars),
});

// creating auth settings
const authSettings = {
  routes: {
    login: false,
  },
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH_SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.AUTH_CLIENT_ID,
  issuerBaseURL: process.env.AUTH_BASE_URL,
};

// creatign app
const app = express();

// setting view engine
app.engine("handlebars", handlebars);
app.set("view engine", "handlebars");

// setting middleware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(auth(authSettings));

// home page
app.get("/", (req, res) => {
  if (req.oidc.user) {
    res.redirect("user_page");
  } else {
    res.render("home");
  }
});

// login endpoint
app.get("/login", (req, res) => {
  res.oidc.login({ returnTo: "/user_page" });
});

// user page
app.get("/user_page", requiresAuth(), async (req, res) => {
  const users = await User.findOrCreate({
    where: {
      email: req.oidc.user.email,
    },
    defaults: {
      name: req.oidc.user.name,
      email: req.oidc.user.email,
      balance: 0,
    },
  });
  // because findOrCreate returns an array
  const user = users[0];
  res.render("user_page", { user });
});

// friend invite form
app.post("/user_page/invite", async (req, res) => {
  res.redirect("/user_page");
});

// topup balance
app.post("/topup", async (req, res) => {
  const toAdd = req.body.amount;
  if (toAdd > 0) {
    const user = await User.findOne({
      where: {
        email: req.oidc.user.email,
      },
    });
    const newBalance = (user.balance += parseFloat(toAdd));
    user.update({ balance: newBalance.toFixed(2) });
  }
  res.redirect("/user_page");
});

// idk
app.post("/invite", (req, res) => {
  res.redirect("/user_page");
});

// pay page?
app.get("/pay", (req, res) => {
  res.render("pay");
});

// pay other
app.post("/pay", (req, res) => {
  let user = 1;
});

// getting public key
app.get("/api/pay", (req, res) => {
  fs.readFile("./public-key.pem", (err, data) => {
    res.status(200).send(data.toString()).end();
  });
});

// accepting payment
app.post("/api/pay", express.text(), async (req, res) => {
  let token = req.body;

  let tokenData = decode(token);
  tokenData = verify();
});

// friend invite?
app.get("/friends/invite", (req, res) => {});

// friend invite?
app.post("/friend/invite");

// run application
app.listen(process.env.PORT, () => {
  sequelize.sync(() => {
    console.log("Banking app running on port", process.env.PORT);
  });
});
