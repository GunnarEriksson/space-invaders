/*global City */
/*global Vector */

function Cities() {
    this.cityCanvas = null;
    this.cityCt = null;
    this.posY = 580;
    this.height = 55;
    this.cities = [];
}

/**
 * The beam prototype which controls all beams.
 * @type {Object}
 */
Cities.prototype = {

    /**
     * Draws all beams.
     *
     * Draws all beams that is stored in an array.
     *
     * @param  {Object}  ct - The canvas context.
     *
     * @return {void}
     */
    start: function() {
        this.cityCanvas = document.createElement("canvas");
        this.cityCanvas.width = 900;
        this.cityCanvas.height = 55;
        this.cityCt = this.cityCanvas.getContext("2d");

        var posX = 130;
        for (var i = 0; i < 4; i++) {
            this.cities.push(new City(this.cityCt, new Vector(posX, 55)));
            posX += 200;
        }

        for (var j = 0; j < this.cities.length; j++) {
            this.cities[j].draw(this.cityCt);
        }
    },

    missileHitsCities: function(missile) {
        for (var i = 0; i < this.cities.length; i++) {
            if (this.cities[i].missileHitsCity(missile)) {
                return true;
            }
        }

        return false;
    },

    beamHitsCities: function(beam) {
        for (var i = 0; i < this.cities.length; i++) {
            if (this.cities[i].beamHitsCity(beam)) {
                return true;
            }
        }

        return false;
    },

    rayHitsCities: function(ray) {
        for (var i = 0; i < this.cities.length; i++) {
            if (this.cities[i].rayHitsCity(ray)) {
                return true;
            }
        }

        return false;
    },
};
