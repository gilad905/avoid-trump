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

        if (AT.LevelEditorData)
            AT.LevelData = JSON.parse(JSON.stringify(AT.LevelEditorData));
        else {
            AT.LevelData = Game.cache.getJSON('level:' + AT.level);
            AT.LevelEditorData = JSON.parse(JSON.stringify(AT.LevelData));
        }

        AT.LoadSprites();
        AT.StartScenes({
            onTaskFailed: AT.failed,
            onEnd: AT.win,
            isFake: false,
        });

        if (AT.DEBUG) {
            AT.CreateLevelEditor();
            AT.ShowRestartButton();
        }
    };

    if (AT.DEBUG) {
        sPlay.render = function() {
            Game.debug.inputInfo(32, 32);
        };
    }

    AT.ShowRestartButton = function() {
        AT.RestartButton = AT.AddTextButton(
            Game.width - 200,
            Game.height - 100, -1, -1,
            'RESTART', {
                fill: 'white',
            }, null,
            AT.RestartLevel
        );
    };

    AT.HideRestartButton = function() {
        AT.RestartButton.destroy();
        delete AT.RestartButton;
    };

    AT.RestartLevel = function() {
        Game.state.start('sPlay', true, false, {
            level: AT.level,
        });
    };

    AT.StartScenes = function(options) {
        AT.SceneMeta = options;
        AT.SceneMeta.number = -1;

        this.NextScene();
    };

    AT.NextScene = function() {
        AT.SceneMeta.number++;
        var sceneData = AT.LevelData.scenes[AT.SceneMeta.number];
        if (AT.SceneMeta.data && AT.SceneMeta.obj)
            AT.SceneMeta.obj.destroy();
        if (sceneData) {
            if (sceneData.type == "AvoidTask") {
                AT.SceneMeta.obj = new AvoidTask(sceneData, AT.SceneMeta.isFake);
                AT.SceneMeta.obj.OnSuccess(this.NextScene, null, this);
                AT.SceneMeta.obj.OnFailed(AT.SceneMeta.onTaskFailed, null, this);
                AT.SceneMeta.obj.Start();
            } else if (sceneData.type == "AnimScene") {
                AT.SceneMeta.obj = new AnimScene(sceneData);
                AT.SceneMeta.obj.OnFinished(this.NextScene, null, this);
                AT.SceneMeta.obj.Start();
            } else {
                this.timer.stop();
                this.timer.add(sceneData.dur * 1000, this.NextScene, this);
                this.timer.start();
            }
        } else {
            AT.SceneMeta.onEnd();
        }
    };

    AT.LoadSprites = function() {
        AT.woman = new Woman(Game, AT.LevelData.woman);
        Game.add.existing(AT.woman);

        AT.man = new Man(Game, AT.LevelData.man);
        Game.add.existing(AT.man);
    };
})();
