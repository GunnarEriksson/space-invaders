/*global Cannon */
/*global Vector */

function Cannons(aliens, cities, mysteryShips) {
    this.aliens = aliens;
    this.cities = cities;
    this.mysteryShips = mysteryShips;
    this.cannons = [];
    this.cannonHit = false;
    this.timer = 180;
    aliens.createBeamsAndRays(this);
}

Cannons.prototype = {
    start: function(width, height) {
        this.cannons.push(new Cannon(new Vector(150, height-128), this.aliens, this.cities, this.mysteryShips));
        this.cannons.push(new Cannon(new Vector(10, height-40), this.aliens, this.cities, this.mysteryShips));
        this.cannons.push(new Cannon(new Vector(70, height-40), this.aliens, this.cities, this.mysteryShips));
    },

    draw: function(ct) {
        for (var i = 0; i < this.cannons.length; i++) {
            this.cannons[i].draw(ct);
        }
    },

    update: function(td, width) {

        if (this.cannons.length > 0) {
            this.cannons[0].update(td, width);

            if (this.cannons[0].shouldBeRemoved) {
                this.timer--;
                if (this.timer === 0) {
                    this.cannons.shift();
                    if (this.cannons.length > 1) {
                        this.cannons[0].position.x = 150;
                        this.cannons[0].position.y = 750-128;
                        this.cannons[1].position.x = 10;
                        this.cannons[1].position.y = 750-40;
                    } else if (this.cannons.length > 0) {
                        this.cannons[0].position.x = 150;
                        this.cannons[0].position.y = 750-128;
                    }
                    this.timer = 180;
                }
            }
        }
    },

    cannonsHit: function(beamPos) {
        if (this.cannons.length > 0) {
            return this.cannons[0].cannonHit(beamPos);
        } else {
            return false;
        }
    },
};
