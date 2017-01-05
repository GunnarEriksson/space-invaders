/**
 * The rays handler in the game.
 *
 * Creates, removes and handles all rays in the game fired by aliens.
 */

/*global Audio */
/*global GroundExplosion */
/*global Ray */
/*global Vector */

/**
 * The beams object.
 * Used to control all beams.
 *
 * @param {Object}  cannon - Contains cannon.
 * @param {Object}  aliens - Contains all aliens.
 */
/**
 * The rays constructor.
 *
 * Sets the rays specifications.
 *
 * @param {Object} cannons  - the cannons object containing all cannons.
 * @param {Object} aliens   - the aliens object containing all aliens.
 * @param {Object} cities   - the cities object containing all cities.
 */
function Rays(cannons, aliens, cities) {
    this.cannons = cannons;
    this.aliens = aliens;
    this.cities = cities;
    this.rays = [];
    this.groundExplosions = [];
    this.alienRay = new Audio("sound/alien_missile.wav");
    this.alienRay.volume = 0.3;
    this.groundExplosion = new Audio("sound/ground_explosion.wav");
}

/**
 * The prototype of the rays describing the rays characteristics.
 *
 * @type {Object}
 */
Rays.prototype = {
    start: function() {
        this.rays = [];
        this.groundExplosions = [];
    },

    /**
     * Draws all rays and the belonging ground explosion, if present in the
     * arrays.
     *
     * @param  {Object}  ct - The canvas context.
     *
     * @return {void}
     */
    draw: function(ct) {
        for (var i = 0; i < this.rays.length; i++) {
            this.rays[i].draw(ct);
        }

        for (var j = 0; j < this.groundExplosions.length; j++) {
            this.groundExplosions[j].draw(ct);
        }
    },

    /**
     * Creates a ray which start point is in the middle bottom of the alien who
     * fires the ray. Creats a sound when the ray is fired.
     *
     * @param  {Object} alien - the alien who fires the ray.
     *
     * @return {Void}
     */
    fire: function(alien) {
        var rayPosX = alien.position.x + ((alien.alienWidth / 2) - 3);
        var rayPosY = alien.position.y + alien.alienHeight;
        this.rays.push(new Ray(new Vector(rayPosX, rayPosY), this.cannons, this.aliens, this.cities));
        if (this.alienRay.currentTime > 0) {
            this.alienRay.pause();
            this.alienRay.currentTime = 0;
        }
        this.alienRay.play();
    },

    /**
     * Updates the movement of the ray and checks if the ray should be removed.
     * If the ray is removed, a ground explosion is created.
     * Controls via a timer how long the ground explosion should be present before
     * it is removed.
     *
     * @return {Void}
     */
    update: function() {
        for (var i = this.rays.length -1; i >= 0; i--) {
            this.rays[i].update();
            if (this.rays[i].shouldBeRemoved) {
                if (!this.rays[i].cannonHit) {
                    this.groundExplosions.push(new GroundExplosion(new Vector(this.rays[i].position.x, this.rays[i].position.y + 10)));
                    if (this.groundExplosion.currentTime > 0) {
                        this.groundExplosion.pause();
                        this.groundExplosion.currentTime = 0;
                    }
                    this.groundExplosion.play();
                }

                this.rays.splice(i, 1);
            }
        }

        for (var j = this.groundExplosions.length -1; j >= 0; j--) {
            this.groundExplosions[j].update();

            if (this.groundExplosions[j].timer === 0) {
                this.groundExplosions.splice(j, 1);
            }
        }
    },
};
