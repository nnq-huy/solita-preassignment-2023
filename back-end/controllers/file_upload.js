/* Handle csv files upload to start data import process using multer as middleware and node fs package.
There are two types of data : journeys and stations, an uploaded file will be name either journeys.csv or stations.csv based on param in the request uri.
File content is from field 'file' from request form-data. */
const multer = require("multer");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let dir = `./csv/`; // file path for csv files
    //check if file path exists or create the directory
    fs.access(dir, function (error) {
      if (error) {
        console.log("Directory does not exist.");
        fs.mkdir(dir, (error) => cb(error, dir));
      } else {
        console.log("Directory exists.");
        cb(null, dir);
      }
    });
  },
  filename: function (req, file, cb) {
    const uploadType = req.params.uploadType;
    let csvName = uploadType + ".csv";
    cb(null, csvName);
  },
});

const uploadFile = multer({ storage: storage });

const uploadCsv = (request, response, next) => {
  const file = request.file;
  if (!file) {
    const error = new Error("Upload not complete!");
    error.httpStatusCode = 400;
    return next(error);
  }
  response.json({
    success: true,
    statusCode: 200,
    fileName: file.filename,
  });
};

module.exports = { uploadCsv, uploadFile };