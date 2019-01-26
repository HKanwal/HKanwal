var loader = PIXI.loader;
width = 800;
height = 600;

var app = new PIXI.Application({
	width: width,
	height: height,
	antialias: true,
	backgroundColor: 0xD7FFFF
});
$("#canvas-container").append(app.view);

var target = new PIXI.Graphics();
target.beginFill(0xcc0000);
target.drawCircle(0, 0, Math.floor(width/14));
target.endFill();

app.stage.addChild(target);

target.x = 400;
target.y = 300;

function updateScreen() {
	target.width -= 1;
	target.height -= 1;

	setInterval(updateScreen, 1000);
}

setInterval(updateScreen, 1000);