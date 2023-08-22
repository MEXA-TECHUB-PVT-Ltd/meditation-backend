const MeditationPlan = require("../models/MeditationPlan");

exports.create = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  MeditationPlan.create( req, res);
};

exports.start = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  MeditationPlan.start( req, res);
};
exports.UpdateAnimation = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  MeditationPlan.UpdateAnimation( req, res);
};

exports.updateStartedPlan = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  MeditationPlan.updateStartedPlan( req, res);
};

exports.view_completed_skills_User = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  MeditationPlan.view_completed_skills_User( req, res);
};
exports.view_completed_Exercises_User = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  MeditationPlan.view_completed_Exercises_User( req, res);
};

exports.view_All_Exercises_User = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  MeditationPlan.view_All_Exercises_User( req, res);
};

exports.view_completed_skills_plan = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  MeditationPlan.view_completed_skills_plan( req, res);
};

exports.viewProgress_plan_skill_user = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  MeditationPlan.viewProgress_plan_skill_user( req, res);
};
exports.Streak = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  MeditationPlan.Streak( req, res);
};

exports.viewHistory_Plan_user = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  MeditationPlan.viewHistory_Plan_user( req, res);
};

exports.quitPlan = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  MeditationPlan.quitPlan( req, res);
};

exports.viewSpecific = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  MeditationPlan.viewSpecific( req, res);
};
exports.viewAll = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  MeditationPlan.viewAllPlan( req, res);
};
exports.viewCompleted = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  MeditationPlan.viewCompleted( req, res);
};
exports.viewCompleted_user = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  MeditationPlan.viewCompleted_user( req, res);
};
exports.start = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  MeditationPlan.start( req, res);
};
exports.changePlanStatus = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  MeditationPlan.changePlanStatus( req, res);
};
exports.viewStarted_user = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  MeditationPlan.viewStarted_user( req, res);
};
exports.update = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  MeditationPlan.update( req, res);
};
exports.delete = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  MeditationPlan.delete( req, res);
};
exports.addAudioFile = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  MeditationPlan.addAudioFile( req, res);
};
exports.addIcon = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  MeditationPlan.addIcon( req, res);
};
exports.addAnimation = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  MeditationPlan.addAnimation( req, res);
};
exports.search = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  MeditationPlan.search( req, res);
};