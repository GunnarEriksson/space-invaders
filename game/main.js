/**
 * Playing SpaceInvaders while learning JavaScript object model.
 */

/*global Guer */
/*global Audio */
/*global Key */
/*global requestAnimFrame */
/*global SpaceInvaders */

/**
 * Helper function to see if two vectors are intersecting
 *
 * @param  {number}  ax - The x-coordinate for the first object.
 * @param  {number}  ay - The y-coordinate for the first object.
 * @param  {number}  aw - The width of the first object.
 * @param  {number}  ah - The height of the first object.
 * @param  {number}  bx - The x-coordinate for the second object.
 * @param  {number}  by - The x-coordinate for the second object.
 * @param  {number}  bw - The width of the second object.
 * @param  {number}  bh - The height of the second object.
 *
 * @return {Boolean}  True if the objects intersects, false otherwise.
 */
function isIntersect(ax, ay, aw, ah, bx, by, bw, bh) {
    return ax < bx + bw && bx < ax + aw && ay < by + bh && by < ay + ah;
}

function isIntersectInXLed(ax, aw, bx, bw) {
    return ax < bx + bw && bx < ax + aw;
}

/**
 * Shim layer, polyfill, for requestAnimationFrame with setTimeout fallback.
 * http://paulirish.com/2011/requestanimationframe-for-smart-animating/
 */
window.requestAnimFrame = (function() {
    return window.requestAnimationFrame       ||
           window.webkitRequestAnimationFrame ||
           window.mozRequestAnimationFrame    ||
           window.oRequestAnimationFrame      ||
           window.msRequestAnimationFrame     ||
           function( callback ) {
               window.setTimeout(callback, 1000 / 60);
            };
})();



/**
 * Shim layer, polyfill, for cancelAnimationFrame with setTimeout fallback.
 */
window.cancelRequestAnimFrame = (function() {
    return window.cancelRequestAnimationFrame       ||
           window.webkitCancelRequestAnimationFrame ||
           window.mozCancelRequestAnimationFrame    ||
           window.oCancelRequestAnimationFrame      ||
           window.msCancelRequestAnimationFrame     ||
           window.clearTimeout;
})();


/**
 * Trace the keys pressed
 * http://nokarma.org/2011/02/27/javascript-game-development-keyboard-input/index.html
 */
window.Key = {
    pressed: {},
    released: {},

    LEFT:   37,
    RIGHT:  39,
    SPACE:  32,

    /**
     * Checks if the key code of the pressed key is stored in the pressed array.
     * The array is checked continuously.
     *
     * @param  {number}  keyCode - The key code of the pressed key.
     * @return {Boolean}  True if the key code of the pressed key is stored in array.
     */
    isDown: function(keyCode) {
        return this.pressed[keyCode];
    },

    /**
     * Sets the key code of the pressed key to true in the pressed key array.
     * Indicates that a key has been pressed.
     *
     * @param  {Object}  event - The event object.
     * @return {void}
     */
    onKeydown: function(event) {
        this.pressed[event.keyCode] = true;
    },

    /**
     * Deletes the key code of the released key. Indicates that the pressed key
     * has been released.
     *
     * @param  {Object}  event - The event object.
     * @return {void}
     */
    onKeyup: function(event) {
        delete this.pressed[event.keyCode];
    }
};

// Add event listener to key up and key down (jQuery). Connect the event to
// the functions in Key object.
window.addEventListener('keyup',   function(event) { Key.onKeyup(event); },   false);
window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);



/**
 * Vector function with x- and y-coordinates.
 *
 * @param {number}  x - The x-coordinate of the vector.
 * @param {number}  y - The y-coordinate of the vector.
 */
function Vector(x, y) {
    this.x = x || 0;
    this.y = y || 0;
}



/**
 * The cannon to shoot aliens with.
 *
 * @param {Object}  position - The vector position for the cannon.
 * @param {Object}  velocity - The velocity of the cannon movement as vector.
 * @param {Object}  aliens - The aliens object containing all aliens.
 */
function Cannon(position, velocity, aliens, cities, mysteryShips) {
    this.position           = position  || new Vector();
    this.velocity           = velocity  || new Vector(1,1);
    this.aliens             = aliens;
    this.missiles           = new Missiles(aliens, cities, mysteryShips);
    this.cannonWidth        = 45;
    this.cannonHeight       = 25;
    this.shouldBeRemoved    = false;
    this.cannonExplosionPlayed = false;

    aliens.createBeams(this);
    this.cannonMissile = new Audio("../sound/cannon_missile.wav");
    this.cannonMissile.volume = 0.3;

    this.cannonExplosion = new Audio("../sound/cannon_explosion.wav");
    this.cannonExplosion.volume = 0.3;


}

/**
 * The prototype of the cannon describing the characteristics of the cannon.
 *
 * @type {Object}
 */
