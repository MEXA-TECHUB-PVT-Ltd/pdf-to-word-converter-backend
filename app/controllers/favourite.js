const favourite = require("../models/favourite");

// Create and Save a new Admin
exports.addPdfInFav = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  favourite.addPdfInFav( req, res);
};
exports.deletePdfInFav = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  favourite.deletePdfInFav( req, res);
};

exports.viewAllPdfInFav = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  favourite.viewAllPdfInFav( req, res);
};
exports.addWordInFav = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  favourite.addWordInFav( req, res);
};
exports.deleteWordInFav = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  favourite.deleteWordInFav( req, res);
};

exports.viewAllWordInFav = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  favourite.viewAllWordInFav( req, res);
};

