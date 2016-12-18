/**
 * The missiles handler in the game.
 *
 * Creates, removes and handles all missiles in the game.
 */

/*global AirExplosion */
/*global Audio */
/*global Missile */
/*global Vector */
/*global isIntersect */

/**
 * The missiles constructor.
 *
 * Sets the beams specifications.
 *
 * @param {Object} aliens       - contains all aliens.
 * @param {Object} cities       - contains all cities.
 * @param {Object} mysteryShips - contains the mystery ship.
 */
function Missiles(aliens, cities, mysteryShips) {
    this.aliens = aliens;
    this.cities = cities;
    this.mysteryShips = mysteryShips;
    this.missiles = [];
    this.airExplosions = [];
    this.airExplosion = new Audio("../sound/air_explosion.wav");
}

/**
 * The prototype of the missiles describing the characteristics of the missiles.
 *
 * @type {Object}
 */
Missiles.prototype = {

    /**
     * Draws all missiles.
     *
     * Draws all missiles that is stored in an array.
     *
     * @param  {Object}  ct - The canvas context.
     *
     * @return {void}
     */
    draw: function(ct) {
        for (var i = 0; i < this.missiles.length; i++) {
            this.missiles[i].draw(ct);
        }

        for (var j = 0; j < this.airExplosions.length; j++) {
            this.airExplosions[j].draw(ct);
        }
    },

    /**
     * Fires a missile by creating a missile and store the missile in the array
     * of missiles.
     *
     * @param  {Object}  position - The start vector of the missile.
     *
     * @return {void}
     */
    fire: function(position) {
        this.missiles.push(new Missile(position, this.aliens, this.cities, this.mysteryShips));
    },

    /**
     * Updates all missiles and removes a missile from the array if the missile
     * should be removed.
     *
     * @return {void}
     */
    update: function() {
        var i = 0;
        while (i < this.missiles.length) {
            this.missiles[i].update();
            if (this.missiles[i].shouldBeRemoved) {
                if (this.missiles[i].position.y < 130 || this.missiles[i].hitsBeam) {
                    this.airExplosions.push(new AirExplosion(new Vector(this.missiles[i].position.x, this.missiles[i].position.y)));
                    this.airExplosion.pause();
                    this.airExplosion.currentTime = 0;
                    this.airExplosion.play();
                }

                this.missiles.shift();
            }
            i++;
        }

        for (var j = this.airExplosions.length -1; j >= 0; j--) {
            this.airExplosions[j].update();

            if (this.airExplosions[j].timer === 0) {
                this.airExplosions.splice(j, 1);
            }
        }

        this.missileHitsBeam();
        this.missileHitsRay();
    },

    /**
     * Checks if a missile hits a beam fired by an alien.
     *
     * @return {Void}
     */
    missileHitsBeam: function() {
        var beams = this.aliens.beams.beams;
        for (var i = 0; i < this.missiles.length; i++) {
            for (var j = 0; j < beams.length; j++) {
                if (isIntersect(this.missiles[i].position.x, this.missiles[i].position.y, this.missiles[i].width, this.missiles[i].height, beams[j].position.x, beams[j].position.y, beams[j].width, beams[j].height)) {
                    this.missiles[i].hitsBeam = true;
                    this.missiles[i].shouldBeRemoved = true;
                    beams[j].shouldBeRemoved = true;
                }
            }
        }
    },

    /**
     * Checks if a missile hits a ray fired by an alien.
     * @return {[type]} [description]
     */
    missileHitsRay: function() {
        var rays = this.aliens.rays.rays;
        for (var i = 0; i < this.missiles.length; i++) {
            for (var j = 0; j < rays.length; j++) {
                if (isIntersect(this.missiles[i].position.x, this.missiles[i].position.y, this.missiles[i].width, this.missiles[i].height, rays[j].position.x, rays[j].position.y, rays[j].width, rays[j].height)) {
                    this.missiles[i].hitsBeam = true;
                    this.missiles[i].shouldBeRemoved = true;
                    rays[j].shouldBeRemoved = true;
                }
            }
        }
    }
};
