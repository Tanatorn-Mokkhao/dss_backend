const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    dataTable: [
      {
        nameProject: { type: String, required: true },
        headProject: [],
        dataProject: [{}],
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("project", projectSchema);
