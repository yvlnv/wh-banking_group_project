const { Router } = require("express");

// creating index endpoints
const IndexController = Router();

IndexController.route("/").get(async () => {
  if (req.oidc.user) {
    res.redirect("user_page");
  } else {
    res.render("home", {});
  }
});
