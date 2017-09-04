(function() {
    AT.SPEED = 200;
    AT._timer = null;

    sPlay.init = function(args) {
        AT.level = args.level;
        AT.timer = Game.time.create(false);

        AT.InitInput();
        AT.keys.esc.onDown.add(AT.GotoIntro);
    };

    sPlay.create = function() {
        AT.AddFader();
        AT.graphics = Game.add.graphics();

        var data = Game.cache.getJSON(`level:${AT.level}`);
        AT.winMessage = data.winMessage;
        AT.LoadLevel(data);
        AT.StartScenes(data.scenes, {
            onTaskFailed: AT.failed,
            onEnd: AT.win,
            isFake: false,
        });

        AT.RefreshLevelEditor();
    };

    sPlay.update = function() {
        AT.HandleCollisions();
        AT.HandleInput();
    };

    if (AT.DEBUG) {
        sPlay.render = function() {
            Game.debug.inputInfo(32, 32);
        };
    }
})();
