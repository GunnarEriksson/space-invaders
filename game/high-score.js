/**
 * The high score handler in the game
 *
 * Shows ten high scores with the name of the owner of the high score.
 */

function HighScore(canvas, status) {
    this.canvas = canvas;
    this.status = status;
    canvas.addEventListener("click", this.checkStart.bind(this), false);
    canvas.addEventListener("mousemove", this.mouseMove.bind(this), false);
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

HighScore.prototype = {
    start: function() {
        this.getHighScoreList();
    },

    draw: function(ct) {
        ct.save();
        ct.translate(this.position.x, this.position.y);
        ct.drawImage(this.img, 0, 0, this.width, this.height);
        ct.restore();


        ct.save();
        ct.translate(980 / 2, 150);

        ct.font = "normal lighter 24px arcade, monospace";
        ct.fillStyle = "rgb(79, 255, 48)";
        ct.fillText('NAME', -200, 0);
        ct.fillText('SCORE', 200, 0);

        ct.fillStyle = "#fff";

        var xPos = 50;

        if (this.obj !== null) {
            for(var i = 0; i < this.highScoreList.scoreList.length; i++) {
                ct.fillText(i+1 + ".", -280, xPos);
                ct.fillText(this.highScoreList.scoreList[i].name, -200, xPos);
                ct.fillText(this.highScoreList.scoreList[i].score, 200, xPos);
                xPos += 35;
            }
        }

        if (this.isHoverOverStart) {
            ct.fillStyle = "rgb(79, 255, 48)";
            ct.fillText('PLAY GAME', -90, 430);
        } else {
            ct.fillStyle = "#fff";
            ct.fillText('PLAY GAME', -90, 430);
        }

        ct.restore();
    },

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

    checkStart: function(event) {
        var pos = this.getMousePos(event);

        if (isIntersect(pos.x, pos.y, 1, 1, 403, 560, 125, 20)) {
            this.status.gameStatus = "game";
        }
    },

    mouseMove: function(event) {
        var pos = this.getMousePos(event);

        this.hooverOverStartGame(pos.x, pos.y);
    },

    getMousePos: function(event) {
        var rect = this.canvas.getBoundingClientRect();

        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    },

    hooverOverStartGame: function(ax, ay) {
        if (isIntersect(ax, ay, 1, 1, 403, 560, 125, 20)) {
            this.isHoverOverStart = true;
        } else {
            this.isHoverOverStart = false;
        }
    },
}
