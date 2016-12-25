/**
 * The high score handler in the game
 *
 * Shows ten high scores with the name of the owner of the high score.
 */

function HighScore(canvas, status) {
    this.canvas = canvas;
    this.status = status;
    this.isHoverOverStart       = false;

    // Mystery ship
    this.position           = new Vector(10, 50);
    this.velocity           = new Vector(2, 2);
    this.width              = 35;
    this.height             = 15;
    this.img                = new window.Image();
    this.img.src            = "img/game/mystery_ship.png";
    this.reachedBorder      = false;
    this.direction          = "right";
    this.highScoreList      = null;
}

/**
 * The prototype of the high score describing the characteristics of the high
 * score.
 *
 * @type {Object}
 */
HighScore.prototype = {
    /**
     * Gets the first ten high scores on the high score list from the database.
     * Adds the click and mouse move event listeners.
     *
     * @return {Void}
     */
    start: function() {
        this.getHighScoreList();
        canvas.addEventListener("click", this.checkPlayGame.bind(this), false);
        canvas.addEventListener("mousemove", this.mouseMove.bind(this), false);
    },

    /**
     * Draws the high score list on the canvas. The mystery ship is cruising
     * above the high score list.
     *
     * @param  {Object}  ct - The canvas context.
     *
     * @return {void}
     */
    draw: function(ct) {
        ct.save();
        ct.translate(this.position.x, this.position.y);
        ct.drawImage(this.img, 0, 0, this.width, this.height);
        ct.restore();


        ct.save();
        ct.translate(980 / 2, 160);

        ct.font = "normal lighter 24px arcade, monospace";
        ct.fillStyle = "rgb(79, 255, 48)";
        ct.fillText('NAME', -200, -50);
        ct.fillText('SCORE', 200, -50);

        ct.fillStyle = "#fff";

        var yPos = 0;

        if (this.highScoreList !== null) {
            for(var i = 0; i < this.highScoreList.scoreList.length; i++) {
                ct.fillText(i+1 + ".", -280, yPos);
                ct.fillText(this.highScoreList.scoreList[i].name, -200, yPos);
                ct.fillText(this.highScoreList.scoreList[i].score, 200, yPos);
                yPos += 35;
            }
        }

        if (this.isHoverOverStart) {
            ct.fillStyle = "rgb(79, 255, 48)";
            ct.fillText('PLAY GAME', -105, 380);
        } else {
            ct.fillStyle = "#fff";
            ct.fillText('PLAY GAME', -105, 380);
        }

        ct.restore();
    },

    /**
     * Gets the ten first high scores from the database using Ajax and Json.
     * The result from the request is stored in the high score array.
     *
     * @return {Void}
     */
    getHighScoreList: function() {
        var that = this;

        $.ajax({
            type: 'post',
            url: 'game/highScores.php?action=getHighScoreList',
            dataType: 'json',
            success: function(data) {
                that.highScoreList = data;
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log('Ajax request failed: ' + textStatus + ', ' + errorThrown);
            }
        });
    },

    /**
     * Moves the mystery ship to the left with one pixel muliplied with the velocity.
     *
     * @return {void}
     */
    moveLeft: function() {
        this.position.x -= 1 * this.velocity.x;
    },

    /**
     * Moves the mystery ship to the right with one pixel muliplied with the velocity.
     *
     * @return {void}
     */
    moveRight: function() {
        this.position.x += 1 * this.velocity.x;
    },

    /**
     * Updates the move of the myster ship and controls that ship change direction
     * when reaching the left or right border of the game board.
     *
     * @return {Void}
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
     * Sets that the myster ship should be removed when reaching the left or
     * right border on the game board.
     *
     * @return {void}
     */
    stayInArea: function() {
        if (this.position.x < -150) {
            this.direction = "right";
            this.reachedBorder = true;
        }

        if (this.position.x + this.width > 1020) {
            this.direction = "left";
            this.reachedBorder = true;
        }
    },

    /**
     * Checks if the text "PLAY GAME" is clicked to play a new game.
     *
     * @param  {Object} event  - the click event.
     *
     * @return {Void}
     */
    checkPlayGame: function(event) {
        var pos = this.getMousePos(event);

        if (isIntersect(pos.x, pos.y, 1, 1, 387, 524, 127, 20)) {
            this.removeListeners();
            this.status.setGameStatus("game");
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
        if (isIntersect(ax, ay, 1, 1, 387, 524, 127, 20)) {
            this.isHoverOverStart = true;
        } else {
            this.isHoverOverStart = false;
        }
    },

    /**
     * Removes all event listeners created when the file was started (initiated).
     *
     * @return {Void}
     */
    removeListeners: function() {
        canvas.removeEventListener("mousemove", this.mouseMove.bind(this), false);
        canvas.removeEventListener("click", this.checkPlayGame.bind(this), false);
    }
}
