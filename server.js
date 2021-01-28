const express = require("express");
const app = express();
require("dotenv").config({ path: "./" });
const { auth } = require("express-openid-connect");
const Handlebars = require("handlebars");
const expressHandlebars = require("express-handlebars");
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
const { User, sequelize } = require("./models");
const handlebars = expressHandlebars({
  handlebars: allowInsecurePrototypeAccess(Handlebars),
});
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.engine("handlebars", handlebars);
app.set("view engine", "handlebars");

const authSettings = {
  routes: {
    login: false,
  },
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH_SECRET,
  baseURL: "http://localhost:3000",
  clientID: process.env.AUTH_CLIENT_ID,
  issuerBaseURL: process.env.AUTH_BASE_URL,
};

app.use(auth(authSettings));

app.get("/", (req, res) => {
  if (req.oidc.user) {
    res.redirect("user_page");
  } else {
    res.render("home");
  }
});

app.get("/login", (req, res) => {
  res.oidc.login({ returnTo: "/user_page" });
});

app.get("/user_page", async (req, res) => {
  console.log(req.oidc.user);
  res.render("user_page");
});

app.listen(3000, () => {
  sequelize.sync().then(() => console.log("Running..."));
});
