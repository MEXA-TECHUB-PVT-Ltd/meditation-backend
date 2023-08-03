module.exports = app => {

const Skill = require("../controllers/Skill");
const upload = require("../middlewares/FolderImagesMulter")

let router = require("express").Router();

router.post("/add", Skill.create);
router.post("/add_icon",upload.single('icon'), Skill.addIcon);
router.post("/view_specific", Skill.viewSpecific);
router.post("/view_all", Skill.viewAll);
router.put("/update", Skill.update);
router.delete("/delete/:id" , Skill.delete)
router.post("/search", Skill.search);
router.post("/view_progress", Skill.viewProgress);
router.post("/view_progress_all", Skill.viewProgressAll);






app.use("/skill", router);
};
