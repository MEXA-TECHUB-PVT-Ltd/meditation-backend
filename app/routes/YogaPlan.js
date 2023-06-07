module.exports = app => {

const YogaPlan = require("../controllers/YogaPlan");
const upload = require("../middlewares/FolderImagesMulter")

let router = require("express").Router();

router.post("/add", YogaPlan.create);
router.post("/add_animations",upload.array('animations'), YogaPlan.addAnimation);
router.post("/add_audio_file",upload.array('audio_files'), YogaPlan.addAudioFile);
router.post("/add_icon",upload.single('icon'), YogaPlan.addIcon);
router.post("/view_specific", YogaPlan.viewSpecific);
router.post("/view_history_plan_user", YogaPlan.viewHistory_Plan_user);
router.post("/search", YogaPlan.search);
router.post("/view_completed", YogaPlan.viewCompleted);
router.post("/view_completed_user", YogaPlan.viewCompleted_user);
router.post("/view_started_user", YogaPlan.viewStarted_user);
router.post("/view_all", YogaPlan.viewAll);
router.put("/update",upload.array('audio_files'), YogaPlan.update);
router.delete("/delete/:id" , YogaPlan.delete)
router.post("/change_plan_status", YogaPlan.changePlanStatus);
router.put("/start", YogaPlan.start);

app.use("/yoga_plan", router);
};
