AT.SPEED = 200;
AT._timer = null;

sPlay.init = function(args) {
   AT.level = 0;
   AT.timer = game.time.create(false);
};

sPlay.create = function() {
   AT.graphics = game.add.graphics();

   var data = game.cache.getJSON(`level:${AT.level}`);
   AT.loadLevel(data);
   AT.startScenes(data.scenes);
};

sPlay.update = function() {
   AT.handleCollisions();
   AT.handleInput();
};

sPlay.render = function() {
    this.game.debug.inputInfo(32, 32);
}
