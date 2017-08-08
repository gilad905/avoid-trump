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

   prototype.start = function() {
      var sprite = AT[this._scene.sprite];
      if (this._scene.anim) {
         var spriteAnim = sprite.animations.getAnimation(this._scene.anim);
         spriteAnim.play(null, true);
         sPlay.game.time.events.add(this._scene.dur * 1000, this.finish, this);
      }
      if (this._scene.x) {
         var tween = sPlay.game.add.tween(sprite);
         tween.to({
            x: this._scene.x,
            y: this._scene.y
         }, this._scene.dur * 1000);
         // if an animation is playing, its timer will trigger finish()
         if (!this._scene.anim)
            tween.onComplete.addOnce(this.finish);
         tween.start();
      }
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
