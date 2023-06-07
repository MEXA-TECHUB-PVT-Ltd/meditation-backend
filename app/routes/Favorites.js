module.exports = app => {

const Favorites = require("../controllers/Favorites");

let router = require("express").Router();

router.post("/add", Favorites.create);
router.post("/view_specific", Favorites.viewSpecific);
router.post("/view_all", Favorites.viewAll);
router.post("/view_all_by_type", Favorites.viewAll_by_type);
router.delete("/un_favorite" , Favorites.unFav)

app.use("/favorites", router);
};
