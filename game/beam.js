/**
 * The beam handler in the game.
 *
 * Handles one beam, fired by an alien, in the game and is resposible for
 * drawing, moving and checks if the beam has hit the cannon or one of the
 * cities and should then be removed.
 *
 */

/*global Vector */

/**
 * The beam constructor for the beam fired by an alien.
 *
 * Sets the beam specifications.
 *
 * @param {Object}  position    - the vector position for the alien in x and y led.
 * @param {Object}  cannons     - the cannons object containing the cannon.
 * @param {Object}  aliens      - the aliens object containing all aliens.
 * @param {Object}  cities      - the object containing the cities.
 */
function Beam(position, cannons, aliens, cities) {
    this.position           = position  || new Vector();
    this.cannons            = cannons;
    this.aliens             = aliens;
    this.cities             = cities;
    this.velocity           = new Vector(5, 5);
    this.width              = 3;
    this.height             = 5;
    this.shouldBeRemoved    = false;
    this.cannonHit          = false;
}

/**
 * The prototype of the beam describing the beam characteristics.
 *
 * @type {Object}
 */
Beam.prototype = {

    /**
     * Draws the beam as a red laser beam.
     *
     * @param  {Object}  ct - The canvas context.
     *
     * @return {void}
     */
    draw: function(ct) {
        ct.save();
        ct.fillStyle = "rgb(255, 0, 0)";
        ct.strokeStyle = "rgb(255, 0, 0)";
        ct.translate(this.position.x, this.position.y);
        ct.fillRect (0, 0, this.width, this.height);
        ct.restore();
    },

    /**
     * Moves the beam up with one pixel muliplied with the velocity.
     * The velocity is used to determine the speed of the beam movement.
     *
     * @return {void}
     */
    moveDown: function() {
        this.position.y += 1 * this.velocity.y;
    },

    /**
     * Updates the beam movement and check if the beam has reached the
     * bottom of the game board or has hit the gun.
     *
     * @return {void}
     */
    update: function() {
        this.moveDown();
        this.stayInArea();
        if (this.cannons.cannonsHit(this.position, this.width, this.height)) {
            this.shouldBeRemoved = true;
            this.cannonHit = true;
        }

        if (this.cities.beamHitsCities(this)) {
            this.shouldBeRemoved = true;
        }
    },

    /**
     * Checks if the beam has reached the bottom of the game board and then
     * should be removed.
     *
     * @return {void}
     */
    stayInArea: function() {
        if (this.position.y > 572 - this.height) {
            this.shouldBeRemoved = true;
        }
    }
};
