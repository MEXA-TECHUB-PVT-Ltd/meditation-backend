module.exports = app => {

const Goal = require("../controllers/Goal");

let router = require("express").Router();

router.post("/add", Goal.create);
router.post("/view_specific", Goal.viewSpecific);
router.post("/view_all", Goal.viewAll);
router.put("/update", Goal.update);
router.delete("/delete/:id" , Goal.delete)
router.post("/search", Goal.search);


app.use("/goal", router);
};
