module.exports = app => {

const waterTracking = require("../controllers/waterTracking");
const upload = require("../middlewares/FolderImagesMulter")

let router = require("express").Router();

router.post("/add", waterTracking.create);
router.post("/add_daily_goal", waterTracking.dailyGoal);
router.put("/update_daily_goal", waterTracking.updateDailyGoal);
router.post("/view_specific", waterTracking.viewSpecific);
router.post("/view_daily_goal", waterTracking.viewDailyGoal);
router.post("/view_all", waterTracking.viewAll);
router.put("/update", waterTracking.update);
router.delete("/delete/:id" , waterTracking.delete)

app.use("/water_tracking", router);
};
