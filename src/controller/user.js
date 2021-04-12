const bcrypt = require("bcryptjs");
const User = require("../model/user");
const jwt = require("jsonwebtoken");

exports.signup = (req, res) => {
  const { payload } = req.body;
  if (payload) {
    User.findOne({ email: payload.email }).exec((error, email) => {
      if (email)
        return res.status(400).json({ error: "this email aleady usered" });
      User.findOne({ username: payload.username }).exec((error, username) => {
        if (username)
          return res.status(400).json({ error: "this username aleady usered" });
        const hash_password = bcrypt.hashSync(payload.password, 10);
        const add = new User({
          firstName: payload.firstName,
          lastName: payload.lastName,
          username: payload.username,
          email: payload.email,
          hash_password,
        });
        add.save((error, user) => {
          if (error) return res.status(400).json({ error });
          if (user) {
            return res.status(201).json({ user });
          }
        });
      });
    });
  }
};

exports.signin = (req, res) => {
  const { email, password } = req.body.payload;
  User.findOne({ email: email }).exec((error, user) => {
    if (error) return res.status(400).json({ error: "this email not exist" });
    if (user) {
      if (user.authenticate(password)) {
        const token = jwt.sign({ _id: user.id }, process.env.JWT_SECRET, {
          expiresIn: "1d",
        });
        const { firstName, lastName, email, username } = user;
        res
          .status(202)
          .cookie("token", token, {
            sameSite: "strict",
            path: "/",
            expires: new Date(new Date().getTime() + 60 * 60 * 24 * 1000),
            httpOnly: true,
          })
          .json({ user: { firstName, lastName, email, username } });
      } else {
        return res.status(400).json({ error: "Invalid password..!" });
      }
    } else {
      return res.status(400).json({ error: "something went wrong" });
    }
  });
};

exports.signout = (req, res) => {
  res.status(202).clearCookie("token").send("cookies cleard");
};
