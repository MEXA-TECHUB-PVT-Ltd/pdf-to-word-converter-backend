const pdf = require("../models/pdf");

// Create and Save a new user
exports.lockPdf = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  pdf.lockPdf( req, res);
};

exports.unlockPdf = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  pdf.unlockPdf( req, res);
};
exports.mergePdf = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  pdf.mergePdf( req, res);
};

exports.getAllPDF = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  pdf.getAllPDF( req, res);
};
exports.getAllMergedPDF = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  pdf.getAllMergedPDF( req, res);
};