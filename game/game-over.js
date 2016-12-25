/**
 * The game over handler in the game.
 *
 * Writes the text "GAME OVER" and "ENTER YOUR NAME", "YOUR SCORE IS" with a blinking
 * cursor on the screen.
 *
 * The player could choose to fill in a name and click save to add the result
 * to the high score list or just click on continue to go back to the introduction.
 *
 * If the player choose to save the result, the name and score is stored in the
 * high score list in the database.
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
function GameOver(canvas, status) {
    this.canvas                 = canvas;
    this.status                 = status;
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
    this.isHoverOverSave        = false;
    this.isHoverOverContinue    = false;
    this.showCursor             = false;
}

/**
 * The prototype of the game over describing the characteristics.
 *
 * @type {Object}
 */
GameOver.prototype = {
    /**
     * Initates the score and all event listeners.
     *
     * @param  {Integer} score - the score of the game.
     * @return {Void}
     */
    init: function(score) {
        console.log("Calling Game Over init function");
        this.score = score;
        this.name  = [];
        this.canvas.addEventListener("click", this.checkSavePlayer.bind(this), false);
        this.canvas.addEventListener("click", this.checkContinue.bind(this), false);
        this.canvas.addEventListener("mousemove", this.mouseMove.bind(this), false);
        window.addEventListener('keydown', this.addCharacter.bind(this), false);
        this.showKeyDownLog = true;
        this.showKeyUpLog = true;
    },

    /**
     * Draws the text when the game is over. The text is drawn letter by letter
     * with a delay. Shows the name if a player writes the name from a keyboard.
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
            this.subtextIndex = showTextLetterByLetter(ct, this.timer, this.subtextIndex, this.subText, 65, 62, 30);
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
        if (this.isHoverOverSave) {
            ct.fillStyle = "rgb(79, 255, 48)";
            ct.fillText('SAVE', 255, 200);
        } else {
            ct.fillStyle = "#fff";
            ct.fillText('SAVE', 255, 200);
        }

        if (this.isHoverOverContinue) {
            ct.fillStyle = "rgb(79, 255, 48)";
            ct.fillText('CONTINUE', 227, 240);
        } else {
            ct.fillStyle = "#fff";
            ct.fillText('CONTINUE', 227, 240);
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
     * Checks if the text "SAVE" is clicked to save the written name and score
     * to the high score list. The player is then directed to the high score list.
     *
     * @param  {Object} event  - the click event.
     *
     * @return {Void}
     */
    checkSavePlayer: function(event) {
        var pos = this.getMousePos(event);

        if (isIntersect(pos.x, pos.y, 1, 1, 421, 333, 57, 20)) {
            var arrayString = this.name.join();
            var name = arrayString.replace (/,/g, "");
            this.saveResultInList(name, this.score);
            this.removeListeners();
            this.status.setGameStatus("highScore");
        }
    },

    /**
     * Checks if the text "CONTINUE" is clicked to be redirected to the intro.
     * Could be used if the player will not save the result to the high score
     * list.
     *
     * @param  {Object} event  - the click event.
     *
     * @return {Void}
     */
    checkContinue: function(event) {
        var pos = this.getMousePos(event);

        if (isIntersect(pos.x, pos.y, 1, 1, 391, 375, 116, 20)) {
            this.removeListeners();
            this.status.setGameStatus("intro");
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
        this.hoverOverSave(pos.x, pos.y);
        this.hoverOverContinue(pos.x, pos.y);
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
     * Checks if the mouse is hoovering over the text "SAVE".
     *
     * @param  {Integer} ax - the position in x led for the mouse on canvas.
     * @param  {Integer} ay - the position in y led for the mouse on canvas.
     *
     * @return {Void}
     */
    hoverOverSave: function(ax, ay) {
        if (isIntersect(ax, ay, 1, 1, 421, 333, 57, 20)) {
            this.isHoverOverSave = true;
        } else {
            this.isHoverOverSave = false;
        }
    },

    /**
     * Checks if the mouse is hoovering over the text "CONTINUE".
     *
     * @param  {Integer} ax - the position in x led for the mouse on canvas.
     * @param  {Integer} ay - the position in y led for the mouse on canvas.
     *
     * @return {Void}
     */
    hoverOverContinue: function(ax, ay) {
        if (isIntersect(ax, ay, 1, 1, 391, 375, 116, 20)) {
            this.isHoverOverContinue = true;
        } else {
            this.isHoverOverContinue = false;
        }
    },

    /**
     * Adding a character from the keyboard to the name array. If the character
     * is back space (char code 8). The last character is removed from the array.
     *
     * @param {Object} event - the key pressed event.
     *
     * @return {Void}
     */
    addCharacter: function(event) {
        var keyCode = event.keyCode;
        if ((keyCode === 8) || (keyCode === 32) || (keyCode === 46) || (keyCode > 47 && keyCode < 58)
            || (keyCode > 64 && keyCode < 91) || (keyCode > 96 && keyCode < 123) || (keyCode === 134)
            || (keyCode === 143) || (keyCode === 132) || (keyCode === 142) || (keyCode === 148)
            || (keyCode === 153)) {
            if (keyCode === 8 || keyCode === 46) {
                if (this.name.length > 0) {
                    this.name.pop();
                    event.preventDefault();
                }
            } else {
                this.name.push(String.fromCharCode(keyCode));
            }
        }
    },

    /**
     * Sends the name and score, using Ajax and Json, to the server side to be
     * stored in the high score list in the data base.
     *
     * @param  {String} name  - the name of the player.
     * @param  {Integer} score - the score of the player.
     *
     * @return {Void}
     */
    saveResultInList: function(name, score) {

        $.ajax({
            type: 'post',
            url: 'game/highScores.php?action=addResult',
            data: {
                name: name,
                score: score
            },
            dataType: 'json',
            success: function(data) {
                console.log("The result: " + data);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log('Ajax request failed: ' + textStatus + ', ' + errorThrown);
            }
        });
    },

    /**
     * Removes all event listeners created when the file was started (initiated).
     *
     * @return {Void}
     */
    removeListeners: function() {
        window.removeEventListener('keypress', this.addCharacter.bind(this), false);
        this.canvas.addEventListener("mousemove", this.mouseMove.bind(this), false);
        this.canvas.addEventListener("click", this.checkContinue.bind(this), false);
        this.canvas.addEventListener("click", this.checkSavePlayer.bind(this), false);
    }
};