Cannon.prototype = {

    /**
     * Draws the cannon in a normal state and after the cannon has been hit by
     * aliens.
     *
     * @param  {Object}  ct - The canvas context.
     *
     * @return {void}
     */
    draw: function(ct) {
        if (!this.shouldBeRemoved) {
            ct.save();
            ct.fillStyle = "rgb(79, 255, 48)";
            ct.strokeStyle = "rgb(79, 255, 48)";
            ct.translate(this.position.x, this.position.y); // Move whole space cannon
            ct.beginPath();

            ct.moveTo(0, 0);
            ct.lineTo(this.cannonWidth, 0);
            ct.lineTo(this.cannonWidth, -10);
            ct.quadraticCurveTo(this.cannonWidth, -15, this.cannonWidth / 2, -15);
            ct.quadraticCurveTo(0, -15, 0, -10);
            ct.lineTo(0, 0);
            ct.fillRect (18, -20, 11, 5);
            ct.fillRect (21, -25, 5, 5);
            ct.closePath();

            ct.stroke();
            ct.fill();
            ct.restore();
        } else {
            if (!this.cannonExplosionPlayed) {
                this.cannonExplosion.play();
                this.cannonExplosionPlayed = true;
            }

            ct.save();
            ct.fillStyle = "rgb(79, 255, 48)";
            ct.strokeStyle = "rgb(79, 255, 48)";
            ct.translate(this.position.x, this.position.y); // Move whole space cannon
            ct.beginPath();

            ct.moveTo(0, 0);
            ct.lineTo(this.cannonWidth, 0);
            ct.lineTo(this.cannonWidth, -15);
            ct.lineTo(40, -10);
            ct.lineTo(30, -15);
            ct.lineTo(20, -10);
            ct.lineTo(0, -15);
            ct.lineTo(0, 0);
            ct.rotate(-20*Math.PI/180);
            ct.fillRect (18, -13, 11, 5);
            ct.rotate(25*Math.PI/180);
            ct.fillRect (13, -27, 5, 5);
            ct.closePath();

            ct.stroke();
            ct.fill();
            ct.restore();
        }

        this.missiles.draw(ct);
    },

    /**
     * Moves the cannon to the left with one pixel muliplied with the velocity.
     * The velocity is used to determine the speed of the cannons movement.
     *
     * @return {void}
     */
    moveLeft: function() {
        this.position.x -= 1 * this.velocity.x;
    },

    /**
     * Moves the cannon to the right with one pixel muliplied with the velocity.
     * The velocity is used to determine the speed of the cannons movement.
     *
     * @return {void}
     */
    moveRight: function() {
        this.position.x += 1 * this.velocity.x;
    },

    /**
     * Fires the cannon. Checks if no missile is in the space before firing the
     * cannon. If no missile is on the way, the position of the barrel of the
     * cannon is set. Plays a sound when the cannon is fired.
     *
     * @return {void}
     */
    fire: function() {
        if (this.missiles.missiles.length === 0) {
            var gunPosX = this.position.x + 22;
            var gunPosY = this.position.y - 32;
            this.missiles.fire(new Vector(gunPosX, gunPosY), new Vector(8, 8));
            this.cannonMissile.pause();
            this.cannonMissile.currentTime = 0;
            this.cannonMissile.play();
        }
    },

    /**
     * Checks if the left, right or space key has been pressed to call respective
     * function. Call the missile function to update the missile movement and to
     * check if aliens has hit the cannon. Checks so the cannon stays in the areay.
     *
     * @param  {number}  width - The width of the cannon.
     *
     * @return {void}
     */
    update: function(td, width) {
        if (Key.isDown(Key.LEFT))   this.moveLeft();
        if (Key.isDown(Key.RIGHT))  this.moveRight();
        if (Key.isDown(Key.SPACE))  this.fire();
        this.missiles.update();
        this.aliensHitCannon();
        this.stayInArea(width);
    },

    /**
     * Checks that the cannon stays on the game board.
     *
     * @param  {number}  width - The width of the cannon.
     *
     * @return {void}
     */
    stayInArea: function(width) {
        if (this.position.x > (width - this.cannonWidth)) {
            this.position.x = (width - this.cannonWidth);
        }

        if (this.position.x < 0) {
            this.position.x = 0;
        }
    },

    /**
     * Checks if the cannon isIntersects with the aliens beams. If they are, the
     * cannon is hit by the an alien beam.
     *
     * @param  {Object}  beamPos - The vector position of an alien beam.
     *
     * @return {Boolean}  True if the cannon is hit by an alien beam, false otherwise.
     */
    cannonHit: function(beamPos) {
        if (isIntersect(this.position.x, this.position.y, this.cannonWidth, this.cannonHeight, beamPos.x, beamPos.y, 3, 5)) {
            this.shouldBeRemoved = true;
            return true;
        } else {
            return false;
        }
    },

    /**
     * Calls the aliens object to check if an alien has collided with the cannon.
     * If the have, the game is over and the player has lost.
     *
     * @return {void}
     */
    aliensHitCannon: function() {
        if (this.aliens.aliensHitCannon(this.position)) {
            this.shouldBeRemoved = true;
        }
    }
};

/**
 * The missile fired by cannon.
 *
 * @param {Object}  position - The vector position for the cannon.
 * @param {Object}  velocity - The velocity of the missile movement as vector.
 * @param {Object}  aliens - The aliens object containing all aliens.
 */
