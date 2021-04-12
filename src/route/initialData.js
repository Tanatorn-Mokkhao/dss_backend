const express = require("express");
const { requiresignin } = require("../common-middleware");
const { getAllTable, getAllChart } = require("../controller/initialData");
const router = express.Router();

router.get("/get/table", requiresignin, getAllTable);

router.get("/get/chart", requiresignin, getAllChart);
module.exports = router;
