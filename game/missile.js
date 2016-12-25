/**
 * The missile handler in the game.
 *
 * Handles one missile, fired by the cannon, in the game and is resposible for
 * drawing, moving and checks if the missile has hit a ray, beam, alien or a
 * city. Checks also if the missile has reached the top of the game board.
 *
 */

/*global Vector */

/**
 * The missile fired by cannon.
 *
 * @param {Object}  position - The vector position for the cannon.
 * @param {Object}  velocity - The velocity of the missile movement as vector.
 * @param {Object}  aliens - The aliens object containing all aliens.
 */
function Missile(position, aliens, cities, mysteryShips) {
    this.position           = position  || new Vector();
    this.aliens             = aliens;
    this.cities             = cities;
    this.mysteryShips       = mysteryShips;
    this.velocity           = new Vector(8, 8);
    this.width              = 3;
    this.height             = 5;
    this.shouldBeRemoved    = false;
    this.hitsBeam           = false;

}

/**
 * The prototype of the missile describing the characteristics of the missiles.
 *
 * @type {Object}
 */
Missile.prototype = {

    /**
     * Draws the missile as a green laser beam.
     *
     * @param  {Object}  ct - The canvas context.
     *
     * @return {void}
     */
    draw: function(ct) {
        ct.save();
        ct.fillStyle = "rgb(79, 255, 48)";
        ct.strokeStyle = "rgb(79, 255, 48)";
        ct.translate(this.position.x, this.position.y);
        ct.fillRect (0, 0, this.width, this.height);
        ct.restore();
    },

    /**
     * Moves the missile up with one pixel muliplied with the velocity.
     * The velocity is used to determine the speed of the missiles movement.
     *
     * @return {void}
     */
    moveUp: function() {
        this.position.y -= 1 * this.velocity.y;
    },

    /**
     * Updates the missile movement and check if the missile has reached the
     * top of the game board or has hit an alien.
     *
     * @return {void}
     */
    update: function() {
        this.moveUp();
        this.stayInArea();
        if (this.aliens.aliensHit(this.position)) {
            this.shouldBeRemoved = true;
        }

        if (this.cities.missileHitsCities(this)) {
            this.shouldBeRemoved = true;
        }

        if (this.mysteryShips.mysteryShipsHit(this)) {
            this.shouldBeRemoved = true;
        }
    },

    /**
     * Checks if the missile has reached the top of the game board and then
     * should be removed.
     *
     * @return {void}
     */
    stayInArea: function() {
        if (this.position.y < 80) {
            this.shouldBeRemoved = true;
        }
    }
};