function Missile(position, velocity, aliens, cities, mysteryShips) {
    this.position           = position  || new Vector();
    this.velocity           = velocity  || new Vector(1,1);
    this.aliens             = aliens;
    this.cities             = cities;
    this.mysteryShips       = mysteryShips;
    this.width              = 3;
    this.height             = 5;
    this.shouldBeRemoved    = false;
    this.hitsBeam           = false;

}

/**
 * The prototype of the missile describing the characteristics of the missiles.
 *
 * @type {Object}
 */
Missile.prototype = {

    /**
     * Draws the missile as a green laser beam.
     *
     * @param  {Object}  ct - The canvas context.
     *
     * @return {void}
     */
    draw: function(ct) {
        ct.save();
        ct.fillStyle = "rgb(79, 255, 48)";
        ct.strokeStyle = "rgb(79, 255, 48)";
        ct.translate(this.position.x, this.position.y);
        ct.beginPath();
        ct.fillRect (0, 0, this.width, this.height);
        ct.closePath();

        ct.stroke();
        ct.fill();
        ct.restore();
    },

    /**
     * Moves the missile up with one pixel muliplied with the velocity.
     * The velocity is used to determine the speed of the missiles movement.
     *
     * @return {void}
     */
    moveUp: function() {
        this.position.y -= 1 * this.velocity.y;
    },

    /**
     * Updates the missile movement and check if the missile has reached the
     * top of the game board or has hit an alien.
     *
     * @return {void}
     */
    update: function() {
        this.moveUp();
        this.stayInArea();
        if (this.aliens.aliensHit(this.position)) {
            this.shouldBeRemoved = true;
        }

        if (this.cities.missileHitsCities(this)) {
            this.shouldBeRemoved = true;
        }

        if (this.mysteryShips.mysteryShipsHit(this)) {
            this.shouldBeRemoved = true;
        }
    },

    /**
     * Checks if the missile has reached the top of the game board and then
     * should be removed.
     *
     * @return {void}
     */
    stayInArea: function() {
        if (this.position.y < 100) {
            this.shouldBeRemoved = true;
        }
    }
};

/**
 * The missiles object.
 * Used to control all missiles.
 *
 * @param {Object}  aliens - Contains all aliens.
 */
function Missiles(aliens, cities, mysteryShips) {
    this.aliens = aliens;
    this.cities = cities;
    this.mysteryShips = mysteryShips;
    this.missiles = [];
    this.airExplosions = [];
    this.airExplosion = new Audio("../sound/air_explosion.wav");
}

/**
 * The missiles prototype which controls all missiles.
 * @type {Object}
 */
Missiles.prototype = {

    /**
     * Draws all missiles.
     *
     * Draws all missiles that is stored in an array.
     *
     * @param  {Object}  ct - The canvas context.
     *
     * @return {void}
     */
    draw: function(ct) {
        for (var i = 0; i < this.missiles.length; i++) {
            this.missiles[i].draw(ct);
        }

        for (var j = 0; j < this.airExplosions.length; j++) {
            this.airExplosions[j].draw(ct);
        }
    },

    /**
     * Fires a missile by creating a missile and store the missile in the array
     * of missiles.
     *
     * @param  {Object}  position - The start vector of the missile.
     * @param  {Object}  velocity - The velocity of the missile. Only y-coordinate
     *                              is used.
     * @return {void}
     */
    fire: function(position, velocity) {
        this.missiles.push(new Missile(position, velocity, this.aliens, this.cities, this.mysteryShips));
    },

    /**
     * Updates all missiles and removes a missile from the array if the missile
     * should be removed.
     *
     * @return {void}
     */
    update: function() {
        var i = 0;
        while (i < this.missiles.length) {
            this.missiles[i].update();
            if (this.missiles[i].shouldBeRemoved) {
                if (this.missiles[i].position.y < 130 || this.missiles[i].hitsBeam) {
                    this.airExplosions.push(new AirExplosion(new Vector(this.missiles[i].position.x, this.missiles[i].position.y)));
                    this.airExplosion.pause();
                    this.airExplosion.currentTime = 0;
                    this.airExplosion.play();
                }

                this.missiles.shift();
            }
            i++;
        }

        for (var j = this.airExplosions.length -1; j >= 0; j--) {
            this.airExplosions[j].update();

            if (this.airExplosions[j].timer === 0) {
                this.airExplosions.splice(j, 1);
            }
        }

        this.missileHitsBeam();
    },

    missileHitsBeam: function() {
        var beams = this.aliens.beams.beams;
        for (var i = 0; i < this.missiles.length; i++) {
            for (var j = 0; j < beams.length; j++) {
                if (isIntersect(this.missiles[i].position.x, this.missiles[i].position.y, this.missiles[i].width, this.missiles[i].height, beams[j].position.x, beams[j].position.y, beams[j].width, beams[j].height)) {
                    this.missiles[i].hitsBeam = true;
                    this.missiles[i].shouldBeRemoved = true;
                    beams[j].shouldBeRemoved = true;
                }
            }
        }
    }
};

/**
 * The alien trying to invade the earth.
 *
 * @param {Object}  position - The vector position for the alien.
 * @param {Object}  velocity - The velocity of the alien movement as vector.
 * @param {string}  direction - The dirction of the alien.
 */
