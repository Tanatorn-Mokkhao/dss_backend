const Chart = require("../model/chart.js");
const slugify = require("slugify");
const Project = require("../model/project");
const mongoose = require("mongoose");
const arrMerge = require("array-objects-merge");
// npm i array-objects-merge

exports.createChart = (req, res, next) => {
  const { payload } = req.body;
  console.log(payload);
  Chart.findOne({ user: req.user._id }).exec((error, data) => {
    if (error) return res.status(400).json({ error });
    if (data) {
      Chart.findOne({
        user: req.user._id,
        "dataProject.projectName": payload.dataProject.projectName,
      }).exec((error, data) => {
        if (error) return res.status(400).json({ error });
        if (data) {
          return res.status(400).json({ error: "ชื่องานใช้ไปเเล้ว" });
        }
        payload.dataProject.updateAt = new Date();
        payload.dataProject.slug = slugify(payload.dataProject.projectName);
        Chart.findOneAndUpdate(
          { user: req.user._id },
          { $push: { dataProject: payload.dataProject } },
          { new: true }
        ).exec((error, data) => {
          if (error) return res.status(400).json({ error });
          if (data) {
            return res.status(200).json({ data });
          }
        });
      });
    } else {
      payload.dataProject.updateAt = new Date();
      payload.dataProject.slug = slugify(payload.dataProject.projectName);
      const add = new Chart({
        user: req.user._id,
        dataProject: payload.dataProject,
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

exports.getChart = (req, res) => {
  const { slug } = req.params;
  // console.log(slug);
  Chart.findOne(
    { user: req.user._id },
    { dataProject: { $elemMatch: { projectName: slug } } }
  ).exec((error, data) => {
    if (error) return res.status(400).json({ error });
    if (data.dataProject.length > 0) {
      const query = data.dataProject[0].nameTable;
      Project.findOne(
        { user: req.user._id },
        { dataTable: { $elemMatch: { _id: query } } }
      ).exec((error, table) => {
        if (error) return res.status(400).json({ error });
        if (table) {
          return res.status(200).json({ table, data });
        }
      });
    } else {
      return res.status(400).json({ error: "not found" });
    }
  });
};
// exports.getQuery = async (req, res) => {
//   const { tableId, labelX, dataArrayY } = req.body.payload;
//   if (dataArrayY.length > 1) {
//     let keep = [];
//     try {
//       for (let index of dataArrayY) {
//         keep.push(
//           await Project.aggregate([
//             {
//               $match: {
//                 user: new mongoose.Types.ObjectId(`${req.user._id}`),
//               },
//             },
//             {
//               $unwind: "$dataTable",
//             },
//             {
//               $match: {
//                 "dataTable._id": new mongoose.Types.ObjectId(`${tableId}`),
//               },
//             },
//             {
//               $project: { _id: null, dataTable: `$dataTable.dataProject` },
//             },
//             {
//               $unwind: "$dataTable",
//             },
//             {
//               $group: {
//                 _id: `$dataTable.${labelX}`,
//                 [index]: { $sum: `$dataTable.${index}` },
//               },
//             },
//           ])
//         );
//       }
//       let dataArray = mergArray(keep);

//       return res.status(200).json({ dataArray });
//     } catch (err) {
//       return res.status(400).json({ err });
//     }
//   } else {
//     try {
//       Project.aggregate([
//         {
//           $match: {
//             user: new mongoose.Types.ObjectId(`${req.user._id}`),
//           },
//         },
//         {
//           $unwind: "$dataTable",
//         },
//         {
//           $match: {
//             "dataTable._id": new mongoose.Types.ObjectId(`${tableId}`),
//           },
//         },
//         {
//           $project: { _id: null, dataTable: `$dataTable.dataProject` },
//         },
//         {
//           $unwind: "$dataTable",
//         },
//         {
//           $group: {
//             _id: `$dataTable.${labelX}`,
//             [dataArrayY[0]]: { $sum: `$dataTable.${dataArrayY[0]}` },
//           },
//         },
//       ]).exec((error, dataArray) => {
//         if (error) return res.status(400).json({ error });
//         if (dataArray) {
//           return res.status(200).json({ dataArray });
//         }
//       });
//     } catch (err) {
//       return res.status(400).json({ err });
//     }
//   }
// };

const mergArray = (dataArray) => {
  // console.log(dataArray);
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
  // console.log(a3);
  return a3;
};

// exports.getQuery = async (req, res) => {
//   const { tableId, labelX, dataArrayY, projectId } = req.body.payload;
//   if (dataArrayY.length > 1) {
//     let keep = [];
//     try {
//       for (let index of dataArrayY) {
//         keep.push(
//           await Project.aggregate([
//             {
//               $match: {
//                 user: new mongoose.Types.ObjectId(`${req.user._id}`),
//               },
//             },
//             {
//               $unwind: "$dataTable",
//             },
//             {
//               $match: {
//                 "dataTable._id": new mongoose.Types.ObjectId(`${tableId}`),
//               },
//             },
//             {
//               $project: { _id: null, dataTable: `$dataTable.dataProject` },
//             },
//             {
//               $unwind: "$dataTable",
//             },
//             {
//               $group: {
//                 _id: `$dataTable.${labelX}`,
//                 [index]: { $sum: `$dataTable.${index}` },
//               },
//             },
//           ])
//         );
//       }
//       let dataArray = mergArray(keep);

//       await Chart.findOneAndUpdate(
//         { user: req.user._id, "dataProject._id": projectId },
//         {
//           $set: {
//             "dataProject.$.saveState": {
//               dataX: labelX,
//               dataY: dataArrayY,
//             },
//           },
//           $set: {
//             "dataProject.$.updateAt": new Date(),
//           },
//         },
//         { new: true }
//       );

//       return res.status(200).json({ dataArray });
//     } catch (err) {
//       return res.status(400).json({ err });
//     }
//   } else {
//     try {
//       Project.aggregate([
//         {
//           $match: {
//             user: new mongoose.Types.ObjectId(`${req.user._id}`),
//           },
//         },
//         {
//           $unwind: "$dataTable",
//         },
//         {
//           $match: {
//             "dataTable._id": new mongoose.Types.ObjectId(`${tableId}`),
//           },
//         },
//         {
//           $project: { _id: null, dataTable: `$dataTable.dataProject` },
//         },
//         {
//           $unwind: "$dataTable",
//         },
//         {
//           $group: {
//             _id: `$dataTable.${labelX}`,
//             [dataArrayY[0]]: { $sum: `$dataTable.${dataArrayY[0]}` },
//           },
//         },
//       ]).exec(async (error, dataArray) => {
//         if (error) return res.status(400).json({ error });
//         if (dataArray) {
//           await Chart.findOneAndUpdate(
//             { user: req.user._id, "dataProject._id": projectId },
//             {
//               $set: {
//                 "dataProject.$.saveState": {
//                   dataX: labelX,
//                   dataY: dataArrayY,
//                 },
//               },
//               $set: {
//                 "dataProject.$.updateAt": new Date(),
//               },
//             },
//             { new: true }
//           );
//           return res.status(200).json({ dataArray });
//         }
//       });
//     } catch (err) {
//       return res.status(400).json({ err });
//     }
//   }
// };

exports.testSaveState = (req, res) => {
  const { labelX, dataArrayY, projectId } = req.body.payload;
  Chart.findOneAndUpdate(
    { user: req.user._id, "dataProject._id": projectId },
    {
      $set: {
        "dataProject.$.saveState": {
          dataX: labelX,
          dataY: dataArrayY,
        },
      },
      $set: {
        "dataProject.$.updateAt": new Date(),
      },
    },
    { new: true }
  ).exec((error, data) => {
    if (error) return res.status(400).json({ error });
    if (data) {
      return res.status(200).json({ data });
    }
  });
};

exports.getQuery = async (req, res) => {
  const { tableId, labelX, dataArrayY, projectId } = req.body.payload;
  // console.log(dataArrayY);
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
                // $sum: `$dataTable.${index.dataY}`
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
            },
          },
        },
        { new: true }
      );

      return res.status(200).json({ dataArray });
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
              // $avg: `$dataTable.${dataArrayY[0].dataY}`,
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
                },
              },
            },
            { new: true }
          );
          return res.status(200).json({ dataArray });
        }
      });
    } catch (err) {
      return res.status(400).json({ err });
    }
  }
};
