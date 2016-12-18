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
    canvas.addEventListener("click", this.checkStart.bind(this), false);
    canvas.addEventListener("mousemove", this.mouseMove.bind(this), false);
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
    this.mysteryShipImg.src     = "../img/game/mystery_ship.png";
    this.alienImg               = new window.Image();
    this.alienImg.src           = "../img/game/space_invaders.png";
}

/**
 * The prototype of the intro describing the characteristics.
 *
 * @type {Object}
 */
Intro.prototype = {
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
        ct.translate(980 / 2, 200);
        ct.font = "140px impact";
        ct.fillStyle = '#fff';
        ct.fillText('SPACE', -190, 0, 300);

        ct.font = "90px impact";
        ct.fillStyle = "rgb(79, 255, 48)";
        ct.fillText('INVADERS', -185, 80, 300);


        ct.font = "normal lighter 24px arcade, monospace";
        ct.fillStyle = "#fff";

        if (this.timer > 50) {
            ct.drawImage(this.mysteryShipImg, -135, 150, 35, 15);
            this.mysteryShipIndex = showTextLetterByLetter(ct, this.timer, this.mysteryShipIndex, this.mysteryPoints, -90, 163, 15);
        }

        if (this.timer > 170) {
            ct.drawImage(this.alienImg, 76, 31, 21, 24, -130, 180, 21, 24);
            this.alien1Index = showTextLetterByLetter(ct, this.timer, this.alien1Index, this.alien1, -90, 200, 15);
        }

        if (this.timer > 290) {
            ct.drawImage(this.alienImg, 6, 31, 27, 24, -130, 220, 27, 24);
            this.alien2Index = showTextLetterByLetter(ct, this.timer, this.alien2Index, this.alien2, -90, 240, 15);
        }

        if (this.timer > 410) {
            ct.drawImage(this.alienImg, 56, 5, 32, 24, -130, 260, 32, 24);
            this.alien3Index = showTextLetterByLetter(ct, this.timer, this.alien3Index, this.alien3, -90, 280, 15);
        }

        if (this.isHoverOverStart) {
            ct.fillStyle = "rgb(79, 255, 48)";
            ct.fillText('PLAY GAME', -90, 380, 300);
        } else {
            ct.fillStyle = "#fff";
            ct.fillText('PLAY GAME', -90, 380, 300);
        }

        if (this.isHooverOverHighScore) {
            ct.fillStyle = "rgb(79, 255, 48)";
            ct.fillText('HIGH SCORES', -103, 420, 300);
        } else {
            ct.fillStyle = "#fff";
            ct.fillText('HIGH SCORES', -103, 420, 300);
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
    checkStart: function(event) {
        var pos = this.getMousePos(event);

        if (isIntersect(pos.x, pos.y, 1, 1, 403, 560, 125, 20)) {
            this.status.gameStatus = "game";
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

        this.hooverOverStartGame(pos.x, pos.y);
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
     * Checks if the mouse is hoovering over the text "HIGH SCORES".
     *
     * @param  {Integer} ax - the position in x led for the mouse on canvas.
     * @param  {Integer} ay - the position in y led for the mouse on canvas.
     *
     * @return {Void}
     */
    hooverOverStartGame: function(ax, ay) {
        if (isIntersect(ax, ay, 1, 1, 403, 560, 125, 20)) {
            this.isHoverOverStart = true;
        } else {
            this.isHoverOverStart = false;
        }
    },

    /**
     * Checks if the mouse is hoovering over the text "NEW GAME".
     *
     * @param  {Integer} ax - the position in x led for the mouse on canvas.
     * @param  {Integer} ay - the position in y led for the mouse on canvas.
     *
     * @return {Void}
     */
    hooverOverHighScore: function(ax, ay) {
        if (isIntersect(ax, ay, 1, 1, 390, 602, 160, 20)) {
            this.isHooverOverHighScore = true;
        } else {
            this.isHooverOverHighScore = false;
        }
    }
};
