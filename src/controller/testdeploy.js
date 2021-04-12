const User = require("../model/user");

exports.testdeploy = (req, res) => {
  User.find({}).exec((error, data) => {
    if (error) return res.status(400).json({ error });
    if (data) {
      return res.status(200).json({ data });
    }
  });
};
