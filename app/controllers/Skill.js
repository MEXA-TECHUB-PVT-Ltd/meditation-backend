const Skill = require("../models/Skill");

exports.create = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
    });
  }
  Skill.create(req, res);
};

exports.viewProgressAll = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
    });
  }
  Skill.viewProgressAll(req, res);
};



exports.viewProgress = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
    });
  }
  Skill.viewProgress(req, res);
};



exports.search = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
    });
  }
  Skill.search(req, res);
};


exports.viewSpecific = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
    });
  }
  Skill.viewSpecific(req, res);
};
exports.viewAll = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
    });
  }
  Skill.viewAll(req, res);
};

exports.delete = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
    });
  }
  Skill.delete(req, res);
};
exports.update = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
    });
  }
  Skill.update(req, res);
};

exports.addIcon = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
    });
  }
  Skill.addIcon(req, res);
};

