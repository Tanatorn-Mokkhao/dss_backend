const Project = require("../model/project");
const Chart = require("../model/chart.js");
const mongoose = require("mongoose");
exports.createProject = (req, res) => {
  const { payload } = req.body;
  // console.log(payload);
  Project.findOne({ user: req.user._id }).exec((error, project) => {
    if (error) return res.status(400).json({ error });
    if (project) {
      Project.findOne({
        user: req.user._id,
        "dataTable.nameProject": payload.dataTable.nameProject,
      }).exec((error, project) => {
        if (error) return res.status(400).json({ error });
        if (project) {
          return res.status(400).json({ error: "ชื่องานใช้ไปเเล้ว" });
        }
        Project.findOneAndUpdate(
          { user: req.user._id },
          { $push: { dataTable: payload.dataTable } },
          { new: true }
        ).exec((error, data) => {
          if (error) return res.status(400).json({ error });
          if (data) {
            return res.status(200).json({ data });
          }
        });
      });
    } else {
      const add = new Project({
        user: req.user._id,
        dataTable: payload.dataTable,
      });
      add.save((error, data) => {
        if (error) return res.status(400).json({ error });
        if (data) {
          return res.status(200).json({ data });
        }
      });
    }
  });
};

exports.getElementByLabel = (req, res) => {
  const { payload } = req.body;
  Project.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(`${req.user._id}`),
      },
    },
    {
      $unwind: "$dataTable",
    },
    {
      $match: {
        "dataTable._id": new mongoose.Types.ObjectId(`${payload.tableId}`),
      },
    },
    {
      $project: {
        _id: null,
        dataTable: `$dataTable.dataProject.${payload.labelX}`,
      },
    },
    {
      $unwind: "$dataTable",
    },
    {
      $group: {
        _id: "$dataTable",
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]).exec((error, data) => {
    if (error) return res.status(400).json({ error });
    if (data) {
      return res.status(200).json({ data });
    }
  });
};

const mergArray = (dataArray) => {
  let a3;
  for (i = 1; i < dataArray.length; i++) {
    if (i == 1) {
      a3 = dataArray[0].map((t1) => ({
        ...t1,
        ...dataArray[1].find((t2) => t2._id === t1._id),
      }));
    } else {
      a3 = dataArray[i].map((t1) => ({
        ...t1,
        ...a3.find((t2) => t2._id === t1._id),
      }));
    }
  }
  return a3;
};

const selectElement = (element, data) => {
  let keep;
  keep = data.filter((a1) => element.includes(a1._id));
  // console.log(keep);
  return keep;
};

exports.queryElementLabel = async (req, res) => {
  const {
    tableId,
    labelX,
    dataArrayY,
    projectId,
    elementLabelX,
  } = req.body.payload;
  if (dataArrayY.length > 1) {
    let keep = [];
    try {
      for (let index of dataArrayY) {
        keep.push(
          await Project.aggregate([
            {
              $match: {
                user: new mongoose.Types.ObjectId(`${req.user._id}`),
              },
            },
            {
              $unwind: "$dataTable",
            },
            {
              $match: {
                "dataTable._id": new mongoose.Types.ObjectId(`${tableId}`),
              },
            },
            {
              $project: { _id: null, dataTable: `$dataTable.dataProject` },
            },
            {
              $unwind: "$dataTable",
            },
            {
              $group: {
                _id: `$dataTable.${labelX}`,
                [index.dataY + ` ${index.type}`]: {
                  ["$" + index.type]: `$dataTable.${index.dataY}`,
                },
                // [index]: { $sum: `$dataTable.${index}` },
              },
            },
            {
              $sort: { _id: 1 },
            },
          ])
        );
      }

      let dataArray = mergArray(keep);

      await Chart.findOneAndUpdate(
        { user: req.user._id, "dataProject._id": projectId },
        {
          $set: {
            "dataProject.$.saveState": {
              dataX: labelX,
              dataY: dataArrayY,
              element: elementLabelX,
            },
          },
        },
        { new: true }
      );
      let dataElement = selectElement(elementLabelX, dataArray);
      return res.status(200).json({ dataElement });
    } catch (err) {
      return res.status(400).json({ err });
    }
  } else {
    try {
      Project.aggregate([
        {
          $match: {
            user: new mongoose.Types.ObjectId(`${req.user._id}`),
          },
        },
        {
          $unwind: "$dataTable",
        },
        {
          $match: {
            "dataTable._id": new mongoose.Types.ObjectId(`${tableId}`),
          },
        },
        {
          $project: { _id: null, dataTable: `$dataTable.dataProject` },
        },
        {
          $unwind: "$dataTable",
        },
        {
          $group: {
            _id: `$dataTable.${labelX}`,
            [dataArrayY[0].dataY + ` ${dataArrayY[0].type}`]: {
              // $sum: `$dataTable.${dataArrayY[0]}`
              ["$" + dataArrayY[0].type]: `$dataTable.${dataArrayY[0].dataY}`,
            },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ]).exec(async (error, dataArray) => {
        if (error) return res.status(400).json({ error });
        if (dataArray) {
          await Chart.findOneAndUpdate(
            { user: req.user._id, "dataProject._id": projectId },
            {
              $set: {
                "dataProject.$.saveState": {
                  dataX: labelX,
                  dataY: dataArrayY,
                  element: elementLabelX,
                },
              },
            },
            { new: true }
          );
          let dataElement = selectElement(elementLabelX, dataArray);

          return res.status(200).json({ dataElement });
        }
      });
    } catch (err) {
      return res.status(400).json({ err });
    }
  }
};
