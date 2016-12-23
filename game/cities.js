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
 */
function Cities() {
    this.cityCanvas = null;
    this.cityCt = null;
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
     * @return {Void}
     */
    start: function() {
        this.cityCanvas = document.createElement("canvas");
        this.cityCanvas.width = 900;
        this.cityCanvas.height = 55;
        this.cityCt = this.cityCanvas.getContext("2d");

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
     * @return {Void}
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
     * @return {Void}
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
     * @return {Void}
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
