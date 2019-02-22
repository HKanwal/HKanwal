var express = require("express");
var router = express.Router();
var stockfishController = require("../controllers/stockfish.js");

/* GET APIs page. */
router.get("/", function(req, res, next) {
	res.render("APIs", {session: req.session});
});

router.get("/stockfish/api", stockfishController);

router.get("/stockfish", function(req, res, next) {
	res.render("APIs/stockfish", {session: req.session});
});

module.exports = router;
