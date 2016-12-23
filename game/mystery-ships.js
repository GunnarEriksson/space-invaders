/**
 * The mystery ships handler in the game.
 *
 * Creates, removes and handles all mystery ships in the game.
 */

/*global Audio */
/*global Guer */
/*global ExplodedMysteryShip */
/*global MysteryShip */
/*global Vector */

/**
 * The mystery ships constructor.
 *
 * Sets the mystery ships specifications.
 *
 * @param {Integer} score   - the score for hitting the mystery ship.
 */
function MysteryShips(score) {
    this.score                  = score;
    this.mysteryShips           = null;
    this.explodedMysteryShips   = null;
    this.aliensDirection        = null;
    this.timer                  = null;
    this.moveSoundVersion       = null;
    this.mysteryShipExplosion   = new Audio("sound/alien_explosion.wav");
    this.shipMoveSound          = new Audio("sound/ufo_highpitch.wav");
}

/**
 * The prototype of the mystery ships describing the characteristics of the
 * mystery ships.
 *
 * @type {Object}
 */MysteryShips.prototype = {
    start: function() {
        this.mysteryShips           = [];
        this.explodedMysteryShips   = [];
        this.aliensDirection        = "left";
        this.timer                  = Guer.random(1600, 1900);
        this.moveSoundVersion       = 0;
    },

    /**
     * Draws all mystery ship and the exploded mystery ship, if present.
     *
     * @param  {Object}  ct - The canvas context.
     *
     * @return {void}
     */
    draw: function(ct) {
        for (var i = 0; i < this.mysteryShips.length; i++) {
            this.mysteryShips[i].draw(ct);
        }

        for (var j = 0; j < this.explodedMysteryShips.length; j++) {
            this.explodedMysteryShips[j].draw(ct);
        }
    },

    /**
     * Checks if mystery ship has been hit by a missile. If the an mystery ship
     * has been hit, it is marked to be removed.
     *
     * @param  {Object}  missile - the missile object.
     *
     * @return {Boolean}  True if an alien has been hit by a missile, false otherwise.
     */
    mysteryShipsHit: function(missile) {
        for (var i = 0; i < this.mysteryShips.length; i++) {
            if (this.mysteryShips[i].mysteryShipHit(missile)) {
                this.mysteryShips[i].shouldBeRemoved = true;
                return true;
            }
        }

        return false;
    },

    /**
     * Updates all aliens. Removes aliens that have been hit by a missile from
     * the array of aliens. Plays an sound of explosion when an alien is hit.
     * Sets the dirction of all aliens and updates the beams fired by the aliens.
     *
     * @return {void}
     */
    /**
     * Decreases a time, set by a random value, to check if a mystery ship should
     * be created an started. The direction of the ship is randomly choosen.
     *
     * If the ship is hit by a missle the ship is removed and an exploded mystery
     * ship is created. A timer controls how long the exploded mystery ship should
     * be present.
     *
     * @return {void}
     */
    update: function() {
        if (this.mysteryShips.length === 0) {
            this.timer--;
        }

        if (this.timer === 0) {
            var direction = Guer.random(0, 1);
            if (direction > 0) {
                this.mysteryShips.push(new MysteryShip(new Vector(850, 90), "left"));
            } else {
                this.mysteryShips.push(new MysteryShip(new Vector(15, 90), "right"));
            }

            this.timer = Guer.random(1600, 1900);
        }

        for (var i = this.mysteryShips.length -1; i >= 0; i--) {
            this.moveSoundVersion = (this.moveSoundVersion + 1) % 3;
            if (this.moveSoundVersion === 0) {
                this.shipMoveSound.play();
            }

            this.mysteryShips[i].update();

            if (this.mysteryShips[i].shouldBeRemoved) {
                if (!this.mysteryShips[i].reachedBorder) {
                    var points = Guer.random(40, 80);
                    this.explodedMysteryShips.push(new ExplodedMysteryShip(new Vector(this.mysteryShips[i].position.x, this.mysteryShips[i].position.y), points));
                    this.score.addScore(points);
                    this.mysteryShipExplosion.pause();
                    this.mysteryShipExplosion.currentTime = 0;
                    this.mysteryShipExplosion.play();
                }

                this.mysteryShips.splice(i, 1);
            }
        }

        for (var j = this.explodedMysteryShips.length -1; j >= 0; j--) {
            this.explodedMysteryShips[j].update();

            if (this.explodedMysteryShips[j].timer === 0) {
                this.explodedMysteryShips.splice(j, 1);
            }
        }
    },
};
