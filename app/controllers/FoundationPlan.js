const FoundationPlan = require("../models/FoundationPlan");

exports.create = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  FoundationPlan.create( req, res);
};

exports.viewHistory_Plan_user = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  FoundationPlan.viewHistory_Plan_user( req, res);
};
exports.viewSpecific = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  FoundationPlan.viewSpecific( req, res);
};
exports.viewAll = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  FoundationPlan.viewAllPlan( req, res);
};
exports.viewCompleted = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  FoundationPlan.viewCompleted( req, res);
};
exports.viewCompleted_user = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  FoundationPlan.viewCompleted_user( req, res);
};
exports.changePlanStatus = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  FoundationPlan.changePlanStatus( req, res);
};
exports.viewStarted_user = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  FoundationPlan.viewStarted_user( req, res);
};
exports.update = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  FoundationPlan.update( req, res);
};
exports.delete = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  FoundationPlan.delete( req, res);
};
exports.addAudioFile = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  FoundationPlan.addAudioFile( req, res);
};
exports.addIcon = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  FoundationPlan.addIcon( req, res);
};
exports.addAnimation = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  FoundationPlan.addAnimation( req, res);
};
exports.search = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  FoundationPlan.search( req, res);
};