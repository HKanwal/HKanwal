var express = require("express");
var router = express.Router();

router.get("/", function(req, res, next) {
	if(req.session.username) {
		req.session.destroy();
	}
	// stay on same page
	res.redirect("back");
});

module.exports = router;