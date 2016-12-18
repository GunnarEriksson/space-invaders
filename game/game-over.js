/**
 * The game over handler in the game.
 *
 * Writes the text "GAME OVER", "YOUR SCORE IS" and the score for the game
 * on the screen.
 *
 * Writes the text "NEW GAME" and "HIGH SCORE" with the possibility to choose
 * one of the alternatives.
 *
 */

/*global isIntersect */
/*global showTextLetterByLetter */

/**
 * The game over constructor.
 *
 * Sets the game over specifications.
 *
 * @param {Object} canvas - the canvas to write the text on.
 */
function GameOver(canvas) {
    this.canvas = canvas;
    canvas.addEventListener("click", this.checkStart.bind(this), false);
    canvas.addEventListener("mousemove", this.mouseMove.bind(this), false);
    this.text               = ["G", "A", "M", "E", " ", "O", "V", "E", "R"];
    this.subText            = ["Y", "O", "U", "R ", " ", "S", "C", "O", "R", "E", " ", "I", "S"];
    this.score                  = 0;
    this.timer                  = 0;
    this.textIndex              = 0;
    this.subtextIndex           = 0;
    this.scoreIndex             = 0;
    this.isHoverOverNewGame     = false;
    this.isHooverOverHighScore  = false;
}

/**
 * The prototype of the game over describing the characteristics.
 *
 * @type {Object}
 */
GameOver.prototype = {
    /**
     * Initates the score.
     *
     * @param  {Integer} score - the score of the game.
     * @return {Void}
     */
    init: function(score) {
        this.score = score;
    },

    /**
     * Draws the text when the game is over. The text is drawn letter by letter
     * with a delay.
     *
     * @param  {Object}  ct - The canvas context.
     * @return {Void}
     */
    draw: function(ct) {
        ct.save();
        ct.translate(980 / 6, 150);
        ct.font = "140px impact";

        ct.font = "normal lighter 48px arcade, monospace";
        ct.fillStyle = "#fff";

        if (this.timer > 50) {
            this.textIndex = showTextLetterByLetter(ct, this.timer, this.textIndex, this.text, 150, 0, 30);
        }

        if (this.timer > 250) {
            this.subtextIndex = showTextLetterByLetter(ct, this.timer, this.subtextIndex, this.subText, 100, 62, 30);
        }

        if (this.timer > 450) {
            ct.fillText(this.score, 230, 130);
        }

        ct.font = "normal lighter 24px arcade, monospace";
        if (this.isHoverOverNewGame) {
            ct.fillStyle = "rgb(79, 255, 48)";
            ct.fillText('NEW GAME', 230, 200);
        } else {
            ct.fillStyle = "#fff";
            ct.fillText('NEW GAME', 230, 200);
        }

        if (this.isHooverOverHighScore) {
            ct.fillStyle = "rgb(79, 255, 48)";
            ct.fillText('HIGH SCORES', 207, 240);
        } else {
            ct.fillStyle = "#fff";
            ct.fillText('HIGH SCORES', 207, 240);
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
     * Checks if the text "NEW GAME" is clicked to start a new game.
     *
     * @param  {Object} event  - the click event.
     *
     * @return {Void}
     */
    checkStart: function(event) {
        var pos = this.getMousePos(event);

        if (isIntersect(pos.x, pos.y, 1, 1, 394, 333, 125, 20)) {
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

        this.hooverOverNewGame(pos.x, pos.y);
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
    hooverOverNewGame: function(ax, ay) {
        if (isIntersect(ax, ay, 1, 1, 394, 333, 125, 20)) {
            this.isHoverOverNewGame = true;
        } else {
            this.isHoverOverNewGame = false;
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
        if (isIntersect(ax, ay, 1, 1, 370, 374, 160, 20)) {
            this.isHooverOverHighScore = true;
        } else {
            this.isHooverOverHighScore = false;
        }
    }
};
