/*global Ground */
/*global Vector */

function Grounds() {
    this.grounds = [];
    var posX = 2;

    for (var i = 0; i < 28; i++) {
        this.grounds.push(new Ground(new Vector(posX, 650)));
        posX += 32;
    }
}

/**
 * The Ground prototype.
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