function Alien(position, velocity, direction, width, height, spritePosX, spritePosY, spritePosX2, points) {
    this.position           = position  || new Vector();
    this.velocity           = velocity  || new Vector(1,1);
    this.direction          = direction || "right";
    this.newDirection       = direction || "right";
    this.alienWidth         = width;
    this.alienHeight        = height;
    this.spritePosX         = spritePosX;
    this.spritePosY         = spritePosY;
    this.spritePosX2         = spritePosX2;
    this.shouldBeRemoved    = false;
    this.img                = new window.Image();
    this.img.src            = "../img/game/space_invaders.png";
    this.version            = 0;
    this.points             = points;
}

/**
 * The prototype of the alien describing the characteristics of the alien.
 *
 * @type {Object}
 */
Alien.prototype = {

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
        ct.beginPath();

        if (this.version === 0) {
            ct.drawImage(this.img, this.spritePosX, this.spritePosY, this.alienWidth, this.alienHeight, 0, 0, this.alienWidth, this.alienHeight);
        } else {
            ct.drawImage(this.img, this.spritePosX2, this.spritePosY, this.alienWidth, this.alienHeight, 0, 0, this.alienWidth, this.alienHeight);
        }

        ct.closePath();
        ct.stroke();
        ct.restore();
    },

    /**
     * Moves the alien to the left with one pixel muliplied with the velocity.
     *
     * @return {void}
     */
    moveLeft: function() {
        this.position.x -= 10 * this.velocity.x;
    },

    /**
     * Moves the alien to the right with one pixel muliplied with the velocity.
     *
     * @return {void}
     */
    moveRight: function() {
        this.position.x += 10 * this.velocity.x;
    },

    /**
     * Updates the movement of the alien and checks if the alien stays in the area.
     *
     * @return {void}
     */
    update: function() {
        this.version = (this.version + 1) % 2;

        if (this.direction === "right") {
            this.moveRight();
        } else {
            this.moveLeft();
        }

        this.stayInArea();
    },

    /**
     * Checks if the alien stays in the area by changing the direction of the
     * alien when the alien has reached left or right border.
     *
     * @return {void}
     */
    stayInArea: function() {
        if (this.position.x < 10) {
            this.newDirection = "right";
        }

        if (this.position.x + this.alienWidth > 890) {
            this.newDirection = "left";
        }
    },

    /**
     * Checks if a missile intersects with an alien. If so, the alien is hit.
     *
     * @param  {Object}  missilePos - The vector of the missile.
     *
     * @return {Boolean}  True if the alien has been hit, false otherwise.
     */
    alienHit: function(missilePos) {
        if (isIntersect(this.position.x, this.position.y, this.alienWidth, this.alienHeight, missilePos.x, missilePos.y, 3, 5)) {
            return true;
        } else {
            return false;
        }
    },

    /**
     * Checks if an alien intersects with the cannon. If so the alien has hit
     * the cannon.
     *
     * @param  {Object}  cannonPos - The vector of the cannon.
     *
     * @return {Boolean}   True if the alien has hit the cannon, false otherwise.
     */
    alienHitCannon: function(cannonPos) {
        if (isIntersect(this.position.x, this.position.y, this.alienWidth, this.alienHeight, cannonPos.x, cannonPos.y, 45, 25)) {
            return true;
        } else {
            return false;
        }
    }
};

/**
 * Aliens object which controls all the aliens.
 * Creates five rows with eleven aliens per row.
 */
function Aliens(cities, score) {
    this.cities = cities;
    this.score = score;
    this.aliens = [];
    this.explodedAliens = [];
    this.aliensDirection = "left";
    this.beams = null;
    this.counter = 0;
    this.speed = 40;
    var posX = 200;
    var posY = 150;
    var alienNo = 0;
    this.moveSoundVersion = 0;
    this.alienExplosion = new Audio("../sound/alien_explosion.wav");
    this.alienMoveSoundHigh = new Audio("../sound/alien_move_high.wav");
    this.alienMoveSoundLow = new Audio("../sound/alien_move_low.wav");

    for (var i = 0; i < 11; i++) {
        this.aliens[alienNo] = new Alien(new Vector(posX, posY), new Vector(0.4, 0.4), this.aliensDirection, 21, 24, 76, 31, 107, 30);
        alienNo++;
        posX += 50;
    }
    posY += 37;

    for (var j = 0; j < 2; j++) {
        posX = 198;
        for (var k = 0; k < 11; k++) {
            this.aliens[alienNo] = new Alien(new Vector(posX, posY), new Vector(0.4, 0.4), this.aliensDirection, 27, 24, 6, 31, 42, 20);
            alienNo++;
            posX += 50;
        }
        posY += 37;
    }

    for (var m = 0; m < 2; m++) {
        posX = 196;
        for (var n = 0; n < 11; n++) {
            this.aliens[alienNo] = new Alien(new Vector(posX, posY), new Vector(0.4, 0.4), this.aliensDirection, 32, 24, 56, 5, 94, 10);
            alienNo++;
            posX += 50;
        }
        posY += 37;
    }
}

/**
 * The aliens prototype.
 * @type {Object}
 */
