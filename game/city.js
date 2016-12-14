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
    this.ct         = ct;
    this.position   = position  || new Vector();
    this.width      = 80;
    this.height     = 51;
}

/**
 * The prototype of the city describing the characteristics of the city.
 *
 * @type {Object}
 */
City.prototype = {

    /**
     * Draws the cannon in a normal state and after the cannon has been hit by
     * aliens.
     *
     * @param  {Object}  ct - The canvas context.
     *
     * @return {void}
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

    missileHitsCity: function(missile) {
        var missilePosY = missile.position.y - 480;
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

    beamHitsCity: function(beam) {
        var beamPosY = beam.position.y - 480;
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

    rayHitsCity: function(ray) {
        var rayPosY = ray.position.y - 469;
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
