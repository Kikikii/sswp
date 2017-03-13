// twinkleArray Math Challange.

var bricks; // bricks[x][y] = life of that brick; my game has [x|0~6], [y|0~9].
var currentStage; // Number that will insert to brick after stageReset
var stageReset = 1; // Switch to reset stage, will be subtracted after Reset has done and will be added after all balls are come back
var incNum = 2, incSpeed = 1.2; // Number for bouncing hoop
var gameStatus = "run"; // I don't need it for now.
var balls; // Array for balls
var timer; // Timer for fire balls, increasing every frames and will be reset to 0 when player start fire.
			   // in balls.js, there's function called fireBalls(), each balls will fire every 4 timer except 0.
var toggle; // Switch to start fire, will increase when mouse is realised but won't work when balls are still flying.
var chkball; // Will be increased when balls touch the green item. At stageReset, it will push balls [chkball] times.
var swt; // To run stageReset only once. StageRese will run when swt is 0 and all ballStatus are standby.
var swt2 = 1; // Switch for savepoint.
var swt3 = 0; // Switch for menu.
var twinkleArray = [ // Array to make bricks twinkle when ball hits the brick.
	[], [], [], [], [], []
];

function setup() {
	bricks = [
		[], [], [], [], [], []
	];
	twinkleArray = [
		[], [], [], [], [], []
	];
	balls = [];
	timer = 0;
	toggle = 0;
	chkball = 0;
	currentStage = 1;
	swt = 1;
	createCanvas(420, 575); // Tried to make it similar to mobile screen =].
	for (var i = 0; i < bricks.length; i++) { // Push column of 9 zero to each row.
		for (var j = 0; j < 9; j++) {
			bricks[i].push(0);
			twinkleArray[i].push(0);
		}
	}
	balls.push(new ball(210, 516)); // Push first ball to start with.
	textAlign(CENTER);
}

