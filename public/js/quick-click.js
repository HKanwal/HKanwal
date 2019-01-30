// TODO: Add ripple acceleration, modularize, add settings, add difficulty
$(document).ready(function() {
	// Settings for PIXI app
	var loader = PIXI.loader;
	var width = 800;
	var height = 600;
	var color_palette = {
		gray: 0x424242,
		blue: 0x146EB4,
		dark_blue: 0x0f609e,
		orange: 0xFF9900,
		dark_orange: 0xcc7700,
		light_blue: 0x82f0ff
	};

	// setTimeout var for mouse stop in canvas
	var thread;

	// Settings for targets
	var spawn_delay = 800;
	var shrink_speed = 2;
	var targets = 20;
	var targets_spawned = 0;

	// Trail settings
	var trail_colors = [0xf7c876, 0xe8a1f4, 0xb2ffa8, 0xa2eff9, 0xffa8ea];
	var trail_duration = 35;
	var trail_radius = 3;

	// Click ripple settings
	var ripple_alpha = 0.1;

	// Score tracking
	var score = 0;
	var missed = 0;

	// Create PIXI app and create canvas
	var app = new PIXI.Application({
		width: width,
		height: height,
		antialias: true,
		backgroundColor: color_palette.gray
	});
	$("#canvas-container").append(app.view);
	
	// Track mouse position for trail effects
	var mouse_in_canvas = false;

	app.view.addEventListener("mouseenter", function(e) {
		mouse_in_canvas = true;
	});

	app.view.addEventListener("mouseout", function(e) {
		mouse_in_canvas = false;
	});

	// Add mouse trail effect
	app.view.addEventListener("mousemove", function(e) {
		// Get mouse pos in canvas
		var mouseX = e.pageX - this.offsetLeft;
		var mouseY = e.pageY - this.offsetTop;

		function drawTrail() {
			var color = trail_colors[Math.floor(Math.random() * trail_colors.length)];
			var x_vel = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3][Math.floor(Math.random() * 7)];
			var y_vel = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3][Math.floor(Math.random() * 7)];

			// Create circular trail particle
			var particle = new PIXI.Graphics();
			particle.beginFill(color);
			particle.drawCircle(mouseX, mouseY, trail_radius);
			particle.endFill();

			app.stage.addChild(particle);

			// Give velocity and fade out to particles
			function update(delta) {
				if(particle.alpha > 0) {
					particle.alpha -= 1/trail_duration;
					particle.x += x_vel;
					particle.y += y_vel;
				} else {
					// Remove clutter after faded out
					app.stage.removeChild(particle);
					app.ticker.remove(update);
				}
			}

			app.ticker.add(update);
		}

		// Create trail
		drawTrail();

		// Keep trail on while mouse stopped
		var onmousestop = function() {
			if(mouse_in_canvas) {
				drawTrail();
				thread = setTimeout(onmousestop, 100);
			}
		}

		clearTimeout(thread);
		thread = setTimeout(onmousestop, 100);
	});

	// Add click ripple
	app.view.addEventListener("click", function(e) {
		// Get mouse pos in canvas
		var mouseX = e.pageX - this.offsetLeft;
		var mouseY = e.pageY - this.offsetTop;

		var ripple = new PIXI.Graphics();
		ripple.beginFill(color_palette.light_blue);
		ripple.drawCircle(0, 0, 10);
		ripple.endFill();

		ripple.x = mouseX;
		ripple.y = mouseY;

		app.stage.addChild(ripple);

		function animate(delta) {
			if(ripple.alpha > 0) {
				ripple.width += 5;
				ripple.height += 5;
				ripple.alpha -= ripple_alpha;
			} else {
				app.stage.removeChild(ripple);
				app.ticker.remove(animate);
			}
		}

		app.ticker.add(animate);
	});

	// Creates new target every time it runs
	function createTarget() {
	    var radius = Math.floor(width/10);
	    targets_spawned++;

	    // Create target
	    var target = new PIXI.Graphics();
	    target.beginFill(0xcc0000);
		target.drawCircle(0, 0, radius);
		target.endFill();
		target.index = targets_spawned;

		// Randomize spawn
		target.x = Math.floor(Math.random() * (width - 2*radius + 1)) + radius;
		target.y = Math.floor(Math.random() * (height - 2*radius + 1)) + radius;

		app.stage.addChild(target);

		// Cause target shrinking
		function animate(delta) {
			if(target.width > 0) {
				target.width -= shrink_speed;
				target.height -= shrink_speed;
			} else {
				// Remove clutter after target disappears
				app.stage.removeChild(target);
				app.ticker.remove(animate);
				missed += 1;

				if(target.index === targets) {
					setTimeout(createEndScreen, 1000);
				}
			}
		}

		app.ticker.add(animate);

		// Target on click handling
		target.interactive = true;
		target.on("pointerdown", function() {
			app.stage.removeChild(target);
			app.ticker.remove(animate);
			score += 1;

			if(target.index === targets) {
				setTimeout(createEndScreen, 1000);
			}
		});

		if(targets_spawned !== targets) {
			// Repeat same function
	    	setTimeout(createTarget, spawn_delay);
		}
	}

	//Create score/ending screen
	function createEndScreen() {
		var play_button = new PIXI.Container();

		var play_body = new PIXI.Graphics();
		play_body.beginFill(color_palette.blue);
		play_body.drawRect(0, 0, width/3, height/6);
		play_body.endFill();

		play_body.pivot.set(play_body.width/2, play_body.height/2);
		play_body.position.set(width/2, height-height/3);

		var play_text = new PIXI.Text("Play Again", {
			fontFamily: "Technoma",
			fontSize: 52,
			fill: color_palette.dark_blue
		});
		play_text.pivot.set(play_text.width/2, play_text.height/2);
		play_text.position.set(width/2, height-height/3);

		play_button.addChild(play_body);
		play_button.addChild(play_text);
		app.stage.addChild(play_button);
	}

	// Create/render title screen
	function createTitleScreen() {
		var title = new PIXI.Text("Quick Click", {
			fontFamily: "Technoma",
			fontSize: 100,
			fill: color_palette.orange
		});
		title.pivot.set(title.width/2, title.height/2);
		title.position.set(width/2, height/3);

		app.stage.addChild(title);

		var play_button = new PIXI.Container();

		var play_body = new PIXI.Graphics();
		play_body.beginFill(color_palette.blue);
		play_body.drawRect(0, 0, width/3, height/6);
		play_body.endFill();

		play_body.pivot.set(play_body.width/2, play_body.height/2);
		play_body.position.set(width/2, height-height/3);

		var play_text = new PIXI.Text("Play", {
			fontFamily: "Technoma",
			fontSize: 64,
			fill: color_palette.dark_blue
		});
		play_text.pivot.set(play_text.width/2, play_text.height/2);
		play_text.position.set(width/2, height-height/3);

		play_button.addChild(play_body);
		play_button.addChild(play_text);
		app.stage.addChild(play_button);

		var play_button_active = new PIXI.Container();

		var play_body_active = new PIXI.Graphics();
		play_body_active.beginFill(color_palette.orange);
		play_body_active.drawRect(0, 0, width/3, height/6);
		play_body_active.endFill();

		play_body_active.pivot.set(play_body_active.width/2, play_body_active.height/2);
		play_body_active.position.set(width/2, height-height/3);

		var play_text_active = new PIXI.Text("Play", {
			fontFamily: "Technoma",
			fontSize: 64,
			fill: color_palette.dark_orange
		});
		play_text_active.pivot.set(play_text_active.width/2, play_text_active.height/2);
		play_text_active.position.set(width/2, height-height/3);

		play_button_active.addChild(play_body_active);
		play_button_active.addChild(play_text_active);
		play_button_active.alpha = 0;

		app.stage.addChild(play_button_active);

		play_button.interactive = true;
		play_button.on("mouseover", function(e) {
			play_button.alpha = 0;
			play_button_active.alpha = 1;
		});
		play_button.on("mouseout", function(e) {
			play_button_active.alpha = 0;
			play_button.alpha = 1;
		});
		play_button.on("pointerdown", function(e) {
			app.stage.removeChild(play_button);
			app.stage.removeChild(play_button_active);
			app.stage.removeChild(title);

			setTimeout(createTarget, 1000);
		});
	}

	// Start when fonts loaded
	waitForWebfonts(["Technoma"], createTitleScreen);
});

