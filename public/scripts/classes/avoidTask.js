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

            this.sceneDur = AT.MultipleBySpeed(scene.dur);

            this.playing = false;
            this.char = scene.char || randomChar();
            this.upChar = this.char.toUpperCase();
            this.style = scene.style || randomStyle();
            this.scene = scene;
            this.sceneDurationInverse = 1 / (this.sceneDur * 1000);
            this.failAmount = 0;
            this.timer = Game.time.create(false);
            this.timer.add(this.sceneDur * 1000, this.fail, this);

            Phaser.Sprite.call(this, Game);
            Game.add.existing(this);

            this.openKeyListener();
        }
    }

    that.AvoidTask.SetStatics = function(game) {
        that.AvoidTask.START_RADIAN = game.math.degToRad(-90);
        that.AvoidTask.DELTA_RADIAN = that.AvoidTask.START_RADIAN - game.math.degToRad(270);
        that.AvoidTask.ALLOWED_FAIL_AMOUNT = 2;
        that.AvoidTask.FAIL_FADE_DELTA = 1 / (that.AvoidTask.ALLOWED_FAIL_AMOUNT + 1);

        that.AvoidTask.INPUT_HANDLER = function(ev) {
            if (ev.key == this.char)
                this.success();
            else {
                this.failAmount++;
                this.fadeTo(this.alpha - AvoidTask.FAIL_FADE_DELTA);
                if (this.failAmount > AvoidTask.ALLOWED_FAIL_AMOUNT)
                    this.fail();
            }
        };
    };

    that.AvoidTask.prototype = Object.create(Phaser.Sprite.prototype);
    that.AvoidTask.prototype.constructor = that.AvoidTask;
    var prototype = that.AvoidTask.prototype;

    const RANDOM_COLORS = ['gray', 'brown', 'purple', 'red', 'green', 'orange', 'black'];
    const TEXT_STYLE = {
        font: AT.Meta.Styles.AvoidTask.FontStyle,
        fill: "#fff",
        boundsAlignH: "center",
        boundsAlignV: "middle",
    };

    prototype.fadeTo = function(alpha) {
        this.alpha = alpha;
        this.text.alpha = alpha;
    };

    prototype.fadeIn = function() {
        var fadeAlpha = Game.add.tween(this).to({
            alpha: 1,
        }, 100, Phaser.Easing.Linear.None);
        var fadeTextAlpha = Game.add.tween(this.text).to({
            alpha: 1,
        }, 100, Phaser.Easing.Linear.None);
        fadeAlpha.start();
        fadeTextAlpha.start();
    }

    function randomChar() {
        var a = 97;
        var z = 122;
        var charCode = Math.floor(Math.random() * (z - a + 1)) + a;
        return String.fromCharCode(charCode);
    }

    function randomStyle() {
        var randIdx = Math.floor(Math.random() * RANDOM_COLORS.length);
        return ColorNameToHex.Convert(RANDOM_COLORS[randIdx]);
    }

    prototype.openKeyListener = function() {
        Game.input.keyboard.addCallbacks(this, AvoidTask.INPUT_HANDLER);
    };

    prototype.closeKeyListener = function() {
        Game.input.keyboard.onDownCallback = null;
    };

    prototype.update = function() {
        if (!this.stopDrawingArc)
            this.drawArc();
    };

    const SHADOW_DIST = 5;

    prototype.drawArc = function() {
        var arcLength = this.timer.duration * this.sceneDurationInverse;
        var arcEnd = AvoidTask.START_RADIAN + AvoidTask.DELTA_RADIAN * arcLength;
        AT.graphics.clear();
        // shadow first:
        AT.graphics.lineStyle(8, 1, this.alpha / 2);
        AT.graphics.arc(
            this.scene.x + SHADOW_DIST,
            this.scene.y + SHADOW_DIST,
            50,
            AvoidTask.START_RADIAN,
            arcEnd,
            false
        );
        AT.graphics.lineStyle(8, this.style, this.alpha);
        AT.graphics.arc(
            this.scene.x,
            this.scene.y,
            50,
            AvoidTask.START_RADIAN,
            arcEnd,
            false
        );
    };

    prototype.clearGraphics = function(that) {
        that.text.destroy();
        AT.graphics.clear();
    };

    prototype.finish = function(next, toClearGraphics) {
        this.playing = false;
        this.closeKeyListener();
        this.timer.stop();
        if (toClearGraphics || toClearGraphics === undefined)
            this.clearGraphics(this);

        if (next && next.callback)
            next.callback.call(next.context, next.args);
    }

    prototype.fail = function() {
        if (AT.GodMode)
            this.success();
        else
            this.finish(this.OnFailed);
    };

    const SUCCESS_COLOR_HEX = 0xffff00; // yellow
    const SUCCESS_COLOR_STR = "#ffff00"; // yellow

    prototype.success = function() {
        this.style = SUCCESS_COLOR_HEX;
        this.text.fill = SUCCESS_COLOR_STR;
        this.drawArc();
        this.finish(this.OnSuccess, false);
        setTimeout(this.clearGraphics, 100, this);
    };

    prototype.Start = function() {
        this.playing = true;
        this.text = Game.add.text(this.scene.x, this.scene.y + 5, this.upChar, TEXT_STYLE);
        this.text.anchor = {
            x: .5,
            y: .5
        };
        this.alpha = 0;
        this.text.alpha = 0;
        this.fadeIn();

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
