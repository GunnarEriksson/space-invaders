/**
 * The intro handler in the game.
 *
 * Shows different aliens and the related points.
 *
 * Writes the text "NEW GAME" and "HIGH SCORE" with the possibility to choose
 * one of the alternatives.
 *
 */

/*global isIntersect */
/*global showTextLetterByLetter */

/**
 * The intro constructor.
 *
 * Sets the intro specifications.
 *
 * @param {Object} canvas - the canvas to write the text on.
 * @param {Object} status - the status of choosen alternatives (game or high score).
 */
function Intro(canvas, status) {
    this.canvas = canvas;
    this.status = status;
    this.mysteryPoints          = [" ", "=", " ", "?", " ", "M", "Y", "S", "T", "E", "R", "Y"];
    this.alien1                 = [" ", "=", " ", "3", "0", " ", "P", "O", "I", "N", "T", "S"];
    this.alien2                 = [" ", "=", " ", "2", "0", " ", "P", "O", "I", "N", "T", "S"];
    this.alien3                 = [" ", "=", " ", "1", "0", " ", "P", "O", "I", "N", "T", "S"];
    this.timer                  = 0;
    this.mysteryShipIndex       = 0;
    this.alien1Index            = 0;
    this.alien2Index            = 0;
    this.alien3Index            = 0;
    this.isHoverOverStart       = false;
    this.isHooverOverHighScore  = false;
    this.mysteryShipImg         = new window.Image();
    this.mysteryShipImg.src     = "img/game/mystery_ship.png";
    this.alienImg               = new window.Image();
    this.alienImg.src           = "img/game/space_invaders.png";
    this.onMouseClickPlay       = this.checkPlayGame.bind(this);
    this.onMouseClickHighScores = this.checkHighScores.bind(this);
    this.onMouseMove            = this.mouseMove.bind(this);
}

/**
 * The prototype of the intro describing the characteristics.
 *
 * @type {Object}
 */
