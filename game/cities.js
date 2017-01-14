/**
 * The cities handler in the game.
 *
 * Creates and checks if the cities are hit by a missile from the cannon or a
 * beam or ray from an alien.
 */

/*global City */
/*global Vector */

/**
 * The cities constructor
 *
 * Sets the cities specifications.
 *
 * @param {number} gameBoardWidth  - the width of the game board.
 */
function Cities(gameBoardWidth) {
    this.gameBoardWidth = gameBoardWidth;
    this.cityCanvas = document.createElement("canvas");
    this.cityCt = this.cityCanvas.getContext("2d");
    this.posY = 55;
    this.height = 55;
    this.cities = [];
}

/**
 * The prototype of the cities describing the characteristics of the cities.
 *
 * @type {Object}
 */
Cities.prototype = {

    /**
     * Creates three cities on a separate canvas (not the game board canvas).
     * The cities is not redrawn because the cities are damaged by the missiles,
     * beams and rays.
     *
     * @return {void}
     */
    start: function() {
        this.cityCanvas.width = this.gameBoardWidth;
        this.cityCanvas.height = 55;

        var posX = 130;
        for (var i = 0; i < 4; i++) {
            this.cities.push(new City(this.cityCt, new Vector(posX, this.posY)));
            posX += 200;
        }

        for (var j = 0; j < this.cities.length; j++) {
            this.cities[j].draw(this.cityCt);
        }
    },

    /**
     * Checks if a missile from the cannon hits a city.
     *
     * @param  {Object} missile - the missile object.
     *
     * @return {void}
     */
    missileHitsCities: function(missile) {
        for (var i = 0; i < this.cities.length; i++) {
            if (this.cities[i].missileHitsCity(missile)) {
                return true;
            }
        }

        return false;
    },

    /**
     * Checks if a beam from an alien hits a city.
     *
     * @param  {Object} beam - the beam object.
     *
     * @return {void}
     */
    beamHitsCities: function(beam) {
        for (var i = 0; i < this.cities.length; i++) {
            if (this.cities[i].beamHitsCity(beam)) {
                return true;
            }
        }

        return false;
    },

    /**
     * Checks if a ray from an alien hits a city.
     *
     * @param  {Object} ray - the ray object.
     *
     * @return {void}
     */
    rayHitsCities: function(ray) {
        for (var i = 0; i < this.cities.length; i++) {
            if (this.cities[i].rayHitsCity(ray)) {
                return true;
            }
        }

        return false;
    },
};
