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
    this.text                   = ["G", "A", "M", "E", " ", "O", "V", "E", "R"];
    this.subText                = ["E", "N", "T", "E", "R ", " ", "Y", "O", "U", "R", " ", "N", "A", "M", "E"];
    this.name                   = null;
    this.width                  = 2;
    this.height                 = 25;
    this.score                  = 0;
    this.timer                  = 0;
    this.textIndex              = 0;
    this.subtextIndex           = 0;
    this.scoreIndex             = 0;
    this.cursorTimer            = 0;
    this.textDistance           = 25;
    this.isHoverOverNewGame     = false;
    this.isHooverOverHighScore  = false;
    this.showCursor             = false;
    this.flag                   = null;
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
        console.log("Calling Game Over init function");
        this.score = score;
        this.name  = [];
        this.flag = true;
        this.canvas.addEventListener("click", this.checkStart.bind(this), false);
        this.canvas.addEventListener("mousemove", this.mouseMove.bind(this), false);
        this.showKeyDownLog = true;
        this.showKeyUpLog = true;

        this.addingKeyPressListener();
    },

    addingKeyPressListener: function() {
        var that = this;
        window.addEventListener('keypress', function(event) {
            var charCode = event.charCode;
            if ((charCode === 8) ||(charCode === 32) || (charCode > 47 && charCode < 58) || (charCode > 64 && charCode < 91)
                || (charCode > 96 && charCode < 123) || (charCode === 134) || (charCode === 143)
                || (charCode === 132) || (charCode === 142) || (charCode === 148) || (charCode === 153)) {
                if (charCode === 8) {
                    if (that.name.length > 0) {
                        that.name.pop();
                    }
                } else {
                    that.name.push(String.fromCharCode(charCode));
                }

            }
        }, false);
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

        ct.font = "normal lighter 36px arcade, monospace";
        if (this.timer > 170) {
            this.subtextIndex = showTextLetterByLetter(ct, this.timer, this.subtextIndex, this.subText, 80, 62, 30);
        }

        if (this.timer > 320) {
            ct.fillStyle = "rgb(79, 255, 48)";
            var offsetX = 140;
            for (var i = 0; i < this.name.length; i++) {
                ct.fillText(this.name[i], offsetX, 133);
                offsetX += this.textDistance;
            }

            ct.strokeStyle = "rgb(79, 255, 48)";
            if (this.showCursor) {
                ct.fillRect (offsetX, 110, this.width, this.height);
            }
        }

        ct.font = "normal lighter 24px arcade, monospace";
        if (this.isHoverOverNewGame) {
            ct.fillStyle = "rgb(79, 255, 48)";
            ct.fillText('SAVE', 230, 200);
        } else {
            ct.fillStyle = "#fff";
            ct.fillText('SAVE', 230, 200);
        }

        if (this.isHooverOverHighScore) {
            ct.fillStyle = "rgb(79, 255, 48)";
            ct.fillText('CONTINUE', 207, 240);
        } else {
            ct.fillStyle = "#fff";
            ct.fillText('CONTINUE', 207, 240);
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

        this.cursorTimer = (this.cursorTimer + 1) % 60;

        if (this.cursorTimer > 30) {
            this.showCursor = true;
        } else {
            this.showCursor = false;
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
        console.log("Check start called");
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
    },

    addName: function(keyCode) {
        console.log("Add name called with key code: " + keyCode);
        this.name.push(String.fromCharCode(keyCode));
    }
};
