/**
 * The explosion handler for missile explosions in the air and beam and ray
 * explosions on the ground in the game.
 *
 * Draws an air and ground explosion. A timer determines how long the explosion
 * should be shown.
 *
 */

/*global Vector */

/**
 * The ground explosion constructor
 *
 * Sets the ground explosion specifications.
 *
 * @param {Object} position - the position of the explosion in x and y led.
 */
function GroundExplosion(position) {
    this.position           = position  || new Vector();
    this.width              = 18;
    this.height             = 10;
    this.img                = new window.Image();
    this.img.src            = "../img/game/ground_explosion.png";
    this.timer              = 15;
}

/**
 * The prototype of the ground explosion describing the characteristics of the
 * ground explosion.
 *
 * @type {Object}
 */
GroundExplosion.prototype = {

    /**
     * Draws a ground explosion by using an image.
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

/**
 * The air explosion constructor
 *
 * Sets the air explosion specifications.
 *
 * @param {Object} position - the position of the explosion in x and y led.
 */
function AirExplosion(position) {
    this.position           = position  || new Vector();
    this.width              = 24;
    this.height             = 24;
    this.img                = new window.Image();
    this.img.src            = "../img/game/air_explosion.png";
    this.timer              = 15;
}

 /**
  * The prototype of the air explosion describing the characteristics of the
  * air explosion.
  *
  * @type {Object}
  */
AirExplosion.prototype = {

    /**
     * Draws an air explosion by using an image.
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
