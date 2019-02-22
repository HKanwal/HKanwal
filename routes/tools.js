var express = require("express");
var router = express.Router();
var lichessBotController = require("../controllers/lichess-bot.js");

/* GET tools page. */
router.get("/", function(req, res, next) {
	res.render("tools", {session: req.session});
});

router.get("/lichess-bot", lichessBotController);

module.exports = router;
