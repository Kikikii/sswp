function Star(x, y) {
    // Properties (State)
    // this.x = random(-width, 2 * width);
    // this.y = random(-height, 2 * height);
    this.x = x;
    this.y = y;
    this.r = random(4, 8);
    this.col = color(random(180, 255));

    // Methods (Behaviour)
    this.update = function() {
        // Update this object's color every 5 frames
        if (frameCount % 5 === 0) {
            this.col = color(random(180, 255));
        }
    };

    this.isClicked = function() {
        var d = dist(mouseX, mouseY, this.x, this.y);
        if (d < this.r) {
            return true;
        } else {
            return false;
        }
    };

    this.display = function() {
        // Draw Star 1
        noStroke();
        fill(this.col);
        ellipse(this.x, this.y, 2 * this.r);
    };

    this.call = function() {
        this.display();
        this.update();
    };
}
