const express = require("express");
const { requiresignin } = require("../common-middleware");
const {
  getAllChart,
  createDashboard,
  updateStateDashBoard,
  getChatBylist,
  queryChart,
  getDashBoard,
  getAllDashBoard,
} = require("../controller/dashboard");
const router = express.Router();

router.get("/dashboard/getallChart", requiresignin, getAllChart);
router.get("/getall/dashboardProject", requiresignin, getAllDashBoard);
router.post("/save/dashbaord", requiresignin, createDashboard);
router.post("/update/dashbaord", requiresignin, updateStateDashBoard);
router.post("/get/chartList/dashboard", requiresignin, getChatBylist);
router.post("/get/getDashBoard/:slug", requiresignin, getDashBoard);
// router.post("/get/querychartList/dashboard", requiresignin, queryChart);
module.exports = router;
