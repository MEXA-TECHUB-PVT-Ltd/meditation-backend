module.exports = app => {

const Badge = require("../controllers/Badge");
const upload = require("../middlewares/FolderImagesMulter")

let router = require("express").Router();

router.post("/add", Badge.create);
router.post("/add_icon",upload.single('icon'), Badge.addIcon);
router.post("/view_specific", Badge.viewSpecific);
router.post("/search", Badge.search);
router.post("/view_all", Badge.viewAll);
router.put("/update", Badge.update);
router.delete("/delete/:id" , Badge.delete)
router.post("/streak", Badge.Streak);
// router.post("/StreakHistory", Badge.StreakHistory);

app.use("/badge", router);
};
