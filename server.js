const express = require("express");
const app = express();
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

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

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
    const users = await User.findOrCreate({
        where: {
            email : req.oidc.user.email
        },
        defaults: {
            name: req.oidc.user.name,
            email: req.oidc.user.email,
            balance: 0
        }
    })
    // because findOrCreate returns an array
    const user = users[0]
    res.render("user_page", {user});
});

app.post("/topup", (req, res) => {
    res.redirect("/user_page")
});

app.post("/invite", (req, res) => {
    res.redirect("/user_page")
});

app.get("/pay", (req, res) => {
    res.render("pay");
});

app.listen(process.env.PORT, () => {
    sequelize.sync(() => {
        console.log('Banking app running on port', process.env.PORT)
    })
})
