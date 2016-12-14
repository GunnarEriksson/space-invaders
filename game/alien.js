/*global Vector */
/*global isIntersect */

/**
 * The alien trying to invade the earth.
 *
 * @param {Object}  position - The vector position for the alien.
 * @param {Object}  velocity - The velocity of the alien movement as vector.
 * @param {string}  direction - The dirction of the alien.
 */
function Alien(position, direction, width, height, spritePosX, spritePosY, spritePosX2, points) {
    this.position           = position  || new Vector();
    this.direction          = direction || "right";
    this.newDirection       = direction || "right";
    this.alienWidth         = width;
    this.alienHeight        = height;
    this.spritePosX         = spritePosX;
    this.spritePosY         = spritePosY;
    this.spritePosX2         = spritePosX2;
    this.points             = points;
    this.velocity           = new Vector(0.4, 0.4);
    this.shouldBeRemoved    = false;
    this.img                = new window.Image();
    this.img.src            = "../img/game/space_invaders.png";
    this.version            = 0;
}

/**
 * The prototype of the alien describing the characteristics of the alien.
 *
 * @type {Object}
 */
Alien.prototype = {

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

        if (this.version === 0) {
            ct.drawImage(this.img, this.spritePosX, this.spritePosY, this.alienWidth, this.alienHeight, 0, 0, this.alienWidth, this.alienHeight);
        } else {
            ct.drawImage(this.img, this.spritePosX2, this.spritePosY, this.alienWidth, this.alienHeight, 0, 0, this.alienWidth, this.alienHeight);
        }

        ct.restore();
    },

    /**
     * Moves the alien to the left with one pixel muliplied with the velocity.
     *
     * @return {void}
     */
    moveLeft: function() {
        this.position.x -= 10 * this.velocity.x;
    },

    /**
     * Moves the alien to the right with one pixel muliplied with the velocity.
     *
     * @return {void}
     */
    moveRight: function() {
        this.position.x += 10 * this.velocity.x;
    },

    /**
     * Updates the movement of the alien and checks if the alien stays in the area.
     *
     * @return {void}
     */
    update: function() {
        this.version = (this.version + 1) % 2;

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
            this.newDirection = "right";
        }

        if (this.position.x + this.alienWidth > 890) {
            this.newDirection = "left";
        }
    },

    /**
     * Checks if a missile intersects with an alien. If so, the alien is hit.
     *
     * @param  {Object}  missilePos - The vector of the missile.
     *
     * @return {Boolean}  True if the alien has been hit, false otherwise.
     */
    alienHit: function(missilePos) {
        if (isIntersect(this.position.x, this.position.y, this.alienWidth, this.alienHeight, missilePos.x, missilePos.y, 3, 5)) {
            return true;
        } else {
            return false;
        }
    },

    /**
     * Checks if an alien intersects with the cannon. If so the alien has hit
     * the cannon.
     *
     * @param  {Object}  cannonPos - The vector of the cannon.
     *
     * @return {Boolean}   True if the alien has hit the cannon, false otherwise.
     */
    alienHitCannon: function(cannonPos) {
        if (isIntersect(this.position.x, this.position.y, this.alienWidth, this.alienHeight, cannonPos.x, cannonPos.y, 45, 25)) {
            return true;
        } else {
            return false;
        }
    }
};

function ExplodedAlien(position) {
    this.position           = position  || new Vector();
    this.width              = 35;
    this.height             = 25;
    this.img                = new window.Image();
    this.img.src            = "../img/game/alien_explode.png";
    this.timer              = 15;
}

ExplodedAlien.prototype = {

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
     * Decreases the timer with one. The timer controls how long the explosion
     * should be present.
     *
     * @return {void}
     */
    update: function() {
        this.timer--;
    },
};
