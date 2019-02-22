var showdown = require("showdown");
var converter = new showdown.Converter();
var request = require("request");

module.exports = function(req, res, next) {
	request.get("https://raw.githubusercontent.com/HKanwal/lichess-bot/master/readme.md", function(err, fileRes, body) {
		if(!err) {
			console.log(converter.makeHtml(body));
			res.render("tools/lichess-bot", {session: req.session, readmeHtml: converter.makeHtml(body)});
		}
	});
};