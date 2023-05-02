const user = require("../models/pdfToDoc");

// Create and Save a new user
exports.pdfToDoc = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  user.pdfToDoc( req, res);
};