/**
 * The alien handler in the game.
 *
 * Handles one alien in the game and is resposible for drawing, moving and checks
 * if the alien has hit by a missile or if an aliens hits the cannon (game over).
 *
 * It also handles the image of an exploded alien when the alien has been hit
 * by a missile from the cannon.
 *
 */

/*global Vector */
/*global isIntersect */

/**
 * The alien constructor
 *
 * Sets the alien specifications.
 *
 * @param {Object} position         - the position of the alien in x and y led.
 * @param {string} direction        - the direction (left or right) of the alien.
 * @param {Object} alien            - the characteristics of the alien.
 * @param {number} gameBoardWidth  - the widht of the game board.
 */
function Alien(position, direction, alien, gameBoardWidth) {
    this.position           = position  || new Vector();
    this.direction          = direction || "right";
    this.newDirection       = direction || "right";
    this.alienWidth         = alien.width;
    this.alienHeight        = alien.height;
    this.spritePosX         = alien.spritePosX;
    this.spritePosY         = alien.spritePosY;
    this.spritePosX2        = alien.spritePosX2;
    this.points             = alien.points;
    this.gameBoardWidth     = gameBoardWidth;
    this.velocity           = new Vector(0.4, 0.4);
    this.shouldBeRemoved    = false;
    this.img                = new window.Image();
    this.img.src            = "img/game/space_invaders.png";
    this.version            = 0;
    this.jumpDistance       = 10;
    this.playgroundOffset   = 10;
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
     * @param  {number}  td  - Time difference offset
     *
     * @return {void}
     */
    moveLeft: function(td) {
        this.position.x -= this.jumpDistance * this.velocity.x * td;
    },

    /**
     * Moves the alien to the right with one pixel muliplied with the velocity.
     *
     * @param  {number}  td  - Time difference offset
     *
     * @return {void}
     */
    moveRight: function(td) {
        this.position.x += this.jumpDistance * this.velocity.x * td;
    },

    /**
     * Updates the movement of the alien and checks if the alien stays in the area.
     *
     * @param  {number}  td  - Time difference offset
     *
     * @return {void}
     */
    update: function(td) {
        this.version = (this.version + 1) % 2;

        if (this.direction === "right") {
            this.moveRight(td);
        } else {
            this.moveLeft(td);
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
        if (this.position.x < this.playgroundOffset) {
            this.newDirection = "right";
        }

        if (this.position.x + this.alienWidth > (this.gameBoardWidth - this.playgroundOffset)) {
            this.newDirection = "left";
        }
    },

    /**
     * Checks if a missile intersects with an alien. If so, the alien is hit.
     *
     * @param  {Object}  missilePos - The vector of the missile.
     *
     * @return {boolean}  True if the alien has been hit, false otherwise.
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
     * @return {boolean}   True if the alien has hit the cannon, false otherwise.
     */
    alienHitCannon: function(cannonPos) {
        if (isIntersect(this.position.x, this.position.y, this.alienWidth, this.alienHeight, cannonPos.x, cannonPos.y, 45, 25)) {
            return true;
        } else {
            return false;
        }
    }
};

/**
 * The exploded alien constructor
 *
 * Handles the image of an exploded alien when the alien is hit by a missile
 * from the cannon. A timer determines how long the image should be shown.
 *
 * @param {Object} position the position of the exploded alien in x and y led.
 */
function ExplodedAlien(position) {
    this.position           = position  || new Vector();
    this.width              = 35;
    this.height             = 25;
    this.img                = new window.Image();
    this.img.src            = "img/game/alien_explode.png";
    this.timer              = 15;
}

/**
 * The prototype of the exploded alien describing the characteristics of the
 * exploded alien.
 *
 * @type {Object}
 */
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