Aliens.prototype = {
    /**
     * Creates the beams fired by the aliens.
     *
     * @param  {Object}  cannon - The vector where the cannon is located.
     *
     * @return {void}
     */
    createBeams: function(cannon) {
        this.beams = new Beams(cannon, this, this.cities);
    },

    /**
     * Draws all aliens in the array and the beams.
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
                this.aliens[j].position.y = posY + 50;
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
     * Sets the dirction of all aliens and updates the beams fired by the aliens.
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
        if (this.beams) {
            this.beams.update();
        }

        for (var j = this.explodedAliens.length -1; j >= 0; j--) {
            this.explodedAliens[j].update();

            if (this.explodedAliens[j].timer === 0) {
                this.explodedAliens.splice(j, 1);
            }
        }
    },
};

function ExplodedAlien(position) {
    this.position           = position  || new Vector();
    this.width              = 35;
    this.height             = 25;
    this.img                = new window.Image();
    this.img.src            = "../img/game/alien_explode.png";
    this.timer              = 15;
}

ExplodedAlien.prototype = {

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
        ct.beginPath();
        ct.drawImage(this.img, 0, 0, this.width, this.height);

        ct.closePath();
        ct.stroke();
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

function ExplodedMysteryShip(position, points) {
    this.position           = position  || new Vector();
    this.points             = points;
    this.width              = 35;
    this.height             = 25;
    this.img                = new window.Image();
    this.img.src            = "../img/game/alien_explode.png";
    this.timer              = 70;
}

ExplodedMysteryShip.prototype = {

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
        ct.beginPath();
        ct.drawImage(this.img, 0, 0, this.width, this.height);
        ct.closePath();
        ct.stroke();
        ct.restore();

        ct.save();
        ct.translate(this.position.x, this.position.y);
        ct.font = "32px impact";
        ct.fillStyle = '#ff0000';
        ct.fillText(this.points, 0, 20, 100);
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
 * The beam fired by an alien.
 *
 * @param {Object}  position - The vector position for the alien.
 * @param {Object}  velocity - The velocity of the beam movement as vector.
 * @param {Object}  cannon - The cannon object containing the cannon.
 * @param {Object}  aliens - The aliens object containing all aliens.
 */
function Beam(position, velocity, cannon, aliens, cities) {
    this.position           = position  || new Vector();
    this.velocity           = velocity  || new Vector(1,1);
    this.cannon             = cannon;
    this.aliens             = aliens;
    this.cities             = cities;
    this.width              = 3;
    this.height             = 5;
    this.shouldBeRemoved    = false;
}

/**
 * The prototype of the beam describing the beam characteristics.
 *
 * @type {Object}
 */
Beam.prototype = {

    /**
     * Draws the beam as a red laser beam.
     *
     * @param  {Object}  ct - The canvas context.
     *
     * @return {void}
     */
    draw: function(ct) {
        ct.save();
        ct.fillStyle = "rgb(255, 0, 0)";
        ct.strokeStyle = "rgb(255, 0, 0)";
        ct.translate(this.position.x, this.position.y);
        ct.beginPath();
        ct.fillRect (0, 0, this.width, this.height);
        ct.closePath();

        ct.stroke();
        ct.fill();
        ct.restore();
    },

    /**
     * Moves the beam up with one pixel muliplied with the velocity.
     * The velocity is used to determine the speed of the beam movement.
     *
     * @return {void}
     */
    moveDown: function() {
        this.position.y += 1 * this.velocity.y;
    },

    /**
     * Updates the beam movement and check if the beam has reached the
     * bottom of the game board or has hit the gun.
     *
     * @return {void}
     */
    update: function() {
        this.moveDown();
        this.stayInArea();
        if (this.cannon.cannonHit(this.position)) {
            this.shouldBeRemoved = true;
        }

        if (this.cities.beamHitsCities(this)) {
            this.shouldBeRemoved = true;
        }
    },

    /**
     * Checks if the beam has reached the bottom of the game board and then
     * should be removed.
     *
     * @return {void}
     */
    stayInArea: function() {
        if (this.position.y > 650 - this.height) {
            this.shouldBeRemoved = true;
        }
    }
};

/**
 * The beams object.
 * Used to control all beams.
 *
 * @param {Object}  cannon - Contains cannon.
 * @param {Object}  aliens - Contains all aliens.
 */
function Beams(cannon, aliens, cities) {
    this.cannon = cannon;
    this.aliens = aliens;
    this.cities = cities;
    this.beams = [];
    this.groundExplosions = [];
    this.delay = 20;
    this.alienMissile = new Audio("../sound/alien_missile.wav");
    this.alienMissile.volume = 0.3;
    this.groundExplosion = new Audio("../sound/ground_explosion.wav");
}

/**
 * The beam prototype which controls all beams.
 * @type {Object}
 */
Beams.prototype = {

    /**
     * Draws all beams.
     *
     * Draws all beams that is stored in an array.
     *
     * @param  {Object}  ct - The canvas context.
     *
     * @return {void}
     */
    draw: function(ct) {
        for (var i = 0; i < this.beams.length; i++) {
            this.beams[i].draw(ct);
        }

        for (var j = 0; j < this.groundExplosions.length; j++) {
            this.groundExplosions[j].draw(ct);
        }
    },

    /**
     * Fires a beam by creating a beam and store the beam in the array
     * of beams. The beams are fired with an delay and it is a randomly choosen
     * alien that fires the beam. Only aliens without an another alien below
     * could fire a beam.
     *
     * @return {void}
     */
    fire: function() {
        var shouldFire = false;

        if (this.delay > 0) {
            this.delay -= 1;
        } else {
            shouldFire = true;
            this.delay = 20;
        }

        if (shouldFire) {
            var alienNo = Guer.random(0, this.aliens.aliens.length - 1);

            var allowedToFire = true;
            for (var i = 0; i < this.aliens.aliens.length; i++) {
                if (i !== alienNo) {
                    if (isIntersectInXLed(this.aliens.aliens[alienNo].position.x, this.aliens.aliens[alienNo].alienWidth, this.aliens.aliens[i].position.x, this.aliens.aliens[i].alienWidth)) {
                        if (this.aliens.aliens[alienNo].position.y < this.aliens.aliens[i].position.y) {
                            allowedToFire = false;
                        }
                    }
                }
            }

            if (allowedToFire) {
                var beamPosX = this.aliens.aliens[alienNo].position.x + (this.aliens.aliens[alienNo].alienWidth / 2);
                var beamPosY = this.aliens.aliens[alienNo].position.y + this.aliens.aliens[alienNo].alienHeight;
                this.beams.push(new Beam(new Vector(beamPosX, beamPosY), new Vector(6, 6), this.cannon, this.aliens, this.cities));
                this.alienMissile.pause();
                this.alienMissile.currentTime = 0;
                this.alienMissile.play();
            }
        }
    },

    /**
     * Updates all beams and removes a beam from the array if the beam
     * should be removed.
     *
     * @return {void}
     */
    update: function() {
        this.fire();
        for (var i = this.beams.length -1; i >= 0; i--) {
            this.beams[i].update();
            if (this.beams[i].shouldBeRemoved) {
                this.groundExplosions.push(new GroundExplosion(new Vector(this.beams[i].position.x, this.beams[i].position.y)));
                this.groundExplosion.pause();
                this.groundExplosion.currentTime = 0;
                this.groundExplosion.play();
                this.beams.splice(i, 1);
            }
        }

        for (var j = this.groundExplosions.length -1; j >= 0; j--) {
            this.groundExplosions[j].update();

            if (this.groundExplosions[j].timer === 0) {
                this.groundExplosions.splice(j, 1);
            }
        }
    },
};

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
        ct.beginPath();
        ct.drawImage(this.img, 0, 0, this.width, this.height);

        ct.closePath();
        ct.stroke();
        ct.restore();
    },
};

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
        ct.beginPath();
        ct.drawImage(this.img, 0, 0, this.width, this.height);

        ct.closePath();
        ct.stroke();
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
        ct.beginPath();
        ct.drawImage(this.img, 0, 0, this.width, this.height);

        ct.closePath();
        ct.stroke();
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
    this.height     = 55;
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
        console.log("Draw city:" + this.ct);
        this.ct.save();
        this.ct.fillStyle = "rgb(79, 255, 48)";
        this.ct.strokeStyle = "rgb(79, 255, 48)";
        this.ct.translate(this.position.x, this.position.y);
        this.ct.beginPath();

        this.ct.moveTo(0, 0);
        this.ct.lineTo(15, 0);
        this.ct.quadraticCurveTo(15, -this.height/2, this.width/2, -this.height/2);
        this.ct.quadraticCurveTo(this.width-15, -this.height/2, this.width-15, 0);
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

    generateDamage: function(x, y) {

        x = Math.floor(x / 2) * 2;
        y = Math.floor(y / 2) * 2;

        this.ct.clearRect(x - 2, y - 2, 4, 4);
        this.ct.clearRect(x + 2, y - 4, 2, 4);
        this.ct.clearRect(x + 4, y, 2, 2);
        this.ct.clearRect(x + 2, y + 2, 2, 2);
        this.ct.clearRect(x - 4, y + 2, 2, 2);
        this.ct.clearRect(x - 6, y, 2, 2);
        this.ct.clearRect(x - 4, y - 4, 2, 2);
        this.ct.clearRect(x - 2, y - 6, 2, 2);
    },

    missileHitsCity: function(missile) {
        var missilePosY = missile.position.y - 480;
        if (isIntersect(this.position.x, this.position.y - this.height, this.width, this.height, missile.position.x, missilePosY, missile.width, missile.height)) {
            var data = this.ct.getImageData(missile.position.x, missilePosY, missile.width, 1);
            if (data.data[1] !== 0) {
                this.generateDamage(missile.position.x, missilePosY);
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
                this.generateDamage(beam.position.x, beamPosY+2);
                return true;
            }
        } else {
            return false;
        }
    },
};

