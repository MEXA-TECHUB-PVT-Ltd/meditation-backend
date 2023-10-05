module.exports = app => {

const RestTime = require("../controllers/RestTime");

let router = require("express").Router();

router.post("/add", RestTime.create);
router.post("/view_specific", RestTime.viewSpecific);
router.get("/view_all", RestTime.viewAll);
router.put("/update", RestTime.update);
router.put("/update_temporary", RestTime.updateTemporary);
router.delete("/delete/:id" , RestTime.delete)

app.use("/rest_time", router);
};
