const mongoose = require("mongoose");

const chartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    dataProject: [
      {
        nameTable: { type: String, required: true },
        slug: { type: String, required: true },
        projectName: { type: String, required: true },
        chartType: { type: String, required: true },
        saveState: {
          dataX: { type: String },
          dataY: [],
          element: [],
        },

        updateAt: { type: Date },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("chart", chartSchema);
