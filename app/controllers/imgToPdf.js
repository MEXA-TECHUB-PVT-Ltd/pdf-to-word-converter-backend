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