(function(that) {
    that.AnimScene = function(scene) {
        this.sceneDur = AT.MultipleBySpeed(scene.dur);
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

    prototype.startTween = function(sprite) {
        var tween = Game.add.tween(sprite);

        tween.to({
            x: this.scene.x,
            y: this.scene.y,
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
        if (this.onFinished && this.onFinished.callback)
            this.onFinished.callback.call(this.onFinished.context, this.onFinished.args);
    };

    prototype.Start = function() {
        var person = AT.People[this.scene.sprite];
        person.visible = true;

        if (this.scene.facing) {
            person.scale.x = this.scene.facing == "Left" ? 1 : -1;
        }

        if (this.scene.anim)
            this.startAnimation(person);

        if (this.scene.x || this.scene.y)
            this.startTween(person);
    };

    prototype.OnFinished = function(callback, args, context) {
        this.onFinished = {
            callback: callback,
            args: args,
            context: context,
        };
    };
})(this);
