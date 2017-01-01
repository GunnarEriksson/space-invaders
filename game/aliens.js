/**
 * The aliens handler in the game.
 *
 * Creates, removes and handles all aliens in the game.
 */

/*global Alien */
/*global Audio */
/*global Beams */
/*global ExplodedAlien */
/*global Rays */
/*global Vector */
/*global isIntersect */

/**
 * The aliens constructor.
 *
 * Sets the aliens specifications.
 *
 * @param {Object} cities           - the object containing the cities.
 * @param {Object} score            - the object containing the score.
 * @param {Integer} gameBoardWidth  - the width of the game board.
 */
function Aliens(cities, score, gameBoardHeight, gameBoardWidth) {
    this.cities = cities;
    this.score = score;
    this.gameBoardWidth = gameBoardWidth;
    this.gameBoardHeight = gameBoardHeight;
    this.groundOffset = 105;
    this.aliens = null;
    this.explodedAliens = null;
    this.aliensDirection = null;
    this.beams = null;
    this.rays = null;
    this.counter = null;
    this.speed = null;
    this.moveSoundVersion = null;
    this.numberOfAliensInRow = 11;
    this.distXNextAlien = 50;
    this.distYNextAlien = 37;
    this.alienExplosion = new Audio("sound/alien_explosion.wav");
    this.alienMoveSoundHigh = new Audio("sound/alien_move_high.wav");
    this.alienMoveSoundLow = new Audio("sound/alien_move_low.wav");
}

/**
 * The prototype of the alien describing the characteristics of the alien.
 *
 * @type {Object}
 */
