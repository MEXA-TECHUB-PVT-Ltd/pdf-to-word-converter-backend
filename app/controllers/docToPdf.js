const user = require("../models/docToPdf");

// Create and Save a new user
exports.docToPdf = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  user.docToPdf( req, res);
};