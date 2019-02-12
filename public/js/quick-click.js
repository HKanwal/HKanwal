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
	var targets = 5;
	var targets_spawned = 0;

	// Trail settings
	var trail_colors = [0xf7c876, 0xe8a1f4, 0xb2ffa8, 0xa2eff9, 0xffa8ea];
	var trail_duration = 35;
	var trail_radius = 3;

	// Click ripple settings
	var ripple_alpha = 0.1;

	// Score tracking
	var score = 0;

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

	// Creates interactive button, with hover animation and onclick callback
	function createButton(text, posX, posY, font_size, onclick) {
		// Draw button while not moused over
		var button = new PIXI.Container();

			// Add button body
		var button_body = new PIXI.Graphics();
		button_body.beginFill(color_palette.blue);
		button_body.drawRect(0, 0, width/3, height/6);
		button_body.endFill();

		button_body.pivot.set(button_body.width/2, button_body.height/2);
		button_body.position.set(posX, posY);

			// Add button text
		var button_text = new PIXI.Text(text, {
			fontFamily: "Technoma",
			fontSize: font_size,
			fill: color_palette.dark_blue
		});

		button_text.pivot.set(button_text.width/2, button_text.height/2);
		button_text.position.set(posX, posY);

		button.addChild(button_body);
		button.addChild(button_text);
		app.stage.addChild(button);


		// Draw button while moused over
		var button_active = new PIXI.Container();

			// Add button body
		var button_active_body = new PIXI.Graphics();
		button_active_body.beginFill(color_palette.orange);
		button_active_body.drawRect(0, 0, width/3, height/6);
		button_active_body.endFill();

		button_active_body.pivot.set(button_active_body.width/2, button_active_body.height/2);
		button_active_body.position.set(posX, posY);

			// Add button text
		var button_active_text = new PIXI.Text(text, {
			fontFamily: "Technoma",
			fontSize: font_size,
			fill: color_palette.dark_orange
		});

		button_active_text.pivot.set(button_active_text.width/2, button_active_text.height/2);
		button_active_text.position.set(posX, posY);

		button_active.addChild(button_active_body);
		button_active.addChild(button_active_text);
		button_active.alpha = 0;

		app.stage.addChild(button_active);

		// Apply mouseover effects
		button.interactive = true;
		button.on("mouseover", function(e) {
			button.alpha = 0;
			button_active.alpha = 1;
		});
		button.on("mouseout", function(e) {
			button_active.alpha = 0;
			button.alpha = 1;
		});

		// Run onclick callback
		button.on("pointerdown", function(e) {
			onclick(button, button_active);
		});
	}

	//Create score/ending screen
	function createEndScreen() {
		var score_text = new PIXI.Text("Score: " + score.toString() + " out of " + targets.toString(), {
			fontFamily: "Technoma",
			fontSize: 64,
			fill: "white"
		});
		score_text.pivot.set(score_text.width/2, score_text.height/2);
		score_text.position.set(width/2, height/3);

		app.stage.addChild(score_text);

		createButton("Play Again", width/2, height-height/3, 52, function(button, button_active) {
			score = 0;
			targets_spawned = 0;

			app.stage.removeChild(button);
			app.stage.removeChild(button_active);
			app.stage.removeChild(score_text);

			setTimeout(createTarget, 1000);
		});
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

		createButton("Play", width/2, height-height/3, 64, function(button, button_active) {
			app.stage.removeChild(button);
			app.stage.removeChild(button_active);
			app.stage.removeChild(title);

			setTimeout(createTarget, 1000);
		});
	}

	// Start when fonts loaded
	waitForWebfonts(["Technoma"], createTitleScreen);
});

// Waits for web fonts by checking change in text width
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