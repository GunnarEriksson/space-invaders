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
function Rays(cannons, aliens, cities) {
    this.cannons = cannons;
    this.aliens = aliens;
    this.cities = cities;
    this.rays = [];
    this.groundExplosions = [];
    this.alienRay = new Audio("../sound/alien_missile.wav");
    this.alienRay.volume = 0.3;
    this.groundExplosion = new Audio("../sound/ground_explosion.wav");
}

/**
 * The beam prototype which controls all beams.
 * @type {Object}
 */
Rays.prototype = {
    start: function() {
        this.rays = [];
        this.groundExplosions = [];
    },

    /**
     * Draws all beams.
     *
     * Draws all beams that is stored in an array.
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
     * Fires a beam by creating a beam and store the beam in the array
     * of beams. The beams are fired with an delay and it is a randomly choosen
     * alien that fires the beam. Only aliens without an another alien below
     * could fire a beam.
     *
     * @return {void}
     */
    fire: function(alien) {
        var rayPosX = alien.position.x + ((alien.alienWidth / 2) - 3);
        var rayPosY = alien.position.y + alien.alienHeight;
        this.rays.push(new Ray(new Vector(rayPosX, rayPosY), this.cannons, this.aliens, this.cities));
        this.alienRay.pause();
        this.alienRay.currentTime = 0;
        this.alienRay.play();
    },

    /**
     * Updates all beams and removes a beam from the array if the beam
     * should be removed.
     *
     * @return {void}
     */
    update: function() {
        for (var i = this.rays.length -1; i >= 0; i--) {
            this.rays[i].update();
            if (this.rays[i].shouldBeRemoved) {
                if (!this.rays[i].cannonHit) {
                    this.groundExplosions.push(new GroundExplosion(new Vector(this.rays[i].position.x, this.rays[i].position.y + 10)));
                    this.groundExplosion.pause();
                    this.groundExplosion.currentTime = 0;
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
