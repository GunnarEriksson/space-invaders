/**
 * The beams handler in the game.
 *
 * Creates, removes and handles all beams in the game.
 */

/*global Audio */
/*global Beam */
/*global GroundExplosion */
/*global Vector */

/**
 * The beams constructor.
 *
 * Sets the beams specifications.
 *
 * @param {Object}  cannon - Contains cannon.
 * @param {Object}  aliens - Contains all aliens.
 * @param {Object}  cities - the object containing the cities.
 */
function Beams(cannons, aliens, cities) {
    this.cannons = cannons;
    this.aliens = aliens;
    this.cities = cities;
    this.beams = [];
    this.groundExplosions = [];
    this.alienMissile = new Audio("sound/alien_missile.wav");
    this.alienMissile.volume = 0.3;
    this.groundExplosion = new Audio("sound/ground_explosion.wav");
}

/**
 * The prototype of the beams describing the characteristics of the beams.
 *
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
     * @param  {Objecy} alien - the alien object.
     * @return {void}
     */
    fire: function(alien) {
        var beamPosX = alien.position.x + (alien.alienWidth / 2);
        var beamPosY = alien.position.y + alien.alienHeight;
        this.beams.push(new Beam(new Vector(beamPosX, beamPosY), this.cannons, this.aliens, this.cities));
        if (this.alienMissile.currentTime > 0) {
            this.alienMissile.pause();
            this.alienMissile.currentTime = 0;
        }
        this.alienMissile.play();
    },

    /**
     * Updates all beams and removes a beam from the array if the beam
     * should be removed when hitting the cannon or the city.
     *
     * @param  {number}  td  - Time difference offset
     *
     * @return {void}
     */
    update: function(td) {
        for (var i = this.beams.length -1; i >= 0; i--) {
            this.beams[i].update(td);
            if (this.beams[i].shouldBeRemoved) {
                if (!this.beams[i].cannonHit) {
                    this.groundExplosions.push(new GroundExplosion(new Vector(this.beams[i].position.x, this.beams[i].position.y + 3)));
                    if (this.groundExplosion.currentTime > 0) {
                        this.groundExplosion.pause();
                        this.groundExplosion.currentTime = 0;
                    }
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
