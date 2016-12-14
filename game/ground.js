/*global Vector */

function Ground(position) {
    this.position           = position  || new Vector();
    this.width              = 32;
    this.height             = 32;
    this.img                = new window.Image();
    this.img.src            = "../img/tiles/ground.png";
}

Ground.prototype = {

    /**
     * Draws an alien by using an image.
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
