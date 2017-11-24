(function(that) {
    that.AnimScene = function(scene) {
        this.sceneDur = scene.dur * AT.GAME_SPEED;
        this.scene = scene;
        this.timer = Game.time.create(false);
    };

    that.AnimScene.prototype = Object.create(Phaser.Sprite.prototype);
    that.AnimScene.prototype.constructor = that.AnimScene;
    var prototype = that.AnimScene.prototype;

    prototype.startAnimation = function(sprite) {
        var spriteAnim = sprite.animations.getAnimation(this.scene.anim);
        spriteAnim.play(null);
        if (this.scene.locker === false)
            this.finish();
        else
            Game.time.events.add(this.sceneDur * 1000, this.finish, this);
    };

    function getSceneNewCoords(scene, sprite) {
        function getCoord(name) {
            if (![null, undefined].includes(scene[name])) {
                newCoords[name] =
                    (scene.isGap ? scene[name] + sprite[name] : scene[name]);
            }
        }

        var newCoords = {};
        getCoord('x');
        getCoord('y');

        return newCoords;
    }

    prototype.startTween = function(sprite) {
        var tween = Game.add.tween(sprite);

        var newCoords = getSceneNewCoords(this.scene, sprite);

        tween.to({
            x: newCoords.x,
            y: newCoords.y,
        }, this.sceneDur * 1000);

        tween.start();

        // if an animation is playing, its timer will handle scene ending
        if (!this.scene.anim) {
            if (this.scene.locker === false)
                this.finish();
            else
                tween.onComplete.addOnce(this.finish);
        }
    };

    prototype.finish = function() {
        if (this.onFinished)
            this.onFinished.callback.call(this.onFinished.context, this.onFinished.args);
    };

    prototype.Start = function() {
        var sprite = AT.People[this.scene.sprite];

        if (this.scene.facing) {
            sprite.scale.x = this.scene.facing == "Left" ? 1 : -1;
        }

        if (this.scene.anim)
            this.startAnimation(sprite);

        if (this.scene.x || this.scene.y)
            this.startTween(sprite);
    };

    prototype.OnFinished = function(callback, args, context) {
        this.onFinished = {
            callback: callback,
            args: args,
            context: context,
        };
    };
})(this);
