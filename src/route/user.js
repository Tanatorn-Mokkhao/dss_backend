const express = require("express");
const { signup, signin, signout } = require("../controller/user");
const { validationsignin, isRequestValidated } = require("../validator/auth");

const router = express.Router();

router.post("/user/signup", signup);

router.post("/user/signin", validationsignin, isRequestValidated, signin);

router.post("/user/signout", signout);

module.exports = router;
