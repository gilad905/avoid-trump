(function(that) {
    that.AvoidTask = function(scene) {
        if (!scene)
            throw "Avoid task: scene missing";
        else {
            var paramNames = ['x', 'y', 'dur'];
            paramNames.forEach(function(name) {
                if (!scene[name])
                    throw `Avoid task: scene.${name} missing`;
            });

            this.playing = false;
            this.char = scene.char || randomChar();
            this.upChar = this.char.toUpperCase();
            this.style = scene.style || randomStyle();
            this.scene = scene;
            this.sceneDurationInverse = 1 / (scene.dur * 1000);
            this.failAmount = 0;
            this.timer = Game.time.create(false);
            this.timer.add(scene.dur * 1000, this.fail, this);

            Phaser.Sprite.call(this, Game);
            Game.add.existing(this);

            this.openKeyListener();
        }
    }

    that.AvoidTask.SetStatics = function(game) {
        that.AvoidTask.START_RADIAN = game.math.degToRad(-90);
        that.AvoidTask.DELTA_RADIAN = that.AvoidTask.START_RADIAN - game.math.degToRad(270);
        that.AvoidTask.ALLOWED_FAIL_AMOUNT = 2;

        that.AvoidTask.INPUT_HANDLER = function(ev) {
            if (ev.key == this.char)
                this.success();
            else {
                this.failAmount++;
                if (this.failAmount > AvoidTask.ALLOWED_FAIL_AMOUNT)
                    this.fail();
            }
        };
    };

    that.AvoidTask.prototype = Object.create(Phaser.Sprite.prototype);
    that.AvoidTask.prototype.constructor = that.AvoidTask;
    var prototype = that.AvoidTask.prototype;

    function randomChar() {
        var a = 97;
        var z = 122;
        var charCode = Math.floor(Math.random() * (z - a + 1)) + a;
        return String.fromCharCode(charCode);
    }

    var randomStyles = ['white', 'yellow', 'red', 'green', 'orange', 'black'];

    function randomStyle() {
        var randIdx = Math.floor(Math.random() * randomStyles.length);
        return ColorNameToHex.Convert(randomStyles[randIdx]);
    }

    prototype.openKeyListener = function() {
        Game.input.keyboard.addCallbacks(this, AvoidTask.INPUT_HANDLER);
    };

    prototype.closeKeyListener = function() {
        Game.input.keyboard.onDownCallback = null;
    };

    prototype.update = function() {
        this.drawArc();
    };

    prototype.drawArc = function() {
        var arcLength = this.timer.duration * this.sceneDurationInverse;
        var arcEnd = AvoidTask.START_RADIAN + AvoidTask.DELTA_RADIAN * arcLength;
        AT.graphics.clear();
        AT.graphics.lineStyle(8, this.style);
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
        if (AT.GodMode)
            this.success();
        else {
            this.finish();
            if (this.OnFailed)
                this.OnFailed.callback.call(this.OnFailed.context, this.OnFailed.args);
        }
    };

    prototype.success = function() {
        this.finish();
        if (this.OnSuccess)
            this.OnSuccess.callback.call(this.OnSuccess.context, this.OnSuccess.args);
    };

    prototype.Start = function() {
        this.playing = true;
        var style = {
            font: "bold 45px Arial",
            fill: "#fff",
            boundsAlignH: "center",
            boundsAlignV: "middle",
        };
        this.text = Game.add.text(this.scene.x, this.scene.y, this.char, style);
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