function Cities() {
    this.cityCanvas = null;
    this.cityCt = null;
    this.posY = 580;
    this.height = 55;
    this.cities = [];
}

/**
 * The beam prototype which controls all beams.
 * @type {Object}
 */
Cities.prototype = {

    /**
     * Draws all beams.
     *
     * Draws all beams that is stored in an array.
     *
     * @param  {Object}  ct - The canvas context.
     *
     * @return {void}
     */
    init: function() {
        this.cityCanvas = document.createElement("canvas");
        this.cityCanvas.width = 900;
        this.cityCanvas.height = 55;
        this.cityCt = this.cityCanvas.getContext("2d");

        var posX = 130;
        for (var i = 0; i < 4; i++) {
            this.cities.push(new City(this.cityCt, new Vector(posX, 55)));
            posX += 200;
        }

        for (var j = 0; j < this.cities.length; j++) {
            this.cities[j].draw(this.cityCt);
        }
    },

    missileHitsCities: function(missile) {
        for (var i = 0; i < this.cities.length; i++) {
            if (this.cities[i].missileHitsCity(missile)) {
                return true;
            }
        }

        return false;
    },

    beamHitsCities: function(beam) {
        for (var i = 0; i < this.cities.length; i++) {
            if (this.cities[i].beamHitsCity(beam)) {
                return true;
            }
        }

        return false;
    },
};

