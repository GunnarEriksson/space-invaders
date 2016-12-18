/**
 * The cannons handler in the game.
 *
 * Creates, removes and handles all cannons in the game.
 */

/*global Cannon */
/*global Vector */

/**
 * The cannons constructor.
 *
 * Sets cannons specifications.
 *
 * @param {Object} aliens       - the aliens object containing all aliens.
 * @param {Object} cities       - the cities object containing all cities.
 * @param {Object} mysteryShips - the object containing the mystery ship object.
 */
function Cannons(aliens, cities, mysteryShips) {
    this.aliens = aliens;
    this.cities = cities;
    this.mysteryShips = mysteryShips;
    this.cannons = [];
    this.cannonHit = false;
    this.timer = 180;
    aliens.createBeamsAndRays(this);
}

/**
 * The prototype of the cannons describing the characteristics of the cannons.
 *
 * @type {Object}
 */
Cannons.prototype = {
    /**
     * Creats three cannon objects. One is place behind the first city and the
     * other two are placed below ground as spares.
     *
     * @param  {Integer} height - the height of the game board.
     *
     * @return {void}
     */
    start: function(height) {
        this.cannons.push(new Cannon(new Vector(150, height-128), this.aliens, this.cities, this.mysteryShips));
        this.cannons.push(new Cannon(new Vector(10, height-40), this.aliens, this.cities, this.mysteryShips));
        this.cannons.push(new Cannon(new Vector(70, height-40), this.aliens, this.cities, this.mysteryShips));
    },

    /**
     * Draws all cannons.
     *
     * @param  {Object}  ct - The canvas context.
     *
     * @return {Void}
     */
    draw: function(ct) {
        for (var i = 0; i < this.cannons.length; i++) {
            this.cannons[i].draw(ct);
        }
    },

    /**
     * Updates the cannons. If a cannon is destroyd, a spare cannon is moved
     * up to the game bord behind the first city until all cannons are destroyd
     * (game over). When a cannon is destroyd, a timer delays the moving of the
     * next cannon so an exploding cannon could be showed.
     *
     * @param  {[type]} td      - not used.
     * @param  {Integer} width  - the width of the game board.
     *
     * @return {Void}
     */
    update: function(td, width) {

        if (this.cannons.length > 0) {
            this.cannons[0].update(td, width);

            if (this.cannons[0].shouldBeRemoved) {
                this.timer--;
                if (this.timer === 0) {
                    this.cannons.shift();
                    if (this.cannons.length > 1) {
                        this.cannons[0].position.x = 150;
                        this.cannons[0].position.y = 750-128;
                        this.cannons[1].position.x = 10;
                        this.cannons[1].position.y = 750-40;
                    } else if (this.cannons.length > 0) {
                        this.cannons[0].position.x = 150;
                        this.cannons[0].position.y = 750-128;
                    }
                    this.timer = 180;
                }
            }
        }
    },

    /**
     * Checks if the cannon has been hit by an alien beam or ray.
     *
     * @param  {Object} beamRayPos      - the vector position of the beam or ray.
     * @param  {Integer} beamRayWidth    - the width of the beam or ray.
     * @param  {Integer} beamRayHeight   - the height of the beam or ray.
     *
     * @return {Void}
     */
    cannonsHit: function(beamRayPos, beamRayWidth, beamRayHeight) {
        if (this.cannons.length > 0) {
            return this.cannons[0].cannonHit(beamRayPos, beamRayWidth, beamRayHeight);
        } else {
            return false;
        }
    },
};
