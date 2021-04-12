const express = require("express");
const env = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRoutes = require("./src/route/user");
const projectRoutes = require("./src/route/project");
const chartRoutes = require("./src/route/chart");
const initialRoutes = require("./src/route/initialData");
const dashBoardRoutes = require("./src/route/dashboard");
const testDeployRoutes = require("./src/route/testdeploy");
const app = express();

env.config();

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.bezfr.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    }
  )
  .then(() => {
    console.log("connect database successfully..!");
  });

app.use(
  cors({
    credentials: true,
    origin: "https://dssfontend.herokuapp.com",
  })
);
// origin: "http://localhost:3000",

app.use(cookieParser());
// app.use(express.json());
app.use(express.json({ limit: "200kb" }));
app.use(express.urlencoded({ extended: false }));
app.use("/api", userRoutes);
app.use("/api", projectRoutes);
app.use("/api", chartRoutes);
app.use("/api", initialRoutes);
app.use("/api", dashBoardRoutes);
app.use("/api", testDeployRoutes);

app.listen(process.env.PORT, () => {
  console.log("running on port ", process.env.PORT);
});