function waitForWebfonts(fonts, callback) {
	var loadedFonts = 0;
    for(var i = 0, l = fonts.length; i < l; ++i) {
        (function(font) {
            var node = document.createElement('span');
            // Characters that vary significantly among different fonts
            node.innerHTML = 'giItT1WQy@!-/#';
            // Visible - so we can measure it - but not on the screen
            node.style.position      = 'absolute';
            node.style.left          = '-10000px';
            node.style.top           = '-10000px';
            // Large font size makes even subtle changes obvious
            node.style.fontSize      = '300px';
            // Reset any font properties
            node.style.fontFamily    = 'sans-serif';
            node.style.fontVariant   = 'normal';
            node.style.fontStyle     = 'normal';
            node.style.fontWeight    = 'normal';
            node.style.letterSpacing = '0';
            document.body.appendChild(node);

            // Remember width with no applied web font
            var width = node.offsetWidth;

            node.style.fontFamily = font + ', sans-serif';

            var interval;
            function checkFont() {
                // Compare current width with original width
                if(node && node.offsetWidth != width) {
                    ++loadedFonts;
                    node.parentNode.removeChild(node);
                    node = null;
                }

                // If all fonts have been loaded
                if(loadedFonts >= fonts.length) {
                    if(interval) {
                        clearInterval(interval);
                    }
                    if(loadedFonts == fonts.length) {
                        callback();
                        return true;
                    }
                }
            };

            if(!checkFont()) {
                interval = setInterval(checkFont, 50);
            }
        })(fonts[i]);
    }
};