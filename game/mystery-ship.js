/*global Vector */
/*global isIntersect */

function MysteryShip(position, velocity, direction) {
    this.position           = position  || new Vector();
    this.velocity           = velocity  || new Vector(1,1);
    this.direction          = direction || "right";
    this.width              = 35;
    this.height             = 15;
    this.shouldBeRemoved    = false;
    this.reachedBorder      = false;
    this.img                = new window.Image();
    this.img.src            = "../img/game/mystery_ship.png";
}

/**
 * The prototype of the alien describing the characteristics of the alien.
 *
 * @type {Object}
 */
MysteryShip.prototype = {

    /**
     * Draws an alien by using an image.
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
     * Moves the alien to the left with one pixel muliplied with the velocity.
     *
     * @return {void}
     */
    moveLeft: function() {
        this.position.x -= 1 * this.velocity.x;
    },

    /**
     * Moves the alien to the right with one pixel muliplied with the velocity.
     *
     * @return {void}
     */
    moveRight: function() {
        this.position.x += 1 * this.velocity.x;
    },

    /**
     * Updates the movement of the alien and checks if the alien stays in the area.
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
     * Checks if the alien stays in the area by changing the direction of the
     * alien when the alien has reached left or right border.
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

function ExplodedMysteryShip(position, points) {
    this.position           = position  || new Vector();
    this.points             = points;
    this.width              = 35;
    this.height             = 25;
    this.img                = new window.Image();
    this.img.src            = "../img/game/alien_explode.png";
    this.timer              = 70;
}

ExplodedMysteryShip.prototype = {

    /**
     * Draws an alien by using an image.
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
     * Decreases the timer with one. The timer controls how long the explosion
     * should be present.
     *
     * @return {void}
     */
    update: function() {
        this.timer--;
    },
};
