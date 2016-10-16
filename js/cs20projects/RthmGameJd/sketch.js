// let's start!!
var yValues,
    blocks,
    ytimed,
    speedValue,
    score,
    ytiminglaneoff,
	frameValue,
	negscoreamount,
    clrinc1, clrinc2, clrinc3,
    combo,bestCombo,
    gameState;

function setup() {
	// Important Values
	yValues = [];
    blocks = [0, 2, 1, 1, 2, 0];
	ytimed = [3, 4, 5, 6, 7, 8];
	speedValue = 1;
	negscoreamount = 100;
    clrinc1 = 0;
    combo = 1;

    // Settings
	createCanvas(600, 800);
    score = 0;
    ytiminglaneoff = 600;
    gameState = "start";
    bestCombo = 0;

    clrinc1 = 0;
    clrinc2 = 0;
    clrinc3 = 0;

	for (var i = 0; i < blocks.length; i++) {
		yValues.push(ytiminglaneoff - ytimed[i] * 60 );
	}
}

function draw() {
    background(0, 0, 20);
    if (gameState == "start") {
        drawStartUI();
    } else if (gameState == "action") {
        movePlatforms(speedValue, negscoreamount);
        drawActionUI();
    	drawBlocks();

        // Score can't be neg #
        if (score <= 0) {
            score = 0;
        }

        // Change gameState to 'end' when last block reaches end
        if (yValues[yValues.length - 1] > 1200) {
            gameState = "end";
        }

    } else if (gameState == "end") {
        drawEndUI();
    }
}

function movePlatforms(speed, negscoreamount) {
    for (var i = 0; i < blocks.length; i++) {
        yValues[i] += speed ;
        if (yValues[i] > height - 150) {
			yValues[i] += 200;
		}

        // Move bar to outside the screen when player missed it
		if (yValues[i] == 851) {
			score -= negscoreamount;

            // Put combo value to bestCombo when player missed the bar
            if (combo > bestCombo) {
                bestCombo = combo;
            }
            combo = 1;
		}
    }
} // end movePlatforms

function drawActionUI() {

	// Draw UI
	// Underbar
    fill(200, 200, 0);
    rect(0, 760, 600, 40);

    // Score text
    fill(0);
    textSize(24);
    text("score : " + score, 10, 790);

    // Hitting Blocks
	fill(0+clrinc1,150+clrinc1,220+clrinc1);
	rect(0,ytiminglaneoff + 30,200,130);
	fill(220+clrinc2,175+clrinc2,0+clrinc2);
	rect(200, ytiminglaneoff + 30, 200, 130);
	fill(240+clrinc3,50+clrinc3,0+clrinc3);
	rect(400, ytiminglaneoff + 30, 200, 130);

	// Seperating lines
    stroke(255);
    line(200, 0, 200, 760);
    line(400, 0, 400, 760);
    line(0, ytiminglaneoff + 30, 600, ytiminglaneoff + 30);
    line(0, ytiminglaneoff, 600, ytiminglaneoff);
    stroke(0);

    if (combo >= 2) {
        // Combo text
        textSize(36);
        fill(0,150,250);
        text(combo+" Combo!",1/2 * width - 75, 1/3 * height);
    }

}

function drawStartUI() {
    background(0, 0, 20);

    // Welcome text
    fill(255);
    textSize(48);
    text("Welcome !!", 180, 200);

    // Introduction S
    textSize(30);
    text("Press Spacebar to Start!", 140, 350);
}

function drawEndUI() {
    background(0,0,20);

    // Display score
    textSize(48);
    fill(255);
    text("Your score = " + score, 100, 300);

    if (bestCombo == 0) {
        bestCombo = "\nFULL COMBO";
    }

    // Best combo in the game
    text("Best Combo = " + bestCombo, 100, 350);

    // Display text depends on score
    if (score < 1000 ) {
        text("You're such a... \n   Rank : F", 140, 500);
    } else if (score < 1/12 * (blocks.length * 100 * combo) || score < 1000) {
        text("Try hard !! \n Rank : C", 160, 500);
    } else if (score > 1/12 * (blocks.length * 100 * combo) && score < 1/3 * (blocks.length * 100 * combo)) {
        text("You're good !! \n   Rank : A+", 140, 500);
    } else if (score > 1/3 * (blocks.length * 100 * combo)){
        text("You're just GOD !! \n     Rank : SS+", 100, 500);
    }

}

function drawBlocks() {

	// Loop function
	for(var i=0; i < blocks.length; i++) {
		var ii = blocks[i] * 200
        if (blocks[i] == 0) {
            fill(0,150,220);
        } else if (blocks[i] == 1) {
            fill(220,175,0);
        } else if (blocks[i] == 2) {
            fill(240,50,0);
        }
		rect(ii,yValues[i], 200, 20);
	}
}

function keyPressed() {
    println(keyCode);
    println(gameState);

    // Increase amount of number inside fill
    if (keyCode == 37) {
        clrinc1 = 20;
        for(var i = 0; i < blocks.length; i++) {
            if (blocks[i] == 0 && yValues[i] > ytiminglaneoff - 10 && yValues[i] < ytiminglaneoff + 10) {
                yValues[i] = 1200;
                score += 100 * combo;
                combo += 1;
            }
        }
    }
    if (keyCode == 40) {
        clrinc2 = 20;
        for(var i = 0; i < blocks.length; i++) {
            if (blocks[i] == 1 && yValues[i] > ytiminglaneoff - 10 && yValues[i] < ytiminglaneoff + 10) {
                yValues[i] = 1200;
                score += 100 * combo;
                combo += 1;
            }
        }
    }
    if (keyCode == 39) {
        clrinc3 = 20;
        for(var i = 0; i < blocks.length; i++) {
            if (blocks[i] == 2 && yValues[i] > ytiminglaneoff - 10 && yValues[i] < ytiminglaneoff + 10) {
                yValues[i] = 1200;
                score += 100 * combo;
                combo += 1;
            }
        }
    }
    if (keyCode == 32) {
        gameState = "action";
    }
}

function keyReleased() {

    // Decrease amount of number inside fill
    if (keyCode == 37) {
        clrinc1 = 0;
    }
    if (keyCode == 40) {
        clrinc2 = 0;
    }
    if (keyCode == 39) {
        clrinc3 = 0;
    }
}
