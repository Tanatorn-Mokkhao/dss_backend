const Dashboard = require("../model/dashboard");
const Chart = require("../model/chart");
const slugify = require("slugify");
const Project = require("../model/project");
const mongoose = require("mongoose");
exports.getAllChart = (req, res) => {
  Chart.find({ user: req.user._id })
    .select("dataProject")
    .exec((error, data) => {
      if (error) return res.status(400).json({ error });
      if (data) {
        return res.status(200).json({ data });
      }
    });
};

exports.createDashboard = (req, res) => {
  const { payload } = req.body;
  // console.log(payload);
  Dashboard.findOne({ user: req.user._id }).exec((error, data) => {
    if (error) return res.status(400).json({ error });
    if (data) {
      Dashboard.findOne({
        user: req.user._id,
        "dashboardProject.projectName": payload.projectName,
      }).exec((error, data) => {
        if (error) return res.status(400).json({ error });
        if (data) {
          return res.status(400).json({ error: "ชื่องานใช้ไปเเล้ว" });
        }
        payload.updateAt = new Date();
        payload.slug = slugify(payload.projectName);
        Dashboard.findOneAndUpdate(
          { user: req.user._id },
          { $push: { dashboardProject: payload } },
          { new: true }
        ).exec((error, data) => {
          if (error) return res.status(400).json({ error });
          if (data) {
            return res.status(200).json({ data });
          }
        });
      });
    } else {
      payload.updateAt = new Date();
      payload.slug = slugify(payload.projectName);
      const add = new Dashboard({
        user: req.user._id,
        dashboardProject: payload,
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

exports.getAllDashBoard = (req, res) => {
  Dashboard.findOne({ user: req.user._id })
    .select("dashboardProject")
    .exec((error, data) => {
      if (error) res.status(400).json({ error });
      if (data) {
        return res.status(200).json({ data });
      }
    });
};

exports.getDashBoard = (req, res) => {
  const { slug } = req.params;
  Dashboard.findOne(
    { user: req.user._id },
    { dashboardProject: { $elemMatch: { slug: slug } } }
  ).exec(async (error, data) => {
    if (error) return res.status(400).json({ error });
    if (data) {
      if (data.dashboardProject[0].chartList.chart1) {
        data.dashboardProject[0].chartList.chart1 = await Chart.findOne(
          { user: req.user._id },
          {
            dataProject: {
              $elemMatch: { _id: data.dashboardProject[0].chartList.chart1 },
            },
          }
        );
      }
      if (data.dashboardProject[0].chartList.chart2) {
        data.dashboardProject[0].chartList.chart2 = await Chart.findOne(
          { user: req.user._id },
          {
            dataProject: {
              $elemMatch: { _id: data.dashboardProject[0].chartList.chart2 },
            },
          }
        );
      }
      if (data.dashboardProject[0].chartList.chart3) {
        data.dashboardProject[0].chartList.chart3 = await Chart.findOne(
          { user: req.user._id },
          {
            dataProject: {
              $elemMatch: { _id: data.dashboardProject[0].chartList.chart3 },
            },
          }
        );
      }
      if (data.dashboardProject[0].chartList.chart4) {
        data.dashboardProject[0].chartList.chart4 = await Chart.findOne(
          { user: req.user._id },
          {
            dataProject: {
              $elemMatch: { _id: data.dashboardProject[0].chartList.chart4 },
            },
          }
        );
      }
      return res.status(200).json({ data });
    }
  });
};

exports.updateStateDashBoard = (req, res) => {
  const { payload } = req.body;
  console.log(payload);
  Dashboard.findOneAndUpdate(
    { user: req.user._id, "dashboardProject._id": payload._id },
    {
      $set: { "dashboardProject.$.chartList": payload.chartList },
    },
    { new: true }
  ).exec((error, data) => {
    if (error) return res.status(400).json({ error });
    if (data) {
      return res.status(200).json({ data });
    }
  });
};

// exports.getChatBylist = (req, res) => {
//   const { _id } = req.body.payload;
//   Dashboard.findOne(
//     { user: req.user._id },
//     { dashboardProject: { $elemMatch: { _id: _id } } }
//   ).exec((error, data) => {
//     if (error) return res.status(400).json({ error });
//     if (data) {
//       return res.status(200).json({ data });
//     }
//   });
// };

exports.getChatBylist = (req, res) => {
  const { _id, chart1, chart2, chart3, chart4 } = req.body.payload;
  let keep = [];
  Dashboard.aggregate([
    {
      $match: { user: new mongoose.Types.ObjectId(`${req.user._id}`) },
    },
    {
      $unwind: "$dashboardProject",
    },
    {
      $match: {
        "dashboardProject._id": new mongoose.Types.ObjectId(`${_id}`),
      },
    },
    {
      $project: { _id: `$dashboardProject.chartList` },
    },
  ]).exec(async (error, data) => {
    if (error) return res.status(400).json({ error });
    if (data) {
      // console.log(Object.keys(data[0]._id));
      for (let index of Object.keys(data[0]._id)) {
        keep.push(
          // await Chart.findOne(
          //   { user: req.user._id },
          //   { dataProject: { $elemMatch: { _id: data[0]._id[index] } } }
          // )
          await Chart.aggregate([
            {
              $match: { user: new mongoose.Types.ObjectId(`${req.user._id}`) },
            },
            {
              $unwind: "$dataProject",
            },
            {
              $match: {
                "dataProject._id": new mongoose.Types.ObjectId(
                  `${data[0]._id[index]}`
                ),
              },
            },
            {
              $project: { _id: index, dataProject: `$dataProject` },
            },
          ])
        );
      }

      return res.status(200).json({ keep });
    }
  });
};

// const mergArray = (dataArray) => {
//   let a3;
//   for (i = 1; i < dataArray.length; i++) {
//     if (i == 1) {
//       a3 = dataArray[0].map((t1) => ({
//         ...t1,
//         ...dataArray[1].find((t2) => t2._id === t1._id),
//       }));
//     } else {
//       a3 = dataArray[i].map((t1) => ({
//         ...t1,
//         ...a3.find((t2) => t2._id === t1._id),
//       }));
//     }
//   }
//   return a3;
// };

// exports.queryChart = async (req, res) => {
//   const { tableId, labelX, dataArrayY, projectId } = req.body.payload;
//   const { listDashBoard } = req.body.payload;
//   let keep = [];
//   try {
//     for (let index of listDashBoard) {
//       if (index.dataArrayY.length > 1) {
//         for (let index of dataArrayY) {
//           keep.push(
//             await Project.aggregate([
//               {
//                 $match: {
//                   user: new mongoose.Types.ObjectId(`${req.user._id}`),
//                 },
//               },
//               {
//                 $unwind: "$dataTable",
//               },
//               {
//                 $match: {
//                   "dataTable._id": new mongoose.Types.ObjectId(`${tableId}`),
//                 },
//               },
//               {
//                 $project: { _id: null, dataTable: `$dataTable.dataProject` },
//               },
//               {
//                 $unwind: "$dataTable",
//               },
//               {
//                 $group: {
//                   _id: `$dataTable.${labelX}`,
//                   [index.dataY + ` ${index.type}`]: {
//                     ["$" + index.type]: `$dataTable.${index.dataY}`,
//                   },
//                   // $sum: `$dataTable.${index.dataY}`
//                 },
//               },
//               {
//                 $sort: { _id: 1 },
//               },
//             ])
//           );
//         }
//         let dataArray = mergArray(keep);
//         await Chart.findOneAndUpdate(
//           { user: req.user._id, "dataProject._id": projectId },
//           {
//             $set: {
//               "dataProject.$.saveState": {
//                 dataX: labelX,
//                 dataY: dataArrayY,
//               },
//             },
//           },
//           { new: true }
//         );
//         return res.status(200).json({ dataArray });
//       } else {
//         Project.aggregate([
//           {
//             $match: {
//               user: new mongoose.Types.ObjectId(`${req.user._id}`),
//             },
//           },
//           {
//             $unwind: "$dataTable",
//           },
//           {
//             $match: {
//               "dataTable._id": new mongoose.Types.ObjectId(`${index.tableId}`),
//             },
//           },
//           {
//             $project: { _id: null, dataTable: `$dataTable.dataProject` },
//           },
//           {
//             $unwind: "$dataTable",
//           },
//           {
//             $group: {
//               _id: `$dataTable.${index.labelX}`,
//               [index.dataArrayY[0].dataY + ` ${index.dataArrayY[0].type}`]: {
//                 // $avg: `$dataTable.${dataArrayY[0].dataY}`,
//                 ["$" +
//                 index.dataArrayY[0]
//                   .type]: `$dataTable.${index.dataArrayY[0].dataY}`,
//               },
//             },
//           },
//           {
//             $sort: { _id: 1 },
//           },
//         ]).exec(async (error, dataArray) => {
//           if (error) return res.status(400).json({ error });
//           if (dataArray) {
//             keep.push(dataArray);
//             await Chart.findOneAndUpdate(
//               { user: req.user._id, "dataProject._id": index.projectId },
//               {
//                 $set: {
//                   "dataProject.$.saveState": {
//                     dataX: index.labelX,
//                     dataY: index.dataArrayY,
//                   },
//                 },
//               },
//               { new: true }
//             );
//           }
//         });
//       }
//     }
//   } catch (error) {
//     console.log(3);
//   }
// };
