/**
 * The high score handler in the game
 *
 * Shows ten high scores with the name of the owner of the high score.
 */

 /*global Vector */
 /*global isIntersect */

function HighScore(canvas, status) {
    this.canvas = canvas;
    this.status = status;
    this.isHoverOverStart       = false;
    this.highScoreList          = null;
    this.highScoreOffset        = 0;
    this.numItemHighScoreList   = 10;
    this.yPosStart              = 160;
    this.yPosLeftArrow          = 0;
    this.yPosRightArrow         = 0;

    // Mystery ship
    this.position               = new Vector(10, 50);
    this.velocity               = new Vector(2, 2);
    this.width                  = 35;
    this.height                 = 15;
    this.arrowSize              = 20;
    this.img                    = new window.Image();
    this.img.src                = "img/game/mystery_ship.png";
    this.reachedBorder          = false;
    this.direction              = "right";

    // High scores arrows
    this.isHooverOverLeftArrow  = false;
    this.isHooverOverRightArrow = false;
    this.arrowWhiteLeftImg      = new window.Image();
    this.arrowWhiteLeftImg.src  = "img/game/arrow_white_left.png";
    this.arrowWhiteRightImg     = new window.Image();
    this.arrowWhiteRightImg.src = "img/game/arrow_white_right.png";
    this.arrowGreenLeftImg      = new window.Image();
    this.arrowGreenLeftImg.src  = "img/game/arrow_green_left.png";
    this.arrowGreenRightImg     = new window.Image();
    this.arrowGreenRightImg.src = "img/game/arrow_green_right.png";

    // Event listeners. Needed when removing event listner with binded functions.
    this.onMouseClickPlay       = this.checkPlayGame.bind(this);
    this.onMouseClickLeftArrow  = this.checkLeftArrow.bind(this);
    this.onMouseClickRightArrow = this.checkRightArrow.bind(this);
    this.onMouseMove            = this.mouseMove.bind(this);


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
        this.highScoreOffset = 0;
        this.getHighScoreList(this.highScoreOffset, this.numItemHighScoreList + 1);
        this.canvas.addEventListener("click", this.onMouseClickPlay, false);
        this.canvas.addEventListener("click", this.onMouseClickLeftArrow, false);
        this.canvas.addEventListener("click", this.onMouseClickRightArrow, false);
        this.canvas.addEventListener("mousemove", this.onMouseMove, false);
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
        ct.translate(980 / 2, this.yPosStart);

        ct.font = "normal lighter 24px arcade, monospace";
        ct.fillStyle = "rgb(79, 255, 48)";
        ct.fillText('NAME', -200, -50);
        ct.fillText('SCORE', 200, -50);

        ct.fillStyle = "#fff";

        var yPos = 0;

        if (this.highScoreList !== null) {
            var numberOfItems = this.highScoreList.scoreList.length;
            if (numberOfItems > this.numItemHighScoreList) {
                numberOfItems = this.numItemHighScoreList;
            }

            for (var i = 0; i < numberOfItems; i++) {
                ct.fillText((i + this.highScoreOffset + 1) + ".", -280, yPos);
                ct.fillText(this.highScoreList.scoreList[i].name, -200, yPos);
                ct.fillText(this.highScoreList.scoreList[i].score, 200, yPos);
                yPos += 35;
            }
        }

        if (this.highScoreOffset >= this.numItemHighScoreList) {
            this.yPosLeftArrow = yPos - 15;
            if (this.isHooverOverLeftArrow) {
                ct.drawImage(this.arrowGreenLeftImg, -320, this.yPosLeftArrow, this.arrowSize, this.arrowSize);
            } else {
                ct.drawImage(this.arrowWhiteLeftImg, -320, this.yPosLeftArrow, this.arrowSize, this.arrowSize);
            }
        }

        if (this.highScoreList !== null) {
            if (this.highScoreList.scoreList.length == this.numItemHighScoreList + 1) {
                this.yPosRightArrow = yPos - 15;
                if (this.isHooverOverRightArrow) {
                    ct.drawImage(this.arrowGreenRightImg, 280, this.yPosRightArrow, this.arrowSize, this.arrowSize);
                } else {
                    ct.drawImage(this.arrowWhiteRightImg, 280, this.yPosRightArrow, this.arrowSize, this.arrowSize);
                }
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
    getHighScoreList: function(offset, limit) {
        var that = this;

        $.ajax({
            type: 'post',
            url: 'game/highScores.php?action=getHighScoreList',
            data: {
                offset: offset,
                limit: limit
            },
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
     * Checks if the text "PLAY GAME" is clicked to play a new game.
     *
     * @param  {Object} event  - the click event.
     *
     * @return {Void}
     */
    checkLeftArrow: function(event) {
        var pos = this.getMousePos(event);
        var yPos = this.yPosStart + this.yPosLeftArrow;

        if (this.highScoreOffset >= this.numItemHighScoreList) {
            if (isIntersect(pos.x, pos.y, 1, 1, 172, yPos, 20, 20)) {
                this.highScoreOffset -= 10;
                this.getHighScoreList(this.highScoreOffset, this.numItemHighScoreList + 1);
            }
        }
    },

    /**
     * Checks if the text "PLAY GAME" is clicked to play a new game.
     *
     * @param  {Object} event  - the click event.
     *
     * @return {Void}
     */
    checkRightArrow: function(event) {
        var pos = this.getMousePos(event);
        var yPos = this.yPosStart + this.yPosRightArrow;

        if (isIntersect(pos.x, pos.y, 1, 1, 770, yPos, 20, 20)) {
            this.highScoreOffset += 10;
            this.getHighScoreList(this.highScoreOffset, this.numItemHighScoreList + 1);
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
        this.hooverOverLeftArrow(pos.x, pos.y);
        this.hooverOverRightArrow(pos.x, pos.y);
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
     * Checks if the mouse is hoovering over the left arrow below the high score
     * list.
     *
     * @param  {Integer} ax - the position in x led for the mouse on canvas.
     * @param  {Integer} ay - the position in y led for the mouse on canvas.
     *
     * @return {Void}
     */
    hooverOverLeftArrow: function(ax, ay) {
        var yPos = this.yPosStart + this.yPosLeftArrow;
        if (isIntersect(ax, ay, 1, 1, 172, yPos, 20, 20)) {
            this.isHooverOverLeftArrow = true;
        } else {
            this.isHooverOverLeftArrow = false;
        }
    },

    /**
     * Checks if the mouse is hoovering over the right arrow below the high score
     * list.
     *
     * @param  {Integer} ax - the position in x led for the mouse on canvas.
     * @param  {Integer} ay - the position in y led for the mouse on canvas.
     *
     * @return {Void}
     */
    hooverOverRightArrow: function(ax, ay) {
        var yPos = this.yPosStart + this.yPosRightArrow;
        if (isIntersect(ax, ay, 1, 1, 770, yPos, 20, 20)) {
            this.isHooverOverRightArrow = true;
        } else {
            this.isHooverOverRightArrow = false;
        }
    },

    /**
     * Removes all event listeners created when the file was started (initiated).
     *
     * @return {Void}
     */
    removeListeners: function() {
        this.canvas.removeEventListener("mousemove", this.onMouseMove, false);
        this.canvas.removeEventListener("click", this.onMouseClickRightArrow, false);
        this.canvas.removeEventListener("click", this.onMouseClickLeftArrow, false);
        this.canvas.removeEventListener("click", this.onMouseClickPlay, false);
    }
};
