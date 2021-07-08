require("dotenv").config();
require("./src/middlewares/auth");
const express = require("express");
const adminRoute = require("./src/routes/admin");
const userRoutes = require("./src/routes/users");
const authRoutes = require("./src/routes/auth");
const guestRoute = require("./src/routes/guest");
const connectToDatabase = require("./src/utils/mongo");
const app = express();
const port = 5000;
const cors = require("cors");
app.use(cors());
const { uploadManyFile } = require("./src/utils/s3");

// const fileFilter = (req, file, cb) => {
//   if (
//     file.mimetype === "image/png" ||
//     file.mimetype === "image/jpg" ||
//     file.mimetype === "image/jpeg"
//   ) {
//     cb(null, true);
//   } else {
//     cb(null, false);
//   }
// };
// var fileLimits = {
//   files: 1, // allow only 1 file per request
//   fileSize: 1024 * 1024, // 1 MB (max file size)
// };

const connectMongo = async (req, res, next) => {
  await connectToDatabase();
  next();
};
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(connectMongo);

app.use("/", authRoutes);

app.use(userRoutes);
app.use(adminRoute);
app.use(guestRoute);

app.use((err, req, res, next) => {
  console.log("ERROR: ", err);
  res.status(err.status || 500).json({
    message: "System fail!",
    error: err.message,
    status: err.status,
    data: err.data,
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

module.exports = app;
