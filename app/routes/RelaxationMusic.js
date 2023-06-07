module.exports = app => {

const RelaxationMusic = require("../controllers/RelaxationMusic");
const upload = require("../middlewares/FolderImagesMulter")

let router = require("express").Router();

router.post("/add",upload.single('audio_file'), RelaxationMusic.create);
router.post("/add_icon",upload.single('icon'), RelaxationMusic.addIcon);
router.post("/add_audio_file",upload.single('audio_file'), RelaxationMusic.addAudioFile);
router.post("/view_specific", RelaxationMusic.viewSpecific);
router.post("/view_all", RelaxationMusic.viewAll);
router.post("/update",upload.single('audio_file'), RelaxationMusic.update);
router.delete("/delete/:id" , RelaxationMusic.delete)
router.post("/search", RelaxationMusic.search);


app.use("/relaxation_music", router);
};
