(function(that) {
    that.AnimScene = function(scene) {
        if (!AnimScene._staticsSet) {
            AnimScene._staticsSet = true;
            setStatics();
        }

        this._scene = scene;
        this._timer = game.time.create(false);
    };

    function setStatics() {}

    that.AnimScene.prototype = Object.create(Phaser.Sprite.prototype);
    that.AnimScene.prototype.constructor = that.AnimScene;
    var prototype = that.AnimScene.prototype;

    prototype.startAnimation = function(sprite) {
        var spriteAnim = sprite.animations.getAnimation(this._scene.anim);
        spriteAnim.play(null);
        if (this._scene.locker === false)
            this.finish();
        else
            game.time.events.add(this._scene.dur * 1000, this.finish, this);
    };

    prototype.startTween = function(sprite) {
        // sprite.scale.x = (sprite.x > this._scene.x ? 1 : -1);

        var tween = game.add.tween(sprite);

        tween.to({
            x: this._scene.x,
            y: this._scene.y
        }, this._scene.dur * 1000);

        tween.start();

        // if an animation is playing, its timer will handle scene ending
        if (!this._scene.anim) {
            if (this._scene.locker === false)
                this.finish();
            else
                tween.onComplete.addOnce(this.finish);
        }
    };

    prototype.start = function() {
        var sprite = AT[this._scene.sprite];

        if (this._scene.scaleX !== undefined)
            sprite.scale.x = this._scene.scaleX;

        if (this._scene.anim)
            this.startAnimation(sprite);

        if (this._scene.x)
            this.startTween(sprite);
    }

    prototype.onFinished = function(callback, args, context) {
        this._onFinished = {
            callback: callback,
            args: args,
            context: context,
        };
    };

    prototype.finish = function() {
        if (this._onFinished)
            this._onFinished.callback.call(this._onFinished.context, this._onFinished.args);
    }
})(this);