function draw() {
	if (gameStatus == "start") {

	} else if (gameStatus == "run" || gameStatus == "menu") { // I'll make start and finish status as well, after I build my game successfully.
		background(255, 255, 255, 150);
		if (gameStatus == "run") {
			incSpeed -= 0.05; // Gravity of green item's hoop.
			incNum += incSpeed;
			timer++; // As I said, timer will be added every frame.
		}

		if (incNum < 0) {
			incSpeed = 1.2; // Make it Bounce
		}

		if (toggle === 1) { // Run fireBalls() when toggle is 1. It will become zero when last ball's status is fire.
			fireBalls();
		}

		if (balls[balls.length-1].ballStatus == "fire") { // When last ball's status is fire, set toggle and swt to 0.
			toggle = 0;
			swt = 0;
		}

		if (stageReset === 1) { // Run code when stageReset is 1. All bricks will move to 1 down and create new breaks.
			var chksum = 0;
			if (chkball > 0) { // If player has touch the green item, push the ball [chkball] times.
				for (var i = 0; i < chkball; chkball--) {
					balls.push(new ball(balls[0].x, balls[0].y));
				}
			}

			for (var i = 0; i < 6; i++) { // Move all bricks to 1 down. ex)bricks[0][0] -> bricks[0][1].
				bricks[i].unshift(0);
				if (bricks[i][8] > 0) { // Lose the game when any bricks hit the bottom
					gameStatus = "finish";
				}
			}

			var rn = random([0, 1, 2, 3, 4, 5]); // Make green item to random location.
			if (bricks[rn][0] === 0) {
				bricks[rn][0] = -1;
			}

			for (var i = 0; i < floor(random(2, 7)); i++) { // Make bricks random times, if no brick is already exist there.
				var rn = random([0, 1, 2, 3, 4, 5]);
				if (bricks[rn][0] === 0) {
					bricks[rn][0] = currentStage;
					chksum += bricks[rn][0]; // Add numbers to chksum.
				}
			}

			if (chksum === 0 && bricks[0][0] === 0) { // If chksum is 0, which means there's no brick, make 1 brick.
				bricks[0][0] = currentStage;
			} else if (chksum === 0 && bricks[1][0] === 0) { // If green item is already exist at bricks[0][0], make brick at bricks[1][0].
				bricks[1][0] = currentStage;
			}
			stageReset = 0; // Change stageReset value to 0 again.
			currentStage++; // Add 1 to currentStage.
		} // stageReset ends here.

		var chksum2 = 0; // I will use this method so many times, it's beautiful.
		for (var i = 0; i < balls.length; i++) {
			if (balls[i].ballStatus == "fire") {
				chksum2++;
			}
		}

		if (chksum2 === 0) { // If all balls are standby,
			if (swt === 0) { // Run stageReset, and add 1 to swt that stageReset don't run twice.
				stageReset++;
				swt++;
			}

			if (mouseX > -210 && mouseX < 630 && mouseY < 500 && mouseIsPressed) { // Draw lines.
				stroke(0, 150, 250);
				line(balls[0].x, balls[0].y, mouseX, mouseY);
			}
		}

		for (var i = 0; i < balls.length; i++) { // Loop for balls
			if (gameStatus == "run") {
				balls[i].update();
			}
			balls[i].display();

			var chksumb = 0;
	        for (var j = 0; j < balls.length; j++) {
	            if (balls[j].ballStatus == "fire") {chksumb++;}
	        }
	        if (chksumb === 0) { // When all balls are at standby, draw how many balls player have.
				noStroke();
				fill(0, 0, 0, 50);
				rect(this.x - 10, 530, 20, 10);
	        }

			var chksuma = 0;
			for (var j = 0; j < balls.length; j++) {
				if (balls[j].ballStatus == "fire") {chksuma++;}
			}

			if (balls[0].ballStatus == "fire") {
				swt2 = 0;
			}

			if (balls[i].y > 515) { // Make its status to standby when it touches the line at the bottom
				balls[i].ballStatus = "standby";
				if (swt2 === 0) { // Set savepoint of first ball when first ball touches the bottom
					balls[0].xSP = balls[i].x;
					swt2++;
				}
			}

			// If all balls are standby, gather them to savepoint of the first ball
			if (chksuma === 0 && balls.length > 1 ) {
				for (var k = 1; k < balls.length; k++) {
					balls[k].x = balls[0].xSP;
				}
			}

		}

		for (var x = 0; x < bricks.length; x++) { // Loop for bricks to draw them
			for (var y = 0; y < 10; y++) {
				if (bricks[x][y] > 0) { // If that index has an number of greater than 0, draw brick.
					// brick shadow
					noStroke();
					fill(150, 150, 150, 80);
					rect(x * 69 + 6, 80 + y * 50, 68, 49);

					// brick
					if (twinkleArray[x][y] > 0 && twinkleArray[x][y] < 4) {
						fill(255,50,50, 255);
						twinkleArray[x][y]++;
					} else if (twinkleArray[x][y] === 0) {
						fill(255,50,50);
					} else if (twinkleArray[x][y] === 4) {
						twinkleArray[x][y] = 0;
					}
					println(twinkleArray[x][y]);
					rect(x * 69 + 2, 75 + y * 50, 68, 49);

					// text
					strokeWeight(1);
					stroke(255);
					fill(255);
					textSize(33);
					text(bricks[x][y], 35 + x * 69, 110 + y * 50);
				} else if (bricks[x][y] === -1) { // If that index has an number of -1, draw green item.
					// inner shadow
					noStroke();
					fill(150, 150, 150, 80);
					ellipse(x * 69 + 39, y * 50 + 104, 20);

					// outer shadow
					noFill();
					stroke(150, 150, 150, 80);
					strokeWeight(4);
					ellipse(x * 69 + 39, y * 50 + 105, 24 + incNum);

					// inner circle
					noStroke();
					fill(0, 230, 20);
					ellipse(x * 69 + 35, y * 50 + 100, 20, 20);

					// outer circle
					noFill();
					strokeWeight(4);
					stroke(0, 230, 20);
					ellipse(x * 69 + 35, y * 50 + 100, 24 + incNum);
				}
			}
		}

		var chksumd = 0;
        for (var j = 0; j < balls.length; j++) {
            if (balls[j].ballStatus == "standby") {chksumd++;}
        }
        if (chksumd === balls.length || toggle === 1) { // When all balls are at standby, draw balls that player has.
            textSize(14);
			noStroke();
            fill(50, 165, 255);
            text("X"+chksumd, balls[0].xSP, 544);
        }


		// Draw lines at Top and Bottom
		noStroke();
		fill(0);
		rect(0, 30, 420, 6);
		rect(0, 525, 420, 6);
		fill (255);
		rect(0, 0, 420, 30);

		// Pop up!
		if (gameStatus == "menu") {
			noStroke();
			fill(255, 255, 255, 120);
			rect(0, 0, 420, 575);
			strokeWeight(6);
			stroke(20, 20, 20, 100);
			fill(100, 100, 100, 150);
			rect(60, 80, 300, 400);
		}

	} else if (gameStatus == "finish") { // If gameStatus is 'finish', will run thos code.
		background(0);
		stroke(255);
		textSize(30);
		text("YOU SUCH AN ALLISTER", width/2, 300);
	}
}

function keyPressed() { // Just to test that stageReset is working or not.
	if (keyIsDown(32)) {
		if (gameStatus == "run") {
			gameStatus = "menu";
		} else {
			gameStatus = "run";
		}
	}
}

function mouseReleased() { // Fire balls when mouse is Released, and all balls are at standby.
	var chksum = 0;
	var chksumc = 0;
	for (var i = 0; i < balls.length; i++) {
		if (balls[i].ballStatus == "fire") {chksum++;} // If chksum = 0, it means all balls are at standby.
		if (balls[i].ballStatus == "standby") {chksumc++;} // If chksumc = 0, it means all balls are at fire.
	}
	if (chksum === 0 && chksumc === balls.length) { // If all balls are at standby,
		for (var j = 0; j < balls.length; j++) {
			balls[j].defineSpeed(); // define speed and store it to each ball,
			timer = 0; // set timer to 0 so it will start from 0 again (timer++ line is inside draw function).
		}
		toggle++; // and toggle++ so it will run fireBalls function in balls.js.
	}
}

function mousePressed() { // run game again when gameStatus is finish and press the mouse.
	if (gameStatus == "finish") {
		setup();
		gameStatus = "run";
	}
}
