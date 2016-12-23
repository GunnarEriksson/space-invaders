/**
 * The grounds handler in the game.
 *
 * Creates a row of ground elements to create the ground of the earth.
 */

/*global Ground */
/*global Vector */

/**
 * The ground constructor.
 *
 * Sets the grounds specifications and creates a row of ground elements.
 */
function Grounds(height) {
    this.grounds = [];
    var posX = 2;

    for (var i = 0; i < 28; i++) {
        this.grounds.push(new Ground(new Vector(posX, height - 75)));
        posX += 32;
    }
}

/**
 * The prototype of the grounds describing the characteristics of the grounds.
 * @type {Object}
 */
Grounds.prototype = {
    /**
     * Draws all Ground in the array to create the ground of the earth.
     *
     * @param  {Object}  ct - The canvas context.
     *
     * @return {void}
     */
    draw: function(ct) {
        for (var i = 0; i < this.grounds.length; i++) {
            this.grounds[i].draw(ct);
        }
    },
};
