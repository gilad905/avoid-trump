(function(that) {
    that.AvoidTask = function(scene, isFake) {
        if (!scene || !scene.char || !scene.x || !scene.y || !scene.style)
            throw "Avoid task: scene argument(s) missing";

        this.playing = false;

        if (!AvoidTask.staticsSet) {
            AvoidTask.staticsSet = true;
            setStatics();
        }

        Phaser.Sprite.call(this, Game);
        Game.add.existing(this);

        this.scene = scene;
        this.upChar = scene.char.toUpperCase();
        this.sceneDurationInverse = 1 / (scene.dur * 1000);

        this.timer = Game.time.create(false);
        this.timer.add(scene.dur * 1000, this.fail, this);

        this.isFake = isFake;
        if (!isFake)
            this.openKeyListener();
    }

    function setStatics() {
        that.AvoidTask.START_RADIAN = Game.math.degToRad(-90);
        that.AvoidTask.DELTA_RADIAN = AvoidTask.START_RADIAN - Game.math.degToRad(270);
    }

    that.AvoidTask.prototype = Object.create(Phaser.Sprite.prototype);
    that.AvoidTask.prototype.constructor = that.AvoidTask;
    var prototype = that.AvoidTask.prototype;

    prototype.openKeyListener = function() {
        this.keyListenerExisted = (AT.keys[this.upChar] !== undefined);
        if (!this.keyListenerExisted) {
            var key = Phaser.KeyCode[this.upChar];
            AT.keys[this.upChar] = Game.input.keyboard.addKey(key);
        }
    }

    prototype.closeKeyListener = function() {
        if (!this.keyListenerExisted) {
            var key = Phaser.KeyCode[this.upChar];
            delete AT.keys[this.upChar];
            Game.input.keyboard.removeKey(key);
        }
    }

    prototype.update = function() {
        if (this.playing) {
            if (!this.isFake) {
                if (AT.keys[this.upChar].isDown)
                    this.success();
                else
                    this.drawArc()
            } else
                this.drawArc();
        }
    };

    prototype.drawArc = function() {
        var arcLength = this.timer.duration * this.sceneDurationInverse;
        var arcEnd = AvoidTask.START_RADIAN + AvoidTask.DELTA_RADIAN * arcLength;
        AT.graphics.clear();
        AT.graphics.lineStyle(8, this.scene.style);
        AT.graphics.arc(
            this.scene.x,
            this.scene.y,
            50,
            AvoidTask.START_RADIAN,
            arcEnd,
            false
        );
    };

    prototype.finish = function(clearGraphics) {
        this.playing = false;
        this.closeKeyListener();
        this.timer.stop();
        if (clearGraphics || clearGraphics === undefined) {
            this.text.destroy();
            AT.graphics.clear();
        }
    }

    prototype.fail = function() {
        if (this.OnFailed)
            this.OnFailed.callback.call(this.OnFailed.context, this.OnFailed.args);
        this.finish();
    };

    prototype.success = function() {
        if (this.OnSuccess)
            this.OnSuccess.callback.call(this.OnSuccess.context, this.OnSuccess.args);
        this.finish();
    };

    prototype.Start = function() {
        this.playing = true;
        var style = {
            font: "bold 45px Arial",
            fill: "#fff",
            boundsAlignH: "center",
            boundsAlignV: "middle",
        };
        this.text = Game.add.text(this.scene.x, this.scene.y, this.scene.char, style);
        this.text.anchor = {
            x: .5,
            y: .5
        };

        this.timer.start();
    };

    prototype.OnFailed = function(callback, args, context) {
        this.OnFailed = {
            callback: callback,
            args: args,
            context: context,
        };
    };

    prototype.OnSuccess = function(callback, args, context) {
        this.OnSuccess = {
            callback: callback,
            args: args,
            context: context,
        };
    };

})(this);