function MysteryShip(position, velocity, direction) {
    this.position           = position  || new Vector();
    this.velocity           = velocity  || new Vector(1,1);
    this.direction          = direction || "right";
    this.width              = 35;
    this.height             = 15;
    this.shouldBeRemoved    = false;
    this.reachedBorder      = false;
    this.img                = new window.Image();
    this.img.src            = "../img/game/mystery_ship.png";
}

/**
 * The prototype of the alien describing the characteristics of the alien.
 *
 * @type {Object}
 */
MysteryShip.prototype = {

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
        ct.beginPath();
        ct.drawImage(this.img, 0, 0, this.width, this.height);
        ct.closePath();
        ct.stroke();
        ct.restore();
    },

    /**
     * Moves the alien to the left with one pixel muliplied with the velocity.
     *
     * @return {void}
     */
    moveLeft: function() {
        this.position.x -= 1 * this.velocity.x;
    },

    /**
     * Moves the alien to the right with one pixel muliplied with the velocity.
     *
     * @return {void}
     */
    moveRight: function() {
        this.position.x += 1 * this.velocity.x;
    },

    /**
     * Updates the movement of the alien and checks if the alien stays in the area.
     *
     * @return {void}
     */
    update: function() {
        if (this.direction === "right") {
            this.moveRight();
        } else {
            this.moveLeft();
        }

        this.stayInArea();
    },

    /**
     * Checks if the alien stays in the area by changing the direction of the
     * alien when the alien has reached left or right border.
     *
     * @return {void}
     */
    stayInArea: function() {
        if (this.position.x < 10) {
            this.shouldBeRemoved = true;
            this.reachedBorder = true;
        }

        if (this.position.x + this.width > 890) {
            this.shouldBeRemoved = true;
            this.reachedBorder = true;
        }
    },

    /**
     * Checks if a missile intersects with the mystery ship. If so, the mystery
     * ship is hit.
     *
     * @param  {Object}  missilePos - The vector of the missile.
     *
     * @return {Boolean}  True if the mystery ship has been hit, false otherwise.
     */
    mysteryShipHit: function(missile) {
        if (isIntersect(this.position.x, this.position.y, this.width, this.height, missile.position.x, missile.position.y, missile.width, missile.height)) {
            return true;
        } else {
            return false;
        }
    },
};

/**
 * Mystery ship object which controls all the mystery ships.
 *
 */
function MysteryShips(score) {
    this.score                  = score;
    this.mysteryShips           = [];
    this.explodedMysteryShips   = [];
    this.aliensDirection        = "left";
    this.timer                  = Guer.random(200, 500);
    this.moveSoundVersion       = 0;
    this.mysteryShipExplosion   = new Audio("../sound/alien_explosion.wav");
    this.shipMoveSound          = new Audio("../sound/ufo_highpitch.wav");
}

/**
 * The aliens prototype.
 * @type {Object}
 */
