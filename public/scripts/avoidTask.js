(function(that) {
    that.AvoidTask = function(scene) {
        this._timer = PlayState.game.time.create(false);
        this._timer.add(scene.dur * 1000, this._timedOut, this);
        this._char = scene.char;
        this._timer.start();
        this._appear();
    }

    // AvoidTask.prototype = Object.create(Phaser.Sprite.prototype);
    that.AvoidTask.prototype.constructor = that.AvoidTask;
    var prototype = that.AvoidTask.prototype;

    prototype.completed = function() {
        AT.counter++;
        AT.refreshCounter();
        AT.nextScene();
        this._remove();
    };

    prototype._timedOut = function() {
        AT.nextScene();
        this._remove();
    };

    prototype._remove = function() {
        this._timer.stop();
        if (this.text)
            this.text.destroy();
    }

    prototype._appear = function() {
        var style = {
            font: "bold 32px Arial",
            fill: "#fff",
            boundsAlignH: "center",
            boundsAlignV: "middle"
        };

        this.text = PlayState.game.add.text(PlayState.game.width / 2, 100, this._char, style);
    };
})(this);
