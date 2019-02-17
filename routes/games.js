var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function(req, res, next) {
	res.render("games", {session: req.session});
});

router.get("/quick-click", function(req, res, next) {
	res.render("games/quick-click", {session: req.session});
});

module.exports = router;
