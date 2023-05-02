const TermsConditions = require("../models/TermsConditions");

// Create and Save a new Admin
exports.AddTermsConditions = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  TermsConditions.AddTermsConditions( req, res);
};
exports.UpdateTermsConditions = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  TermsConditions.UpdateTermsConditions( req, res);
};

exports.DeleteTermsConditions = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  TermsConditions.DeleteTermsConditions( req, res);
};
exports.ViewTermsConditions= (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  TermsConditions.ViewTermsConditions( req, res);
};


exports.viewSpecificTermsConditions= (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  TermsConditions.viewSpecific( req, res);
};

