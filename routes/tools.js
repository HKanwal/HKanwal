var express = require("express");
var router = express.Router();

/* GET tools page. */
router.get("/", function(req, res, next) {
	res.render("tools", {cookies: req.cookies});
});

module.exports = router;
