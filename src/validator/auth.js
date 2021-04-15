const { check, validationResult } = require("express-validator");

exports.validationsignin = [
  check("payload.email").isEmail().withMessage("valid Email is required"),
  check("payload.email").notEmpty().withMessage("plese fill email"),
  check("payload.password").notEmpty().withMessage("plese fill password"),
];

exports.isRequestValidated = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.array().length > 0) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }
  next();
};

exports.validationsignup = [
  check("payload.firstName").notEmpty().withMessage("please fill firstName"),
  check("payload.firstName")
    .isLength({ min: 3 })
    .withMessage("firstName must be atleast more than 3"),
  check("payload.lastName").notEmpty().withMessage("please fill lastName"),
  check("payload.lastName")
    .isLength({ min: 3 })
    .withMessage("lastName must be atleast more than 3"),
  check("payload.username").notEmpty().withMessage("please fill username"),
  check("payload.username")
    .isLength({ min: 3 })
    .withMessage("username must be atleast more than 3"),
  check("payload.email").notEmpty().withMessage("plese fill email"),
  check("payload.email").isEmail().withMessage("valid Email is required"),
  check("payload.password").notEmpty().withMessage("plese fill password"),
  check("payload.password")
    .isLength({ min: 6 })
    .withMessage("password must be atleast more than 6"),
];
