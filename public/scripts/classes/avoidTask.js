(function(that) {
    that.AvoidTask = function(scene, isFake) {
        if (!scene || !scene.char || !scene.x || !scene.y || !scene.style)
            throw "Avoid task: scene argument(s) missing";

        this._playing = false;

        if (!AvoidTask._staticsSet) {
            AvoidTask._staticsSet = true;
            setStatics();
        }

        Phaser.Sprite.call(this, game);
        game.add.existing(this);

        this._scene = scene;
        this._upChar = scene.char.toUpperCase();
        this._sceneDurationInverse = 1 / (scene.dur * 1000);

        this._timer = game.time.create(false);
        this._timer.add(scene.dur * 1000, this._fail, this);

        this._isFake = isFake;
        if (!isFake)
            this._openKeyListener();
    }

    function setStatics() {
        that.AvoidTask.START_RADIAN = game.math.degToRad(-90);
        that.AvoidTask.DELTA_RADIAN = AvoidTask.START_RADIAN - game.math.degToRad(270);
    }

    that.AvoidTask.prototype = Object.create(Phaser.Sprite.prototype);
    that.AvoidTask.prototype.constructor = that.AvoidTask;
    var prototype = that.AvoidTask.prototype;

    prototype._openKeyListener = function() {
        this._keyListenerExisted = AT.keys[this._upChar];
        if (!this._keyListenerExisted) {
            var key = Phaser.KeyCode[this._upChar];
            AT.keys[this._upChar] = game.input.keyboard.addKey(key);
        }
    }

    prototype._closeKeyListener = function() {
        if (!this._keyListenerExisted) {
            var key = Phaser.KeyCode[this._upChar];
            delete AT.keys[this._upChar];
            game.input.keyboard.removeKey(key);
        }
    }

    prototype.start = function() {
        this._playing = true;
        var style = {
            font: "bold 45px Arial",
            fill: "#fff",
            boundsAlignH: "center",
            boundsAlignV: "middle",
        };
        this._text = game.add.text(this._scene.x, this._scene.y, this._scene.char, style);
        this._text.anchor = {
            x: .5,
            y: .5
        };

        this._timer.start();
    };

    prototype._finish = function(clearGraphics) {
        this._playing = false;
        this._closeKeyListener();
        this._timer.stop();
        if (clearGraphics || clearGraphics === undefined) {
            this._text.destroy();
            AT.graphics.clear();
        }
    }

    prototype.update = function() {
        if (this._playing) {
            if (!this._isFake) {
                if (AT.keys[this._upChar].isDown)
                    this._success();
                else
                    this._drawArc()
            } else
                this._drawArc();
        }
    };

    prototype._drawArc = function() {
        var arcLength = this._timer.duration * this._sceneDurationInverse;
        var arcEnd = AvoidTask.START_RADIAN + AvoidTask.DELTA_RADIAN * arcLength;
        AT.graphics.clear();
        AT.graphics.lineStyle(8, this._scene.style);
        AT.graphics.arc(
            this._scene.x,
            this._scene.y,
            50,
            AvoidTask.START_RADIAN,
            arcEnd,
            false
        );
    };

    prototype.onFailed = function(callback, args, context) {
        this._onFailed = {
            callback: callback,
            args: args,
            context: context,
        };
    };

    prototype.onSuccess = function(callback, args, context) {
        this._onSuccess = {
            callback: callback,
            args: args,
            context: context,
        };
    };

    prototype._fail = function() {
        if (this._onFailed)
            this._onFailed.callback.call(this._onFailed.context, this._onFailed.args);
        this._finish();
    };

    prototype._success = function() {
        if (this._onSuccess)
            this._onSuccess.callback.call(this._onSuccess.context, this._onSuccess.args);
        this._finish();
    };

})(this);
