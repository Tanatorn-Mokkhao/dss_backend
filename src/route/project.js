const express = require("express");
const { requiresignin } = require("../common-middleware");
const {
  createProject,
  getElementByLabel,
  queryElementLabel,
} = require("../controller/project");
const router = express.Router();

router.post("/create/project", requiresignin, createProject);
router.post("/get/dataByLabel", requiresignin, getElementByLabel);
router.post("/query/elementLabel", requiresignin, queryElementLabel);

module.exports = router;
