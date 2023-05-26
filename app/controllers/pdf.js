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
exports.getAllPDFCount = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  pdf.getAllPDFCount( req, res);
};
exports.getAllMergedPDFCount = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  pdf.getAllMergedPDFCount( req, res);
};

exports.getAllPdf_MonthWise_count = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  pdf.getAllPdf_MonthWise_count( req, res);
};

exports.getMergedPdf_MonthWise_count = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  pdf.getMergedPdf_MonthWise_count( req, res);
};

exports.getAllPdfYear = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  pdf.getAllPdfYear( req, res);
};
exports.getAllMergedPdfYear = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  pdf.getAllMergedPdfYear( req, res);
};

exports.getAllFiles = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  pdf.getAllFiles( req, res);
};
exports.AddWatermark = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  pdf.AddWatermark( req, res);
};
