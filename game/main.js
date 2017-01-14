/**
 * Main part of the game space invaders.
 *
 * Handles pressed buttons and calls other JavaScript files.
 */

/*global Aliens */
/*global Cannons */
/*global Cities */
/*global GameOver */
/*global Grounds */
/*global Intro */
/*global HighScore */
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

    BACKSPACE: 8,
    ENTER: 13,
    LEFT:   37,
    RIGHT:  39,
    SPACE:  32,

    /**
     * Checks if the key code of the pressed key is stored in the pressed array.
     * The array is checked continuously.
     *
     * @param  {number}  keyCode - The key code of the pressed key.
     * @return {boolean}  True if the key code of the pressed key is stored in array.
     */
    isDown: function(keyCode) {
        return this.pressed[keyCode];
    },

    /**
     * Sets the key code of the pressed key to true in the pressed key array.
     * Indicates that a key has been pressed.
     *
     * Prevents default for the space key to prevent the game board to move in
     * vertical direction when firing the cannon.
     *
     * @param  {Object}  event - The event object.
     * @return {void}
     */
    onKeydown: function(event) {
        if (event.keyCode === 32) {
            event.preventDefault();
        }
        this.pressed[event.keyCode] = true;
    },

    /**
     * Deletes the key code of the released key. Indicates that the pressed key
     * has been released.
     *
     * Prevents default for the space key to prevent the game board to move in
     * vertical direction when firing the cannon.
     *
     * @param  {Object}  event - The event object.
     * @return {void}
     */
    onKeyup: function(event) {
        if (event.keyCode === 32) {
            event.preventDefault();
        }

        delete this.pressed[event.keyCode];
    },
};

// Add event listener to key up and key down (jQuery). Connect the event to
// the functions in Key object.
window.addEventListener('keyup',   function(event) { Key.onKeyup(event); },   false);
window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);

/**
 * Controls the status of the game (intro, game, gameOver or highScore). Is the
 * state machine of the game.
 *
 * @param {string} status - the status of the game.
 */
function Status(status) {
    this.gameStatus = status;
}

/**
 * The prototype of the status describing the characteristics of the status.
 *
 * @type {Object}
 */
Status.prototype = {
    /**
     * Sets the game status of the game. Used when switching state of the game.
     *
     * @param {string} gameStatus - the next status of the game (intro, game,
     *                              gameOver or highScore).
     *
     * @return {void}
     */
    setGameStatus: function(gameStatus) {
        this.gameStatus = gameStatus;
        console.log("Game Status: " + this.gameStatus);
    },

    /**
     * Checks the game status of the game.
     *
     * @param  {string}  gameStatus - the game status.
     *
     * @return {boolean}            - true if the game status is according to the
     *                                in parameter, false otherwise.
     */
    isGameStatus: function(gameStatus) {
        if (this.gameStatus === gameStatus) {
            return true;
        } else {
            return false;
        }
    }
};


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
 * The score constructor
 *
 * Sets the score characteristics.
 */
function Score() {
    this.highScore  = null;
    this.score      = null;
}

/**
 * The prototype of the score describing the characteristics of the score.
 *
 * @type {Object}
 */
Score.prototype = {
    start: function() {
        this.highScore  = 0;
        this.score = 0;
        this.getHighScore();
    },

    /**
     * Draws all score and high score on the top of the game board.
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

    /**
     * Adds increases the score.
     *
     * @param {number} score - the score to increase the score with.
     *
     * @return {void}
     */
    addScore: function(score) {
        this.score += score;
    },

    /**
     * Gets the highest score from the high score list in the database. Using
     * Ajax and Json to send the request to the server side.
     *
     * @return {void}
     */
    getHighScore: function() {
        var that = this;

        $.ajax({
            type: 'post',
            url: 'game/highScores.php?action=getHighScore',
            dataType: 'json',
            success: function(data) {
                that.highScore = data;
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log('Ajax request failed: ' + textStatus + ', ' + errorThrown);
            }
        });
    }
};


/**
 * The Space Invaders game.
 */
window.SpaceInvaders = (function() {
    var ct, cannons, lastGameTick, aliens, isCannonPresent, isAliensPresent, ground, cities, mysteryShips, score, intro;
    var width, height;
    var gameOver, status, isNewGame, highScore, isInitHighScore, isInitGameOver, isInitIntro;

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
        height = 650;
        status = new Status("intro");
        intro = new Intro(canvas, status);
        gameOver = new GameOver(canvas, status);
        highScore = new HighScore(canvas, status);
        score = new Score();
        cities = new Cities(width);
        ground = new Grounds(height);
        mysteryShips = new MysteryShips(score);
        aliens = new Aliens(cities, score, height, width);
        cannons = new Cannons(aliens, cities, mysteryShips, height, width);
        isNewGame = true;
        isInitHighScore = true;
        isInitGameOver = true;
        isInitIntro = true;


        console.log('Init the game');
    };

    /**
     * Starts the game.
     *
     * @return {void}
     */
    var startGame = function() {
        isCannonPresent = true;
        isAliensPresent = true;
        score.start();
        aliens.start();
        cities.start();
        mysteryShips.start();
        cannons.start();
    };

    /**
     * Updates the game according to the game status.
     *
     * @param  {number}  td  - Time difference offset
     *
     * @return {void}
     */
    var update = function(td) {

        if (status.isGameStatus("game")) {
            isInitIntro = true;
            isInitHighScore = true;
            isInitGameOver = true;
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
                cannons.update(td);
                if (cannons.timer === 180) {
                    aliens.update(td);
                    mysteryShips.update(td);
                }
            } else {
                status.setGameStatus("gameOver");
            }
        } else if (status.isGameStatus("intro")) {
            if (isInitIntro) {
                intro.start();
                isInitIntro = false;
                isInitHighScore = true;
                isInitGameOver = true;
            }
            intro.update();
        } else if (status.isGameStatus("gameOver")) {
            if (isInitGameOver) {
                gameOver.init(score.score);
                isInitGameOver = false;
                isInitIntro = true;
                isNewGame = true;
                isInitHighScore = true;
            }
            gameOver.update();
        } else if (status.isGameStatus("highScore")) {
            if (isInitHighScore) {
                highScore.start();
                isInitHighScore = false;
                isInitIntro = true;
                isInitGameOver = true;
            }
            highScore.update();
        }
    };

    /**
     * Renders the game according to the game status.
     *
     * @return {void}
     */
    var render = function() {
        ct.clearRect(0, 0, width, height);
        if (status.isGameStatus("game")) {
            ct.drawImage(cities.cityCanvas, 0, 452);
            ground.draw(ct);
            mysteryShips.draw(ct);
            cannons.draw(ct);
            aliens.draw(ct);
            score.draw(ct);
        } else if (status.isGameStatus("intro")) {
            intro.draw(ct);
        } else if (status.isGameStatus("gameOver")) {
            ct.drawImage(cities.cityCanvas, 0, 452);
            ground.draw(ct);
            cannons.draw(ct);
            score.draw(ct);
            gameOver.draw(ct);
        } else if (status.isGameStatus("highScore")) {
            highScore.draw(ct);
        }
    };

    /**
     * The game loop that update the game continuously.
     *
     * @return {void}
     */
    var gameLoop = function() {
        var now = Date.now();
        //var td = (now - (lastGameTick || now)) / 1000;
        var td = (now - (lastGameTick || now)) / 17;
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
