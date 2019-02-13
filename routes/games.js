var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function(req, res, next) {
	res.render("games", {cookies: req.cookies});
});

router.get("/quick-click", function(req, res, next) {
	res.render("games/quick-click", {cookies: req.cookies});
});

module.exports = router;
