(function(that) {
    that.AvoidTask = function(scene) {
        if (!AvoidTask._staticsSet) {
            AvoidTask._staticsSet = true;
            setStatics();
        }

        // this._group = PlayState.game.add.group();
        Phaser.Sprite.call(this, PlayState.game);

        this._timer = PlayState.game.time.create(false);
        this._sceneDurationInverse = 1 / (scene.dur * 1000);
        this._timer.add(scene.dur * 1000, this._onTimedOut, this);
        this._char = scene.char;
        this._style = scene.style;
        this._timer.start();
        this._display();
    }

    function setStatics() {
        AvoidTask.ANCHOR = {
            y: 100,
            x: PlayState.game.width / 2,
        };
        AvoidTask.START_RADIAN = PlayState.game.math.degToRad(-90);
        AvoidTask.DELTA_RADIAN = AvoidTask.START_RADIAN - PlayState.game.math.degToRad(270);
    }

    that.AvoidTask.prototype = Object.create(Phaser.Sprite.prototype);
    that.AvoidTask.prototype.constructor = that.AvoidTask;
    var prototype = that.AvoidTask.prototype;

    prototype.update = function() {
        var arcLength = this._timer.duration * this._sceneDurationInverse;
        var arcEnd = AvoidTask.START_RADIAN + AvoidTask.DELTA_RADIAN * arcLength;
        AT.graphics.clear();
        AT.graphics.lineStyle(8, this._style);
        AT.graphics.arc(
            AvoidTask.ANCHOR.x,
            AvoidTask.ANCHOR.y,
            50,
            AvoidTask.START_RADIAN,
            arcEnd,
            false
        );
        // console.log(arcLength + "," + PlayState.game.math.degToRad(arcLength));
    };

    prototype.complete = function() {
        AT.counter++;
        AT.refreshCounter();
        this._remove();
        AT.nextScene();
    };

    prototype._onTimedOut = function() {
        this._remove();
        AT.nextScene();
    };

    prototype._remove = function() {
        AT.graphics.clear();
        if (this.text)
            this.text.destroy();

        this._timer.stop();
    }

    prototype._display = function() {
        var style = {
            font: "bold 45px Arial",
            fill: "#fff",
            boundsAlignH: "center",
            boundsAlignV: "middle",
            align: "center",
        };
        this.text = PlayState.game.add.text(AvoidTask.ANCHOR.x, AvoidTask.ANCHOR.y, this._char, style);
        this.text.anchor = {
            x: .5,
            y: .5
        };
    };
})(this);
