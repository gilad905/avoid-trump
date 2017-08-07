(function(that) {
   that.AvoidTask = function(scene) {
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
      this._sceneDurationInverse = 1 / (scene.dur * 1000);

      this._timer = game.time.create(false);
      this._timer.add(scene.dur * 1000, this._fail, this);
   }

   function setStatics() {
      that.AvoidTask.START_RADIAN = game.math.degToRad(-90);
      that.AvoidTask.DELTA_RADIAN = AvoidTask.START_RADIAN - game.math.degToRad(270);
   }

   that.AvoidTask.prototype = Object.create(Phaser.Sprite.prototype);
   that.AvoidTask.prototype.constructor = that.AvoidTask;
   var prototype = that.AvoidTask.prototype;

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

   prototype.finish = function() {
      AT.graphics.clear();
      this._text.destroy();
      this._timer.stop();
      if (this._onFinished)
         this._onFinished.callback.call(this._onFinished.context, this._onFinished.args);
   }

   prototype.update = function() {
      if (this._playing) {
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
      }
   };

   prototype.onFailed = function(callback, args, context) {
      this._onFailed = {
         callback: callback,
         args: args,
         context: context,
      };
   };

   prototype.onFinished = function(callback, args, context) {
      this._onFinished = {
         callback: callback,
         args: args,
         context: context,
      };
   };

   prototype._fail = function() {
      if (this._onFailed)
         this._onFailed.callback.call(this._onFailed.context, this._onFailed.args);
      this.finish();
   };

})(this);
