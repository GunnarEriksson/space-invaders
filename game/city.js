/**
 * The city handler in the game.
 *
 * Handles one alien in the game and is resposible for drawing, moving and checks
 * if the alien has hit by a missile or if an aliens hits the cannon (game over).
 *
 * It also handles the image of an exploded alien when the alien has been hit
 * by a missile from the cannon.
 *
 */

/*global Vector */
/*global isIntersect */

/**
 * The city the cannon should defend.
 *
 * @param {Object}  position - The vector position for the cannon.
 * @param {Object}  velocity - The velocity of the cannon movement as vector.
 * @param {Object}  aliens - The aliens object containing all aliens.
 */
function City(ct, position) {
    this.ct                 = ct;
    this.position           = position  || new Vector();
    this.width              = 80;
    this.height             = 51;
    this.canvasOffset       = 452;
    this.canvasOffsetRay    = 439;
}

/**
 * The prototype of the city describing the characteristics of the city.
 *
 * @type {Object}
 */
City.prototype = {

    /**
     * Draws a cannon.
     *
     * @return {Void}
     */
    draw: function() {
        this.ct.save();
        this.ct.fillStyle = "rgb(79, 255, 48)";
        this.ct.strokeStyle = "rgb(79, 255, 48)";
        this.ct.translate(this.position.x, this.position.y);
        this.ct.beginPath();

        this.ct.moveTo(0, 0);
        this.ct.lineTo(15, 0);
        this.ct.quadraticCurveTo(15, -this.height+24, this.width/2, -this.height+24);
        this.ct.quadraticCurveTo(this.width-15, -this.height+24, this.width-15, 0);
        this.ct.lineTo(this.width, 0);
        this.ct.lineTo(this.width, -this.height+15);
        this.ct.quadraticCurveTo(this.width, -this.height, this.width-15, -this.height);
        this.ct.lineTo(15, -this.height);
        this.ct.quadraticCurveTo(0, -this.height, 0, -this.height+15);
        this.ct.lineTo(0, 0);

        this.ct.closePath();
        this.ct.stroke();
        this.ct.fill();
        this.ct.restore();
    },

    /**
     * Generates damage after the city is hit by a missile.
     *
     * @param  {Integer} x - the start position for the damage in x led.
     * @param  {Integer} y - the start position for the damage in y led.
     *
     * @return {Void}
     */
    generateMissileDamage: function(x, y) {

        x = Math.floor(x / 2) * 2;
        y = Math.floor(y / 2) * 2;

        this.ct.clearRect(x - 2, y - 6, 4, 10);
        this.ct.clearRect(x - 4, y - 8, 2, 3);
        this.ct.clearRect(x + 2, y - 8, 2, 2);
        this.ct.clearRect(x + 4, y - 1, 2, 2);
        this.ct.clearRect(x + 2, y + 3, 2, 3);
        this.ct.clearRect(x - 4, y - 4, 2, 2);
        this.ct.clearRect(x - 6, y - 3, 2, 2);
    },

    /**
     * Generates damage after the city is hit by a beam.
     *
     * @param  {Integer} x - the start position for the damage in x led.
     * @param  {Integer} y - the start position for the damage in y led.
     *
     * @return {Void}
     */
    generateBeamDamage: function(x, y) {

        x = Math.floor(x / 2) * 2;
        y = Math.floor(y / 2) * 2;

        this.ct.clearRect(x - 2, y - 1, 4, 7);
        this.ct.clearRect(x + 2, y - 3, 2, 3);
        this.ct.clearRect(x + 4, y + 3, 2, 2);
        this.ct.clearRect(x + 2, y + 6, 2, 2);
        this.ct.clearRect(x - 4, y + 5, 2, 3);
        this.ct.clearRect(x - 6, y, 2, 2);
        this.ct.clearRect(x - 4, y + 3, 2, 2);
    },

    /**
     * Generates damage after the city is hit by a ray.
     *
     * @param  {Integer} x - the start position for the damage in x led.
     * @param  {Integer} y - the start position for the damage in y led.
     *
     * @return {Void}
     */
    generateRayDamage: function(x, y) {

        x = Math.floor(x / 2) * 2;
        y = Math.floor(y / 2) * 2;

        this.ct.clearRect(x - 3, y - 1, 6, 5);

        this.ct.clearRect(x + 3, y - 3, 2, 3);
        this.ct.clearRect(x + 5, y + 1, 2, 2);
        this.ct.clearRect(x + 3, y + 4, 2, 2);
        this.ct.clearRect(x - 5, y + 3, 2, 3);
        this.ct.clearRect(x - 7, y, 2, 2);
        this.ct.clearRect(x - 5, y - 3, 2, 2);
    },

    /**
     * Checks if an missile hits a non damaged part of a city. If the city is
     * hit, a damage is generated.
     *
     * @param  {Object} missile - the missile object with the characteristics.
     *
     * @return {Void}
     */
    missileHitsCity: function(missile) {
        var missilePosY = missile.position.y - this.canvasOffset;
        if (isIntersect(this.position.x, this.position.y - this.height, this.width, this.height, missile.position.x, missilePosY, missile.width, missile.height)) {
            var data = this.ct.getImageData(missile.position.x, missilePosY, missile.width, 1);
            if (data.data[3] !== 0) {
                this.generateMissileDamage(missile.position.x, missilePosY);
                return true;
            }
        } else {
            return false;
        }
    },

    /**
     * Checks if an beam hits a non damaged part of a city. If the city is
     * hit, a damage is generated.
     *
     * @param  {Object} beam - the beam object with the characteristics.
     *
     * @return {Void}
     */
    beamHitsCity: function(beam) {
        var beamPosY = beam.position.y - this.canvasOffset;
        if (isIntersect(this.position.x, this.position.y - this.height, this.width, this.height, beam.position.x, beamPosY, beam.width, beam.height)) {
            var data = this.ct.getImageData(beam.position.x, beamPosY, beam.width, 1);
            if (data.data[1] !== 0) {
                this.generateBeamDamage(beam.position.x, beamPosY);
                return true;
            }
        } else {
            return false;
        }
    },

    /**
     * Checks if an ray hits a non damaged part of a city. If the city is
     * hit, a damage is generated.
     *
     * @param  {Object} ray - the ray object with the characteristics.
     *
     * @return {Void}
     */
    rayHitsCity: function(ray) {
        var rayPosY = ray.position.y - this.canvasOffsetRay;
        if (isIntersect(this.position.x, this.position.y - this.height, this.width, this.height, ray.position.x, rayPosY, ray.width, ray.height)) {
            var data = this.ct.getImageData(ray.position.x, rayPosY, ray.width, 1);
            if (data.data[1] !== 0) {
                this.generateRayDamage(ray.position.x, rayPosY);
                return true;
            }
        } else {
            return false;
        }
    },
};
