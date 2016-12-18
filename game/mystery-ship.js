/**
 * The mystery ship handler in the game.
 *
 * Handles the drawing and movement of the myster ship that is shown at the
 * top of the game board at irregular intervals. The ship could be started from
 * the left or the right side of the game board.
 *
 * Shows the ship after the ship has been hit by a missile and the score for
 * hitting the ship.
 *
 */

/*global Vector */
/*global isIntersect */

/**
 * The mystery ship constructor.
 *
 * Sets the mystery ship specifications for the mystery ship that is traveling at the
 * top of the game board.
 *
 * @param {Object} position     - the position of the mystery ship in x and y led.
 * @param {String} direction    - the direction of the mystery ship (left or right).
 */
function MysteryShip(position, direction) {
    this.position           = position  || new Vector();
    this.direction          = direction || "right";
    this.velocity           = new Vector(3, 3);
    this.width              = 35;
    this.height             = 15;
    this.shouldBeRemoved    = false;
    this.reachedBorder      = false;
    this.img                = new window.Image();
    this.img.src            = "../img/game/mystery_ship.png";
}

/**
 * The prototype of the mystery ship describing the characteristics of the
 * mystery ship.
 *
 * @type {Object}
 */
MysteryShip.prototype = {

    /**
     * Draws the myster ship by using an image.
     *
     * @param  {Object}  ct - The canvas context.
     *
     * @return {void}
     */
    draw: function(ct) {
        ct.save();
        ct.translate(this.position.x, this.position.y);
        ct.drawImage(this.img, 0, 0, this.width, this.height);
        ct.restore();
    },

    /**
     * Moves the mystery ship to the left with one pixel muliplied with the velocity.
     *
     * @return {void}
     */
    moveLeft: function() {
        this.position.x -= 1 * this.velocity.x;
    },

    /**
     * Moves the mystery ship to the right with one pixel muliplied with the velocity.
     *
     * @return {void}
     */
    moveRight: function() {
        this.position.x += 1 * this.velocity.x;
    },

    /**
     * Updates the movement of the mystery ship and checks if the mystery ship
     * stays in the area.
     *
     * @return {void}
     */
    update: function() {
        if (this.direction === "right") {
            this.moveRight();
        } else {
            this.moveLeft();
        }

        this.stayInArea();
    },

    /**
     * Sets that the myster ship should be removed when reaching the left or
     * right border on the game board.
     *
     * @return {void}
     */
    stayInArea: function() {
        if (this.position.x < 10) {
            this.shouldBeRemoved = true;
            this.reachedBorder = true;
        }

        if (this.position.x + this.width > 890) {
            this.shouldBeRemoved = true;
            this.reachedBorder = true;
        }
    },

    /**
     * Checks if a missile intersects with the mystery ship. If so, the mystery
     * ship is hit.
     *
     * @param  {Object}  missilePos - The vector of the missile.
     *
     * @return {Boolean}  True if the mystery ship has been hit, false otherwise.
     */
    mysteryShipHit: function(missile) {
        if (isIntersect(this.position.x, this.position.y, this.width, this.height, missile.position.x, missile.position.y, missile.width, missile.height)) {
            return true;
        } else {
            return false;
        }
    },
};

/**
 * The exploded mystery ship constructor.
 *
 * Sets the exploded mystery ship specifications for the exploded mystery ship
 * when the mystery ship is hit by a missile fired by the cannon.
 *
 * @param {Object} position     - the position of the exploded mystery ship in x and y led.
 * @param {Integer} direction   - the score for hitting the mystery ship.
 */
function ExplodedMysteryShip(position, points) {
    this.position           = position  || new Vector();
    this.points             = points;
    this.width              = 35;
    this.height             = 25;
    this.img                = new window.Image();
    this.img.src            = "../img/game/alien_explode.png";
    this.timer              = 70;
}

/**
 * The prototype of the exploded mystery ship describing the characteristics
 * of the exploded mystery ship.
 *
 * @type {Object}
 */
ExplodedMysteryShip.prototype = {

    /**
     * Draws an exploded mystery ship with the score by using an image and text.
     *
     * @param  {Object}  ct - The canvas context.
     *
     * @return {void}
     */
    draw: function(ct) {
        ct.save();
        ct.translate(this.position.x, this.position.y);
        ct.drawImage(this.img, 0, 0, this.width, this.height);

        ct.font = "32px impact";
        ct.fillStyle = '#ff0000';
        ct.fillText(this.points, 0, 20, 100);
        ct.restore();
    },

    /**
     * Decreases the timer with one. The timer controls how long the exploded
     * mystery ship should be present.
     *
     * @return {void}
     */
    update: function() {
        this.timer--;
    },
};
