const Project = require("../model/project");
const Chart = require("../model/chart");
exports.getAllTable = (req, res) => {
  Project.findOne({ user: req.user._id })
    .select("dataTable.nameProject dataTable._id")
    .exec((error, data) => {
      if (error) return res.status(400).json({ error });
      if (data) {
        return res.status(200).json({ data });
      } else {
        return res.status(400).json({ error: "not found" });
      }
    });
};

exports.getAllChart = (req, res) => {
  Chart.findOne({ user: req.user._id })
    .select("dataProject")
    .exec((error, data) => {
      if (error) return res.status(400).json({ error });
      if (data) {
        return res.status(200).json({ data });
      } else {
        return res.status(400).json({ error: "not found" });
      }
    });
};
