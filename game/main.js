/**
 * Playing SpaceInvaders while learning JavaScript object model.
 */

/*global Aliens */
/*global Cannons */
/*global Cities */
/*global GameOver */
/*global Grounds */
/*global Intro */
/*global Key */
/*global MysteryShips */
/*global SpaceInvaders */
/*global requestAnimFrame */

/*exported Vector */


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

function Status(status) {
    this.gameStatus = status;
}


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

function Score() {
    this.highScore  = 0;
    this.score      = null;
}

Score.prototype = {
    start: function() {
        this.score = 0;
    },

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
    var ct, cannons, lastGameTick, aliens, isCannonPresent, isAliensPresent, ground, cities, mysteryShips, score, intro;
    var width, height;
    var gameOver, status, isNewGame;

    /**
     * Initiates the game.
     *
     * @param  {Object}  canvas - The canvas.
     * @return {void}
     */
    var init = function(canvas) {
        canvas = document.getElementById(canvas);
        ct = canvas.getContext('2d');
        ct.lineWidth = 1;
        width = 900;
        height = 750;
        status = new Status("intro");
        intro = new Intro(canvas, status);
        gameOver = new GameOver(canvas);
        score = new Score();
        cities = new Cities(ct);
        ground = new Grounds();
        mysteryShips = new MysteryShips(score);
        aliens = new Aliens(cities, score);
        cannons = new Cannons(aliens, cities, mysteryShips);
        isNewGame = true;


        console.log('Init the game');
    };

    var startGame = function() {
        isCannonPresent = true;
        isAliensPresent = true;
        aliens.start();
        score.start();
        cities.start();
        mysteryShips.start();
        cannons.start(width, height);
    };

    /**
     * Updates the game and check if the game is over or not.
     *
     * @param  {Object}  ct - The canvas context.
     *
     * @return {void}
     */
    var update = function(td) {

        if (status.gameStatus === "game") {
            if (isNewGame) {
                startGame();
                isNewGame = false;
            }

            isCannonPresent = cannons.cannons.length > 0 ? true : false;
            isAliensPresent = aliens.aliens.length > 0 ? true : false;

            if (!isAliensPresent) {
                aliens.start();
            }

            if (isCannonPresent) {
                cannons.update(td, width);
                if (cannons.timer === 180) {
                    aliens.update();
                    mysteryShips.update();
                }
            } else {
                status.gameStatus = "gameOver";
            }
        } else if (status.gameStatus === "intro") {
            intro.update();
        } else if (status.gameStatus === "gameOver") {
            isNewGame = true;
            gameOver.init(score.score);
            gameOver.update();
        }
    };

    /**
     * Renders the game or the result of the game if the game is over.
     *
     * @return {void}
     */
    var render = function() {
        ct.clearRect(0, 0, width, height);
        if (status.gameStatus === "game") {
            ct.drawImage(cities.cityCanvas, 0, 480);
            ground.draw(ct);
            mysteryShips.draw(ct);
            cannons.draw(ct);
            aliens.draw(ct);
            score.draw(ct);
        } else if (status.gameStatus === "intro") {
            intro.draw(ct);
        } else if (status.gameStatus === "gameOver") {
            ct.drawImage(cities.cityCanvas, 0, 480);
            ground.draw(ct);
            cannons.draw(ct);
            score.draw(ct);
            gameOver.draw(ct);
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
