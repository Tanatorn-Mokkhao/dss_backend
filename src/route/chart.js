const express = require("express");
const { requiresignin } = require("../common-middleware");
const {
  createChart,
  getChart,
  getQuery,
  testSaveState,
} = require("../controller/chart");
const router = express.Router();

router.post("/create/chart", requiresignin, createChart);
router.get("/get/chart/:slug", requiresignin, getChart);
router.post("/getQuery", requiresignin, getQuery);
router.post("/updateState", requiresignin, testSaveState);
module.exports = router;
