module.exports = app => {

const MeditationPlan = require("../controllers/MeditationPlan");
const upload = require("../middlewares/FolderImagesMulter")

let router = require("express").Router();

router.post("/add",upload.array('audio_files'), MeditationPlan.create);
router.post("/add_animations",upload.array('animations'), MeditationPlan.addAnimation);
router.post("/add_audio_file",upload.array('audio_files'), MeditationPlan.addAudioFile);
router.post("/add_icon",upload.single('icon'), MeditationPlan.addIcon);
router.post("/view_specific", MeditationPlan.viewSpecific);
router.post("/view_history_plan_user", MeditationPlan.viewHistory_Plan_user);
router.post("/search", MeditationPlan.search);
router.post("/view_completed", MeditationPlan.viewCompleted);
router.post("/view_completed_user", MeditationPlan.viewCompleted_user);
router.post("/view_started_user", MeditationPlan.viewStarted_user);
router.post("/view_all", MeditationPlan.viewAll);
router.put("/update",upload.array('audio_files'), MeditationPlan.update);
router.delete("/delete/:id" , MeditationPlan.delete)
router.post("/change_plan_status", MeditationPlan.changePlanStatus);
router.put("/start", MeditationPlan.start);

app.use("/meditation_plan", router);
};
