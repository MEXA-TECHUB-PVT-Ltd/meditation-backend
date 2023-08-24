const user = require("../models/user");
const otp = require("../models/otp");

// Create and Save a new user
exports.signUp = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
    });
  }
  user.create(req, res);
};
exports.signIn = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
    });
  }
  user.login(req, res);
};
exports.getHistory = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
    });
  }
  user.getHistory(req, res);
};
exports.getAllMeditation_MonthWise_count = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
    });
  }
  user.getAllMeditation_MonthWise_count(req, res);
};
exports.AllPlansUser = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
    });
  }
  user.AllPlansUser(req, res);
};
exports.getYearsMeditation = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
    });
  }
  user.getYearsMeditation(req, res);
};

exports.removeProgress = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
    });
  }
  user.removeProgress(req, res);
};

exports.addImage = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
    });
  }
  user.addImage(req, res);
};
exports.RestartProgress = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
    });
  }
  user.RestartProgress(req, res);
};
exports.skillProgress = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
    });
  }
  user.skillProgress(req, res);
};
exports.passwordReset = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
    });
  }
  user.resetPassword(req, res);
};
exports.verifyEmail = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
    });
  }
  otp.VerifyEmail(req, res);
};
exports.newPassword = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
    });
  }
  user.newPassword(req, res);
};
exports.verifyOTP = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
    });
  }
  otp.verifyOTP(req, res);
};



exports.AllUsers = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
    });
  }
  user.AllUsers(req, res);
};

exports.GooglesignIn = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
    });
  }
  user.GooglesignIn(req, res);
};
exports.todaysAddedUsers = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
    });
  }
  user.todaysAddedUsers(req, res);
};
exports.getYears = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
    });
  }
  user.getYears(req, res);
};

exports.getAllUsers_MonthWise_count = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
    });
  }
  user.getAllUsers_MonthWise_count(req, res);
};



exports.TotalUsers = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
    });
  }
  user.TotalUsers(req, res);
};
exports.SubscribedUserCount = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
    });
  }
  user.SubscribedUserCount(req, res);
};

exports.SubscribedUsers = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
    });
  }
  user.SubscribedUsers(req, res);
};


exports.BlockUserCount = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
    });
  }
  user.BlockUserCount(req, res);
};
exports.BlockUsers = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
    });
  }
  user.BlockUsers(req, res);
};






exports.SpecificUser = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
    });
  }
  user.SpecificUser(req, res);
};

exports.updateProfile = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
    });
  }
  user.updateProfile(req, res);
};

exports.addImage = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
    });
  }
  user.addImage(req, res);
};

exports.addCoverImage = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
    });
  }
  user.addCoverImage(req, res);
};
exports.ChangeNumber = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
    });
  }
  user.ChangeNumber(req, res);
};

exports.SubscribedUsers = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
    });
  }
  user.SubscribedUsers(req, res);
};

exports.updateSubscription = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
    });
  }
  user.updateSubscription(req, res);
};

exports.DeleteUser = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
    });
  }
  user.DeleteUser(req, res);
};
