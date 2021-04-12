const mongoose = require("mongoose");

const dashBoardSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    dashboardProject: [
      {
        projectName: { type: String, required: true },
        slug: { type: String, required: true },
        chartList: {
          chart1: { type: mongoose.Schema.Types.ObjectId, ref: "chart" },
          chart2: { type: mongoose.Schema.Types.ObjectId, ref: "chart" },
          chart3: { type: mongoose.Schema.Types.ObjectId, ref: "chart" },
          chart4: { type: mongoose.Schema.Types.ObjectId, ref: "chart" },
        },
        updateAt: { type: Date },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("dashboard", dashBoardSchema);
