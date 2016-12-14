/*global Vector */

function GroundExplosion(position) {
    this.position           = position  || new Vector();
    this.width              = 18;
    this.height             = 10;
    this.img                = new window.Image();
    this.img.src            = "../img/game/ground_explosion.png";
    this.timer              = 15;
}

GroundExplosion.prototype = {

    /**
     * Draws an alien by using an image.
     *
     * @param  {Object}  ct - The canvas context.
     *
     * @return {void}
     */
    draw: function(ct) {
        ct.save();
        ct.translate(this.position.x-10, this.position.y - this.height + 2);
        ct.drawImage(this.img, 0, 0, this.width, this.height);
        ct.restore();
    },

    /**
     * Decreases the timer with one. The timer controls how long the explosion
     * should be present.
     *
     * @return {void}
     */
    update: function() {
        this.timer--;
    },
};

function AirExplosion(position) {
    this.position           = position  || new Vector();
    this.width              = 24;
    this.height             = 24;
    this.img                = new window.Image();
    this.img.src            = "../img/game/air_explosion.png";
    this.timer              = 15;
}

AirExplosion.prototype = {

    /**
     * Draws an alien by using an image.
     *
     * @param  {Object}  ct - The canvas context.
     *
     * @return {void}
     */
    draw: function(ct) {
        ct.save();
        ct.translate(this.position.x-12, this.position.y);
        ct.drawImage(this.img, 0, 0, this.width, this.height);
        ct.restore();
    },

    /**
     * Decreases the timer with one. The timer controls how long the explosion
     * should be present.
     *
     * @return {void}
     */
    update: function() {
        this.timer--;
    },
};
