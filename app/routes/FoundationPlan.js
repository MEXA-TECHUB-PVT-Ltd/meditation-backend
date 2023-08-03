module.exports = app => {

const FoundationPlan = require("../controllers/FoundationPlan");
const upload = require("../middlewares/FolderImagesMulter")

let router = require("express").Router();

router.post("/add",upload.array('audio_files'), FoundationPlan.create);
router.post("/add_plan", FoundationPlan.AddPlan);
router.post("/create_plan", FoundationPlan.createPlan);
router.post("/add_animations",upload.array('animations'), FoundationPlan.addAnimation);
router.post("/add_audio_file",upload.array('audio_files'), FoundationPlan.addAudioFile);
router.post("/add_icon",upload.single('icon'), FoundationPlan.addIcon);
router.post("/view_specific", FoundationPlan.viewSpecific);
router.post("/view_history_plan_user", FoundationPlan.viewHistory_Plan_user);
router.post("/search", FoundationPlan.search);
router.post("/view_all_by_user", FoundationPlan.viewAllByUser);
router.post("/view_completed", FoundationPlan.viewCompleted);
router.post("/view_completed_user", FoundationPlan.viewCompleted_user);
router.post("/view_started_user", FoundationPlan.viewStarted_user);
router.post("/view_all", FoundationPlan.viewAll);
router.put("/update", FoundationPlan.update);
router.delete("/delete/:id" , FoundationPlan.delete)
router.post("/change_plan_status", FoundationPlan.changePlanStatus);
router.delete("/quit_plan", FoundationPlan.quitPlan);
router.put("/start", FoundationPlan.start);
router.put("/update_started_plan", FoundationPlan.updateStartedPlan);
router.post("/view_progress_plan_skill_user", FoundationPlan.viewProgress_plan_skill_user);
router.post("/view_completed_skills_plan", FoundationPlan.view_completed_skills_plan);
router.post("/view_completed_skills_User", FoundationPlan.view_completed_skills_User);
router.post("/view_completed_Exercises_User", FoundationPlan.view_completed_Exercises_User);
router.post("/view_All_Exercises_User", FoundationPlan.view_All_Exercises_User);



app.use("/foundation_plan", router);
};
