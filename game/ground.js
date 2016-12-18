/**
 * The ground handler in the game.
 *
 * Draws the ground of the earth by using an image.
 *
 */

/*global Vector */

/**
 * The ground constructor.
 *
 * Sets the ground specifications.
 *
 * @param {Object} position - the position of the ground element.
 */
function Ground(position) {
    this.position           = position  || new Vector();
    this.width              = 32;
    this.height             = 32;
    this.img                = new window.Image();
    this.img.src            = "../img/tiles/ground.png";
}

/**
 * The prototype of the ground describing the characteristics of the ground.
 *
 * @type {Object}
 */
Ground.prototype = {

    /**
     * Draws a ground element by using an image.
     *
     * @param  {Object}  ct - The canvas context.
     *
     * @return {void}
     */
    draw: function(ct) {
        ct.save();
        ct.translate(this.position.x, this.position.y);
        ct.drawImage(this.img, 0, 0, this.width, this.height);
        ct.restore();
    },
};
