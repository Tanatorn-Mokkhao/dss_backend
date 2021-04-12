const express = require("express");
const { testdeploy } = require("../controller/testdeploy");
const router = express.Router();

router.get("/test/deploy", testdeploy);

module.exports = router;
