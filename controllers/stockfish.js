var stockfish = require("stockfish");
var path = require("path");

/*
	Takes fen, skillLevel and time from request.
	Sends best move OR error as response:
	"err: Invalid data type(s)"
*/
module.exports = function(req, res, next) {
	// enable CORS
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.header("Access-Control-Allow-Methods", "GET");

	engine = stockfish(path.join(__dirname, "../node_modules/stockfish/src/stockfish.wasm"));
	var fen = req.query.fen;
	var time = req.query.time;
	var skillLevel = req.query.skillLevel || "20";

	if(typeof time === "number") {
		time = time.toString();
	}

	if(typeof skillLevel === "number") {
		skillLevel = skillLevel.toString();
	}

	if(typeof time !== "string" || typeof skillLevel !== "string") {
		res.send("err: Invalid data type(s)");
	}

	engine.onmessage = function(message) {
		console.log("Message: " + message);
		if(message.indexOf("bestmove") === 0) {
			res.send(message.split(" ")[1]);
		}
	};

	engine.postMessage("position fen " + fen);
	engine.postMessage("setoption name Skill Level value " + skillLevel);
	engine.postMessage("go movetime " + time);
};