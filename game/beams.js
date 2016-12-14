/*global Audio */
/*global Beam */
/*global GroundExplosion */
/*global Vector */

/**
 * The beams object.
 * Used to control all beams.
 *
 * @param {Object}  cannon - Contains cannon.
 * @param {Object}  aliens - Contains all aliens.
 */
function Beams(cannons, aliens, cities) {
    this.cannons = cannons;
    this.aliens = aliens;
    this.cities = cities;
    this.beams = [];
    this.groundExplosions = [];
    this.alienMissile = new Audio("../sound/alien_missile.wav");
    this.alienMissile.volume = 0.3;
    this.groundExplosion = new Audio("../sound/ground_explosion.wav");
}

/**
 * The beam prototype which controls all beams.
 * @type {Object}
 */
Beams.prototype = {
    start: function() {
        this.beams = [];
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
        for (var i = 0; i < this.beams.length; i++) {
            this.beams[i].draw(ct);
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
        var beamPosX = alien.position.x + (alien.alienWidth / 2);
        var beamPosY = alien.position.y + alien.alienHeight;
        this.beams.push(new Beam(new Vector(beamPosX, beamPosY), this.cannons, this.aliens, this.cities));
        this.alienMissile.pause();
        this.alienMissile.currentTime = 0;
        this.alienMissile.play();
    },

    /**
     * Updates all beams and removes a beam from the array if the beam
     * should be removed.
     *
     * @return {void}
     */
    update: function() {
        for (var i = this.beams.length -1; i >= 0; i--) {
            this.beams[i].update();
            if (this.beams[i].shouldBeRemoved) {
                if (!this.beams[i].cannonHit) {
                    this.groundExplosions.push(new GroundExplosion(new Vector(this.beams[i].position.x, this.beams[i].position.y + 3)));
                    this.groundExplosion.pause();
                    this.groundExplosion.currentTime = 0;
                    this.groundExplosion.play();
                }

                this.beams.splice(i, 1);
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
