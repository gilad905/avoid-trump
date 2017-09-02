(function() {
    AT.SPEED = 200;
    AT._timer = null;

    sPlay.init = function(args) {
        AT.level = args.level;
        AT.timer = game.time.create(false);

        AT.initInput();
        AT.keys.esc.onDown.add(AT.gotoIntro);
    };

    sPlay.create = function() {
        AT.addFader();
        AT.graphics = game.add.graphics();

        var data = game.cache.getJSON(`level:${AT.level}`);
        AT.winMessage = data.winMessage;
        AT.loadLevel(data);
        AT.startScenes(data.scenes, {
            onTaskFailed: AT.failed,
            onEnd: AT.win,
            isFake: false,
        });
    };

    sPlay.update = function() {
        AT.handleCollisions();
        AT.handleInput();
    };

    if (AT.DEBUG) {
        sPlay.render = function() {
            game.debug.inputInfo(32, 32);
        };
    }
})();