Intro.prototype = {
    start: function() {
        this.timer                  = 0;
        this.mysteryShipIndex       = 0;
        this.alien1Index            = 0;
        this.alien2Index            = 0;
        this.alien3Index            = 0;
        this.isHoverOverStart       = false;
        this.isHooverOverHighScore  = false;

        this.canvas.addEventListener("click", this.onMouseClickPlay, false);
        this.canvas.addEventListener("click", this.onMouseClickHighScores, false);
        this.canvas.addEventListener("mousemove", this.onMouseMove, false);
    },

    /**
     * Draws the aliens and the text letter by letter with a delay between the
     * letters.
     *
     * @param  {Object}  ct - The canvas context.
     *
     * @return {Void}
     */
    draw: function(ct) {
        ct.save();
        ct.translate(980 / 2, 160);
        ct.font = "140px impact";
        ct.fillStyle = '#fff';
        ct.fillText('SPACE', -190, 0, 300);

        ct.font = "90px impact";
        ct.fillStyle = "rgb(79, 255, 48)";
        ct.fillText('INVADERS', -185, 80, 300);


        ct.font = "normal lighter 24px arcade, monospace";
        ct.fillStyle = "#fff";

        if (this.timer > 50) {
            ct.drawImage(this.mysteryShipImg, -155, 125, 35, 15);
            this.mysteryShipIndex = showTextLetterByLetter(ct, this.timer, this.mysteryShipIndex, this.mysteryPoints, -110, 140, 15);
        }

        if (this.timer > 170) {
            ct.drawImage(this.alienImg, 76, 31, 21, 24, -150, 160, 21, 24);
            this.alien1Index = showTextLetterByLetter(ct, this.timer, this.alien1Index, this.alien1, -110, 180, 15);
        }

        if (this.timer > 290) {
            ct.drawImage(this.alienImg, 6, 31, 27, 24, -150, 200, 27, 24);
            this.alien2Index = showTextLetterByLetter(ct, this.timer, this.alien2Index, this.alien2, -110, 220, 15);
        }

        if (this.timer > 410) {
            ct.drawImage(this.alienImg, 56, 5, 32, 24, -150, 240, 32, 24);
            this.alien3Index = showTextLetterByLetter(ct, this.timer, this.alien3Index, this.alien3, -110, 260, 15);
        }

        if (this.isHoverOverStart) {
            ct.fillStyle = "rgb(79, 255, 48)";
            ct.fillText('PLAY GAME', -105, 380);
        } else {
            ct.fillStyle = "#fff";
            ct.fillText('PLAY GAME', -105, 380);
        }

        if (this.isHooverOverHighScore) {
            ct.fillStyle = "rgb(79, 255, 48)";
            ct.fillText('HIGH SCORES', -118, 420);
        } else {
            ct.fillStyle = "#fff";
            ct.fillText('HIGH SCORES', -118, 420);
        }

        ct.restore();
    },

    /**
     * Updates the timer, which is used to write the text letter by letter with
     * delay.
     *
     * @return {Void}
     */
    update: function() {
        if (this.timer <= 530) {
            this.timer++;
        }
    },

    /**
     * Checks if the text "PLAY GAME" is clicked to start a new game.
     *
     * @param  {Object} event  - the click event.
     *
     * @return {Void}
     */
    checkPlayGame: function(event) {
        var pos = this.getMousePos(event);

        if (isIntersect(pos.x, pos.y, 1, 1, 388, 524, 125, 20)) {
            this.removeListeners();
            this.status.setGameStatus("game");
        }
    },

    /**
     * Checks if the text "HIGH SCORES" is clicked to show the high scores.
     *
     * @param  {Object} event  - the click event.
     *
     * @return {Void}
     */
    checkHighScores: function(event) {
        var pos = this.getMousePos(event);

        if (isIntersect(pos.x, pos.y, 1, 1, 374, 563, 160, 20)) {
            this.removeListeners();
            this.status.setGameStatus("highScore");
        }
    },

    /**
     * Checks if the mouse is moved and gets the position of the mouse on
     * the canvas.
     *
     * @param  {Object} event - the mouse move event
     *
     * @return {Void}
     */
    mouseMove: function(event) {
        var pos = this.getMousePos(event);

        this.hooverOverPlayGame(pos.x, pos.y);
        this.hooverOverHighScore(pos.x, pos.y);
    },

    /**
     * Gets the mouse position on the canvas in x and y led.
     *
     * @param  {Object} event - the mouse move event.
     *
     * @return {Void}
     */
    getMousePos: function(event) {
        var rect = this.canvas.getBoundingClientRect();

        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    },

    /**
     * Checks if the mouse is hoovering over the text "PLAY GAME".
     *
     * @param  {Integer} ax - the position in x led for the mouse on canvas.
     * @param  {Integer} ay - the position in y led for the mouse on canvas.
     *
     * @return {Void}
     */
    hooverOverPlayGame: function(ax, ay) {
        if (isIntersect(ax, ay, 1, 1, 388, 524, 125, 20)) {
            this.isHoverOverStart = true;
        } else {
            this.isHoverOverStart = false;
        }
    },

    /**
     * Checks if the mouse is hoovering over the text "HIGH SCORE".
     *
     * @param  {Integer} ax - the position in x led for the mouse on canvas.
     * @param  {Integer} ay - the position in y led for the mouse on canvas.
     *
     * @return {Void}
     */
    hooverOverHighScore: function(ax, ay) {
        if (isIntersect(ax, ay, 1, 1, 374, 563, 160, 20)) {
            this.isHooverOverHighScore = true;
        } else {
            this.isHooverOverHighScore = false;
        }
    },

    /**
     * Removes all event listeners created when the file was started (initiated).
     *
     * @return {Void}
     */
    removeListeners: function() {
        this.canvas.removeEventListener("mousemove", this.onMouseMove, false);
        this.canvas.removeEventListener("click", this.onMouseClickHighScores, false);
        this.canvas.removeEventListener("click", this.onMouseClickPlay, false);
    }
};
