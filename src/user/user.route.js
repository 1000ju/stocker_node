// src/user/user.route.js
const express = require("express");
const router = express.Router();
const userController = require("./user.controller");

router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.post("/logout", userController.logout);

module.exports = router;
