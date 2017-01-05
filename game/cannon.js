/**
 * The cannon handler in the game.
 *
 * Handles one cannon in the game and is resposible for drawing, moving and checks
 * if the cannon has hit by a beam or a ray from the aliens. It also checks if
 * the cannon is hit by an alien (game over).
 *
 * Creates a missile if a gamer fires a missile.
 *
 */

/*global Audio */
/*global Key */
/*global Missiles */
/*global Vector */
/*global isIntersect */

/**
 * The cannon constructor.
 *
 * Sets the cannon specifications.
 *
 * @param {[type]} position     - the position for the cannon in x and y led.
 * @param {[type]} aliens       - the aliens object containing all aliens.
 * @param {[type]} cities       - the cities object containing all cities.
 * @param {[type]} mysteryShips - the object containing the mystery ship object.
 */
function Cannon(position, aliens, cities, mysteryShips) {
    this.aliens                 = aliens;
    this.missiles               = new Missiles(aliens, cities, mysteryShips);
    this.position               = position;
    this.velocity               = new Vector(4, 4);
    this.cannonWidth            = 45;
    this.cannonHeight           = 28;
    this.shouldBeRemoved        = false;
    this.cannonExplosionPlayed  = false;
    this.explodedVersion        = 0;
    this.alienCapturesCannon    = false;

    this.cannonImg              = new window.Image();
    this.cannonImg.src          = "img/game/cannon.png";
    this.explodedCannonImg      = new window.Image();
    this.explodedCannonImg.src  = "img/game/cannon_exploded.png";
    this.explodedCannon2Img     = new window.Image();
    this.explodedCannon2Img.src = "img/game/cannon_exploded2.png";

    this.cannonMissile          = new Audio("sound/cannon_missile.wav");
    this.cannonMissile.volume   = 0.3;

    this.cannonExplosion        = new Audio("sound/cannon_explosion.wav");
    this.cannonExplosion.volume = 0.3;
}

/**
 * The prototype of the cannon describing the characteristics of the cannon.
 *
 * @type {Object}
 */
Cannon.prototype = {
    /**
     * Draws the cannon in a normal state and after the cannon has been hit by
     * aliens.
     *
     * @param  {Object}  ct - The canvas context.
     *
     * @return {void}
     */
    draw: function(ct) {
        if (!this.shouldBeRemoved) {
            ct.save();
            ct.translate(this.position.x, this.position.y);
            ct.drawImage(this.cannonImg, 0, 0, this.cannonWidth, this.cannonHeight);
            ct.restore();
        } else {
            if (!this.cannonExplosionPlayed) {
                this.cannonExplosion.play();
                this.cannonExplosionPlayed = true;
            }

            ct.save();
            ct.translate(this.position.x, this.position.y);
            this.explodedVersion = (this.explodedVersion + 1) % 20;
            if (this.explodedVersion < 10) {
                ct.drawImage(this.explodedCannonImg, 0, 0, this.cannonWidth, this.cannonHeight);
            } else {
                ct.drawImage(this.explodedCannon2Img, 0, 0, this.cannonWidth, this.cannonHeight);
            }

            ct.restore();
        }

        this.missiles.draw(ct);
    },

    /**
     * Moves the cannon to the left with one pixel muliplied with the velocity.
     * The velocity is used to determine the speed of the cannons movement.
     *
     * @return {void}
     */
    moveLeft: function() {
        if (!this.shouldBeRemoved) {
            this.position.x -= 1 * this.velocity.x;
        }
    },

    /**
     * Moves the cannon to the right with one pixel muliplied with the velocity.
     * The velocity is used to determine the speed of the cannons movement.
     *
     * @return {void}
     */
    moveRight: function() {
        if (!this.shouldBeRemoved) {
            this.position.x += 1 * this.velocity.x;
        }
    },

    /**
     * Fires the cannon. Checks if no missile is in the space before firing the
     * cannon. If no missile is on the way, the position of the barrel of the
     * cannon is set. Plays a sound when the cannon is fired.
     *
     * @return {void}
     */
    fire: function() {
        if (this.missiles.missiles.length === 0 && !this.shouldBeRemoved) {
            var gunPosX = this.position.x + 21;
            var gunPosY = this.position.y;
            this.missiles.fire(new Vector(gunPosX, gunPosY));
            if (this.cannonMissile.currentTime > 0) {
                this.cannonMissile.pause();
                this.cannonMissile.currentTime = 0;
            }
            this.cannonMissile.play();
        }
    },

    /**
     * Checks if the left, right or space key has been pressed to call respective
     * function. Call the missile function to update the missile movement and to
     * check if aliens has hit the cannon. Checks so the cannon stays in the areay.
     *
     * @param  {number}  width - the width of the cannon.
     *
     * @return {void}
     */
    update: function(td, width) {
        if (Key.isDown(Key.LEFT))   this.moveLeft();
        if (Key.isDown(Key.RIGHT))  this.moveRight();
        if (Key.isDown(Key.SPACE))  this.fire();
        this.missiles.update();
        this.aliensHitCannon();
        this.stayInArea(width);
    },

    /**
     * Checks that the cannon stays on the game board.
     *
     * @param  {number}  width - the width of the cannon.
     *
     * @return {void}
     */
    stayInArea: function(width) {
        if (this.position.x > (width - this.cannonWidth)) {
            this.position.x = (width - this.cannonWidth);
        }

        if (this.position.x < 0) {
            this.position.x = 0;
        }
    },

    /**
     * Checks if the cannon isIntersects with the aliens beams. If they are, the
     * cannon is hit by the an alien beam.
     *
     * @param  {Object}  beamRayPos     - the vector position of an alien beam or ray.
     * @param  {Integer}  beamRayWidth  - the width of the beam or ray.
     * @param  {Integer}  beamRayHeight - the height of the beam or ray.
     *
     * @return {Boolean}  True if the cannon is hit by an alien beam, false otherwise.
     */
    cannonHit: function(beamRayPos, beamRayWidth, beamRayHeight) {
        if (isIntersect(this.position.x, this.position.y, this.cannonWidth, this.cannonHeight, beamRayPos.x, beamRayPos.y, beamRayWidth, beamRayHeight)) {
            this.shouldBeRemoved = true;
            return true;
        } else {
            return false;
        }
    },

    /**
     * Calls the aliens object to check if an alien has collided with the cannon.
     * If the have, the game is over and the player has lost.
     *
     * @return {void}
     */
    aliensHitCannon: function() {
        if (this.aliens.aliensHitCannon(this.position)) {
            this.shouldBeRemoved = true;
            this.alienCapturesCannon = true;
        }
    }
};
