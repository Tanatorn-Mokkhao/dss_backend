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
