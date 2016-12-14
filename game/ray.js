/*global Vector */

function Ray(position, cannons, aliens, cities) {
    this.position           = position  || new Vector();
    this.cannons            = cannons;
    this.aliens             = aliens;
    this.cities             = cities;
    this.velocity           = new Vector(4, 4);
    this.width              = 6;
    this.height             = 11;
    this.shouldBeRemoved    = false;
    this.cannonHit          = false;

    this.rayImg              = new window.Image();
    this.rayImg.src          = "../img/game/ray.png";
}

/**
 * The prototype of the beam describing the beam characteristics.
 *
 * @type {Object}
 */
Ray.prototype = {

    /**
     * Draws the beam as a red laser beam.
     *
     * @param  {Object}  ct - The canvas context.
     *
     * @return {void}
     */
    draw: function(ct) {
        ct.save();
        ct.translate(this.position.x, this.position.y);
        ct.drawImage(this.rayImg, 0, 0, this.width, this.height);
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
        if (this.cannons.cannonsHit(this.position)) {
            this.shouldBeRemoved = true;
            this.cannonHit = true;
        }

        if (this.cities.rayHitsCities(this)) {
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
        if (this.position.y > 650 - this.height) {
            this.shouldBeRemoved = true;
        }
    }
};
