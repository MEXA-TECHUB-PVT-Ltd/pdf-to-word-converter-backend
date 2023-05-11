const imgToPdf = require("../models/imgToPdf");

// Create and Save a new user
exports.imgToPdf = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  imgToPdf.ImgToPdf( req, res);
};

// Create and Save a new user
exports.getAllImagePdfCount = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  imgToPdf.getAllImagePdfCount( req, res);
};


// Create and Save a new user
exports.getAllImagePdf = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  imgToPdf.getAllImagePdf( req, res);
};

exports.getAllImgPdf_MonthWise_count = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  imgToPdf.getAllImgPdf_MonthWise_count( req, res);
};

exports.getAllImgToPdfYear = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  imgToPdf.getAllImgToPdfYear( req, res);
};