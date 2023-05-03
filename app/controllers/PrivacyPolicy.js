const PrivacyPolicy = require("../models/PrivacyPolicy");

// Create and Save a new Admin
exports.AddPrivacyPolicy = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  PrivacyPolicy.AddPrivacyPolicy( req, res);
};
exports.UpdatePrivacyPolicy = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  PrivacyPolicy.UpdatePrivacyPolicy( req, res);
};

exports.DeletePrivacyPolicy = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  PrivacyPolicy.DeletePrivacyPolicy( req, res);
};
exports.ViewPrivacyPolicy = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  PrivacyPolicy.ViewPrivacyPolicy( req, res);
};
exports.viewSpecificPrivacyPolicy = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  PrivacyPolicy.viewSpecific( req, res);
};
