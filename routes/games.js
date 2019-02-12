var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('games');
});

router.get('/quick-click', function(req, res, next) {
	res.render('games/quick-click');
});

module.exports = router;
