var express = require("express");
var router = express.Router();

router.get("/", function(req, res, next) {
	if(req.cookies.user) {
		res.clearCookie("user");
	}
	// stay on same page
	res.redirect("back");
});

module.exports = router;