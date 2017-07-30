(function(that) {
    that.AvoidTask = function(scene) {
        if (!that.AvoidTask.ACNHOR)
            that.AvoidTask.ACNHOR = {
                y: 100,
                x: PlayState.game.width / 2,
            };
        if (!that.AvoidTask.UP_RADIAN)
            that.AvoidTask.UP_RADIAN = PlayState.game.math.degToRad(270);

        // this._group = PlayState.game.add.group();
        Phaser.Sprite.call(this, PlayState.game);

        this._timer = PlayState.game.time.create(false);
        this._timer.add(scene.dur * 1000, this._onTimedOut, this);
        this._char = scene.char;
        this._style = scene.style;
        this._circleSpeed = -360 / (scene.dur * 1000);
        this._timer.start();
        this._play();
    }

    that.AvoidTask.prototype = Object.create(Phaser.Sprite.prototype);
    that.AvoidTask.prototype.constructor = that.AvoidTask;
    var prototype = that.AvoidTask.prototype;

    that.AvoidTask.ACNHOR = null;
    that.AvoidTask.UP_RADIAN = null;

    prototype.update = function() {
        // if (this._char == 'x')
            // debugger;
        var arcLength = this._timer.duration * this._circleSpeed + 270;
        AT.graphics.clear();
        AT.graphics.lineStyle(8, this._style);
        AT.graphics.arc(
        // this._arc = AT.graphics.arc(
            AvoidTask.ACNHOR.x,
            AvoidTask.ACNHOR.y,
            70,
            AvoidTask.UP_RADIAN,
            PlayState.game.math.degToRad(arcLength),
            false
        );
        // AT.graphics.arc(0, 0, 135, 0, 1.5707963267948966, false);

        // console.log(PlayState.game.math.degToRad(arcLength) + "," + arcLength);
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
        // AT.graphics.clear();
        // this._arc.destroy();
        if (this.text)
            this.text.destroy();

        this._timer.stop();
    }

    prototype._play = function() {
        var style = {
            font: "bold 32px Arial",
            fill: "#fff",
            boundsAlignH: "center",
            boundsAlignV: "middle"
        };
        this.text = PlayState.game.add.text(AvoidTask.ACNHOR.x, AvoidTask.ACNHOR.y, this._char, style);

        // this._circle = new Phaser.Circle(300, 300, 100);
        // PlayState.game.add.tween(this._circle).to({
        //     x: 100,
        //     y: 100,
        //     radius: 1
        // }, 3000, "Sine.easeInOut", true, 0, -1, true);

        // AT.bmd.clear();
        // AT.bmd.circle(this._circle.x, this._circle.y, this._circle.radius);
    };
})(this);
