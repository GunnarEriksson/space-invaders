/*global isIntersect */
/*global showTextLetterByLetter */

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

GameOver.prototype = {
    init: function(score) {
        this.score = score;
    },

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

    update: function() {
        if (this.timer <= 530) {
            this.timer++;
        }
    },

    checkStart: function(event) {
        var pos = this.getMousePos(event);

        if (isIntersect(pos.x, pos.y, 1, 1, 394, 333, 125, 20)) {
            this.status.gameStatus = "game";
        }
    },

    mouseMove: function(event) {
        var pos = this.getMousePos(event);

        this.hooverOverNewGame(pos.x, pos.y);
        this.hooverOverHighScore(pos.x, pos.y);
    },

    getMousePos: function(event) {
        var rect = this.canvas.getBoundingClientRect();

        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    },

    hooverOverNewGame: function(ax, ay) {
        if (isIntersect(ax, ay, 1, 1, 394, 333, 125, 20)) {
            this.isHoverOverNewGame = true;
        } else {
            this.isHoverOverNewGame = false;
        }
    },

    hooverOverHighScore: function(ax, ay) {
        if (isIntersect(ax, ay, 1, 1, 370, 374, 160, 20)) {
            this.isHooverOverHighScore = true;
        } else {
            this.isHooverOverHighScore = false;
        }
    }
};
