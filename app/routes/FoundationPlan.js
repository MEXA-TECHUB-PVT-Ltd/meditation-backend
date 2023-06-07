module.exports = app => {

const FoundationPlan = require("../controllers/FoundationPlan");
const upload = require("../middlewares/FolderImagesMulter")

let router = require("express").Router();

router.post("/add",upload.array('audio_files'), FoundationPlan.create);
router.post("/add_animations",upload.array('animations'), FoundationPlan.addAnimation);
router.post("/add_audio_file",upload.array('audio_files'), FoundationPlan.addAudioFile);
router.post("/add_icon",upload.single('icon'), FoundationPlan.addIcon);
router.post("/view_specific", FoundationPlan.viewSpecific);
router.post("/view_history_plan_user", FoundationPlan.viewHistory_Plan_user);
router.post("/search", FoundationPlan.search);
router.post("/view_completed", FoundationPlan.viewCompleted);
router.post("/view_completed_user", FoundationPlan.viewCompleted_user);
router.post("/view_started_user", FoundationPlan.viewStarted_user);
router.post("/view_all", FoundationPlan.viewAll);
router.put("/update", FoundationPlan.update);
router.delete("/delete/:id" , FoundationPlan.delete)
router.post("/change_plan_status", FoundationPlan.changePlanStatus);

app.use("/foundation_plan", router);
};