Aliens.prototype = {

    /**
     * Creates all aliens for the game and starts the beam and ray functions, which
     * are used by the aliens.
     *
     * @return {Void}
     */
    start: function() {
        var posX = 200;
        var posY = 130;
        var alienNo = 0;
        var alienTop = {
            width: 21,
            height: 24,
            spritePosX: 76,
            spritePosY: 31,
            spritePosX2: 107,
            points: 30
        };
        var alienMiddle = {
            width: 27,
            height: 24,
            spritePosX: 6,
            spritePosY: 31,
            spritePosX2: 42,
            points: 20
        };
        var alienBottom = {
            width: 32,
            height: 24,
            spritePosX: 56,
            spritePosY: 5,
            spritePosX2: 94,
            points: 10
        };
        this.aliens = [];
        this.explodedAliens = [];
        this.aliensDirection = "left";
        this.counter = 0;
        this.speed = 40;
        this.moveSoundVersion = 0;
        this.missileVersion = 0;

        for (var i = 0; i < this.numberOfAliensInRow; i++) {
            this.aliens[alienNo] = new Alien(new Vector(posX, posY), this.aliensDirection, alienTop, this.gameBoardWidth);
            alienNo++;
            posX += this.distXNextAlien;
        }
        posY += this.distYNextAlien;

        for (var j = 0; j < 2; j++) {
            posX = 198;
            for (var k = 0; k < this.numberOfAliensInRow; k++) {
                this.aliens[alienNo] = new Alien(new Vector(posX, posY), this.aliensDirection, alienMiddle, this.gameBoardWidth);
                alienNo++;
                posX += this.distXNextAlien;
            }
            posY += this.distYNextAlien;
        }

        for (var m = 0; m < 2; m++) {
            posX = 196;
            for (var n = 0; n < this.numberOfAliensInRow; n++) {
                this.aliens[alienNo] = new Alien(new Vector(posX, posY), this.aliensDirection, alienBottom, this.gameBoardWidth);
                alienNo++;
                posX += this.distXNextAlien;
            }
            posY += this.distYNextAlien;
        }

        this.beams.start();
        this.rays.start();
    },

    /**
     * Creates the beams and rays fired by the aliens.
     *
     * @param  {Object}  cannons - The cannons object which handles the cannon.
     *
     * @return {void}
     */
    createBeamsAndRays: function(cannons) {
        this.beams = new Beams(cannons, this, this.cities);
        this.rays = new Rays(cannons, this, this.cities);
    },

    /**
     * Draws all aliens in the array and the beams and rays.
     *
     * @param  {Object}  ct - The canvas context.
     *
     * @return {void}
     */
    draw: function(ct) {
        for (var i = 0; i < this.aliens.length; i++) {
            this.aliens[i].draw(ct);
        }

        for (var j = 0; j < this.explodedAliens.length; j++) {
            this.explodedAliens[j].draw(ct);
        }

        if (this.beams) {
            this.beams.draw(ct);
        }

        if (this.rays) {
            this.rays.draw(ct);
        }
    },

    /**
     * Sets the direction of all aliens. When the aliens has reached the left
     * or right border, all aliens is moved down one step.
     */
    setDirection: function() {
        var isDirectionChanged = false;
        var newDirection = this.aliensDirection;
        var posY;

        for (var i = 0; i < this.aliens.length; i++) {
            if (this.aliensDirection !== this.aliens[i].newDirection) {
                newDirection = this.aliens[i].newDirection;
                isDirectionChanged = true;
            }
        }

        if (isDirectionChanged) {
            for (var j = 0; j < this.aliens.length; j++) {
                this.aliensDirection = newDirection;
                this.aliens[j].newDirection = newDirection;
                this.aliens[j].direction = newDirection;
                posY = this.aliens[j].position.y;
                if ((posY + 50) < (this.gameBoardHeight - this.groundOffset)) {
                    this.aliens[j].position.y = posY + 50;
                }
            }
        }
    },

    /**
     * Checks if aliens has been hit by a missile. If the an alien has been hit
     * it is marked to be removed.
     *
     * @param  {Object}  missilePos - The vector of the missile location.
     *
     * @return {Boolean}  True if an alien has been hit by a missile, false otherwise.
     */
    aliensHit: function(missilePos) {
        for (var i = 0; i < this.aliens.length; i++) {
            if (this.aliens[i].alienHit(missilePos)) {
                this.aliens[i].shouldBeRemoved = true;
                return true;
            }
        }

        return false;
    },

    /**
     * Checks if any alien has hit the cannon.
     *
     * @param  {Object}  cannonPos - The vector of the cannon location.
     *
     * @return {Boolean}  True if an alien has hit the cannon, false otherwise.
     */
    aliensHitCannon: function(cannonPos) {
        for (var i = 0; i < this.aliens.length; i++) {
            if (this.aliens[i].alienHitCannon(cannonPos)) {
                return true;
            }
        }

        return false;
    },

    /**
     * Updates all aliens. Removes aliens that have been hit by a missile from
     * the array of aliens. Plays an sound of explosion when an alien is hit.
     * Sets the dirction of all aliens and updates the beams and rays fired by
     * the aliens.
     *
     * @return {void}
     */
    update: function() {
        this.counter++;
        if (this.aliens.length < 40 && this.aliens.length > 30) {
            this.speed = 30;
        } else if (this.aliens.length < 30 && this.aliens.length > 20) {
            this.speed = 20;
        } else if (this.aliens.length < 20 && this.aliens.length > 10) {
            this.speed = 10;
        } else if (this.aliens.length < 10 && this.aliens.length > 5) {
            this.speed = 5;
        } else if (this.aliens.length < 2) {
            this.speed = 2 ;
        }

        for (var i = this.aliens.length -1; i >= 0; i--) {
            if (this.counter % this.speed === 0) {
                this.aliens[i].update();
                this.moveSoundVersion = (this.moveSoundVersion + 1) % 2;
                if (this.moveSoundVersion > 0) {
                    this.alienMoveSoundHigh.play();
                } else {
                    this.alienMoveSoundLow.play();
                }

                this.counter = 0;
            }

            if (this.aliens[i].shouldBeRemoved) {
                this.alienMoveSoundHigh.pause();
                this.alienMoveSoundHigh.currentTime = 0;
                this.alienMoveSoundHigh.play();
            }



            if (this.aliens[i].shouldBeRemoved) {
                this.explodedAliens.push(new ExplodedAlien(new Vector(this.aliens[i].position.x, this.aliens[i].position.y)));
                this.score.addScore(this.aliens[i].points);
                this.aliens.splice(i, 1);
                this.alienExplosion.pause();
                this.alienExplosion.currentTime = 0;
                this.alienExplosion.play();
            }
        }

        this.setDirection();

        if (Math.random() < 0.03 && this.aliens.length > 0) {
            var alien = this.aliens[Math.round(Math.random() * (this.aliens.length - 1))];

	        for (var j = 0; j < this.aliens.length; j++) {
                var alien_b = this.aliens[j];

                if (isIntersect(alien.position.x, alien.position.y, alien.alienWidth, 100, alien_b.position.x, alien_b.position.y, alien_b.alienWidth, alien_b.alienHeight)) {
                    alien = alien_b;
                }
            }

            this.missileVersion = (this.missileVersion + 1) % 8;
            if (this.missileVersion === 0) {
                this.rays.fire(alien);
            } else {
                this.beams.fire(alien);
            }
        }


        if (this.beams) {
            this.beams.update();
        }

        if (this.rays) {
            this.rays.update();
        }

        for (var k = this.explodedAliens.length -1; k >= 0; k--) {
            this.explodedAliens[k].update();

            if (this.explodedAliens[k].timer === 0) {
                this.explodedAliens.splice(k, 1);
            }
        }
    },
};