MysteryShips.prototype = {
    /**
     * Draws all aliens in the array and the beams.
     *
     * @param  {Object}  ct - The canvas context.
     *
     * @return {void}
     */
    draw: function(ct) {
        for (var i = 0; i < this.mysteryShips.length; i++) {
            this.mysteryShips[i].draw(ct);
        }

        for (var j = 0; j < this.explodedMysteryShips.length; j++) {
            this.explodedMysteryShips[j].draw(ct);
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
    mysteryShipsHit: function(missile) {
        for (var i = 0; i < this.mysteryShips.length; i++) {
            if (this.mysteryShips[i].mysteryShipHit(missile)) {
                this.mysteryShips[i].shouldBeRemoved = true;
                return true;
            }
        }

        return false;
    },

    /**
     * Updates all aliens. Removes aliens that have been hit by a missile from
     * the array of aliens. Plays an sound of explosion when an alien is hit.
     * Sets the dirction of all aliens and updates the beams fired by the aliens.
     *
     * @return {void}
     */
    update: function() {
        if (this.mysteryShips.length === 0) {
            this.timer--;
        }

        if (this.timer === 0) {
            var direction = Guer.random(0, 1);
            if (direction > 0) {
                this.mysteryShips.push(new MysteryShip(new Vector(850, 110), new Vector(3, 3), "left"));
            } else {
                this.mysteryShips.push(new MysteryShip(new Vector(15, 110), new Vector(3, 3), "right"));
            }

            this.timer = Guer.random(200, 500);
        }

        for (var i = this.mysteryShips.length -1; i >= 0; i--) {
            this.moveSoundVersion = (this.moveSoundVersion + 1) % 3;
            if (this.moveSoundVersion === 0) {
                this.shipMoveSound.play();
            }

            this.mysteryShips[i].update();

            if (this.mysteryShips[i].shouldBeRemoved) {
                if (!this.mysteryShips[i].reachedBorder) {
                    var points = Guer.random(40, 80);
                    this.explodedMysteryShips.push(new ExplodedMysteryShip(new Vector(this.mysteryShips[i].position.x, this.mysteryShips[i].position.y), points));
                    this.score.addScore(points);
                    this.mysteryShipExplosion.pause();
                    this.mysteryShipExplosion.currentTime = 0;
                    this.mysteryShipExplosion.play();
                }

                this.mysteryShips.splice(i, 1);
            }
        }

        for (var j = this.explodedMysteryShips.length -1; j >= 0; j--) {
            this.explodedMysteryShips[j].update();

            if (this.explodedMysteryShips[j].timer === 0) {
                this.explodedMysteryShips.splice(j, 1);
            }
        }
    },
};

function Score() {
    this.highScore  = 0;
    this.score      = 0;
}

Score.prototype = {
    /**
     * Draws all aliens in the array and the beams.
     *
     * @param  {Object}  ct - The canvas context.
     *
     * @return {void}
     */
    draw: function(ct) {
        ct.save();
        ct.translate(325, 40);
        ct.font = "24px impact";
        ct.fillStyle = '#fff';
        ct.fillText('SCORE', 0, 0, 200);
        ct.fillText('HI-SCORE', 200, 0, 200);
        var score = ('0000' + this.score).substr(-4);
        ct.fillText(score, 7, 30, 200);
        var highScore = ('0000' + this.highScore).substr(-4);
        ct.fillText(highScore, 220, 30, 200);
        ct.restore();
    },

    addScore: function(score) {
        this.score += score;
    }
};

/**
 * The Space Invaders game.
 */
window.SpaceInvaders = (function() {
    var ct, cannon, lastGameTick, aliens, isCannonPresent, isAliensPresent, isGameOver, ground, cities, mysteryShips, score;
    var width, height;

    /**
     * Initiates the game.
     *
     * @param  {Object}  canvas - The canvas.
     * @return {void}
     */
    var init = function(canvas) {
        canvas = document.getElementById(canvas);
        ct = canvas.getContext('2d');
        width = 900;
        height = 750;
        score = new Score();
        ct.lineWidth = 1;
        cities = new Cities(ct);
        cities.init();
        ground = new Grounds();
        mysteryShips = new MysteryShips(score);
        aliens = new Aliens(cities, score);
        cannon = new Cannon(new Vector(width / 2, height-100), new Vector(3, 3), aliens, cities, mysteryShips);
        isCannonPresent = true;
        isAliensPresent = true;
        isGameOver = false;


        console.log('Init the game');
    };

    /**
     * Updates the game and check if the game is over or not.
     *
     * @param  {Object}  ct - The canvas context.
     *
     * @return {void}
     */
    var update = function(td) {
        isCannonPresent = cannon.shouldBeRemoved === false ? true : false;
        isAliensPresent = aliens.aliens.length > 0 ? true : false;


        if (isCannonPresent && isAliensPresent) {
            cannon.update(td, width);
            aliens.update();
            mysteryShips.update();
        } else {
            isGameOver = true;
        }
    };

    /**
     * Renders the game or the result of the game if the game is over.
     *
     * @return {void}
     */
    var render = function() {
        ct.clearRect(0, 0, width, height);
        ct.drawImage(cities.cityCanvas, 0, 480);
        ground.draw(ct);
        mysteryShips.draw(ct);
        cannon.draw(ct);
        aliens.draw(ct);
        score.draw(ct);

        if (isGameOver) {
            ct.save();
            ct.translate(width / 2, 200);
            ct.font = "60px impact";
            if (isCannonPresent) {
                ct.fillStyle = '#009900';
                ct.fillText('Grattis!', -80, 0, 300);
                ct.font = "36px impact";
                ct.fillText('Du vann!', -80, 50, 300);
            } else {
                ct.fillStyle = '#FF0000';
                ct.fillText('Tyvärr!', -80, 0, 300);
                ct.font = "36px impact";
                ct.fillText('Du förlorade!', -80, 50, 300);
            }

            ct.restore();
        }
    };

    /**
     * The game loop that update the game continuously.
     *
     * @return {void}
     */
    var gameLoop = function() {
        var now = Date.now();
        var td = (now - (lastGameTick || now)) / 1000;
        lastGameTick = now;
        requestAnimFrame(gameLoop);
        update(td);
        render();
    };

    return {
        'init': init,
        'gameLoop': gameLoop
    };
})();



/**
 * Starts the JavaScript when the page is loaded.
 */
$(function() {
    'use strict';
    SpaceInvaders.init('canvas');
    SpaceInvaders.gameLoop();

    console.log('Ready to play.');
});
