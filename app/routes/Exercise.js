module.exports = app => {

const Exercise = require("../controllers/Exercise");
const upload = require("../middlewares/FolderImagesMulter")

let router = require("express").Router();

router.post("/add", Exercise.create);
router.put("/update_animation",upload.array('animations'), Exercise.UpdateAnimation);
router.put("/add_animations",upload.array('animations'), Exercise.addAnimation);
router.put("/add_audio_file",upload.single('audio_file'), Exercise.addAudioFile);
router.post("/view_specific", Exercise.viewSpecific);
router.post("/search", Exercise.search);
router.post("/view_all", Exercise.viewAll);
router.put("/update", Exercise.update);
router.delete("/delete/:id" , Exercise.delete)

app.use("/exercise", router);
};
