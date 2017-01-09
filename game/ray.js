/**
 * The ray handler in the game.
 *
 * Handles one ray, fired by an alien, in the game and is resposible for
 * drawing, moving and checks if the ray has hit the cannon or a city and
 * then should be removed.
 *
 */

/*global Vector */

/**
 * The ray constructor.
 *
 * Sets the ray specifications.
 *
 * @param {Object}  position    - the vector position for the ray in x and y led.
 * @param {Object} cannons      - the cannons object containing all cannons.
 * @param {Object} aliens       - the aliens object containing all aliens.
 * @param {Object} cities       - the cities object containing all cities.
 */
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
    this.rayImg.src          = "img/game/ray.png";
}

/**
 * The prototype of the ray describing the ray characteristics.
 *
 * @type {Object}
 */
Ray.prototype = {

    /**
     * Draws the ray using an image.
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
     * Moves the ray down with one pixel muliplied with the velocity.
     * The velocity is used to determine the speed of the ray movement.
     *
     * @param  {number}  td  - Time difference offset
     *
     * @return {void}
     */
    moveDown: function(td) {
        this.position.y += td * this.velocity.y;
    },

    /**
     * Updates the ray movement and check if the beam has reached the
     * bottom of the game board or has hit the gun or city.
     *
     * @param  {number}  td  - Time difference offset
     *
     * @return {void}
     */
    update: function(td) {
        this.moveDown(td);
        this.stayInArea();
        if (this.cannons.cannonsHit(this.position, this.width, this.height)) {
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
        if (this.position.y > 572 - this.height) {
            this.shouldBeRemoved = true;
        }
    }
};
