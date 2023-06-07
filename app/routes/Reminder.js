module.exports = app => {

const Reminder = require("../controllers/Reminder");
const upload = require("../middlewares/FolderImagesMulter")

let router = require("express").Router();

router.post("/add", Reminder.create);
router.post("/view_specific", Reminder.viewSpecific);
router.post("/search", Reminder.search);
router.post("/view_all", Reminder.viewAll);
router.put("/update", Reminder.update);
router.delete("/delete/:id" , Reminder.delete)

app.use("/reminder", router);
};
