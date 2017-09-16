(function() {
    AT.SPEED = 200;
    AT._timer = null;

    sPlay.init = function(args) {
        AT.IsNewLevel = (AT.LevelNumber === undefined || AT.LevelNumber != args.level);
        AT.LevelNumber = args.level;
        AT.SubState = null;
        AT.timer = Game.time.create(false);

        AT.InitInput();
        AT.Keys.esc.onDown.add(AT.GotoIntro);
    };

    sPlay.create = function() {
        AT.AddBackground();
        AT.AddFader();
        AT.graphics = Game.add.graphics();

        AT.LoadLevelData();

        AT.LoadSprites();
        AT.StartScenes({
            onTaskFailed: AT.failed,
            onEnd: AT.win,
            isFake: false,
        });

        if (AT.DEBUG) {
            AT.CreateLevelEditor();
            AT.ShowRestartButton();
            AT.ShowNextPrevButtons();
        }
    };

    // if (AT.DEBUG) {
    //     sPlay.render = function() {
    //         Game.debug.inputInfo(32, 32);
    //     };
    // }

    AT.AddBackground = function() {
        var bgKey = "bg-" + AT.LevelNumber.toString().padStart(2, '0');
        if (Game.cache.checkImageKey(bgKey))
        Game.add.sprite(0, 0, bgKey);
    };

    AT.LoadLevelData = function() {
        if (AT.LevelEditorData && !AT.IsNewLevel)
        AT.LevelData = JSON.parse(JSON.stringify(AT.LevelEditorData));
        else {
            AT.LevelData = Game.cache.getJSON('level:' + AT.LevelNumber);
            AT.LevelEditorData = JSON.parse(JSON.stringify(AT.LevelData));
        }
    };

    AT.ShowRestartButton = function() {
        AT.Buttons.Restart = AT.AddTextButton(
            Game.width - 200,
            Game.height - 100, -1, -1,
            'RESTART', null, null,
            AT.RestartLevel
        );
    };

    AT.ShowNextPrevButtons = function() {
        AT.AddTextButton(
            50,
            Game.height - 100, -1, -1,
            'NEXT', null, null,
            AT.NextLevel
        );
        AT.AddTextButton(
            200,
            Game.height - 100, -1, -1,
            'PREVIOUS', null, null,
            AT.PreviousLevel
        );
    };

    AT.NextLevel = function() {
        var levelNum = ((AT.LevelNumber + 1) % AT.LEVEL_COUNT);
        Game.state.start('sPlay', true, false, {
            level: levelNum,
        });
    };

    AT.PreviousLevel = function() {
        var levelNum = (AT.LevelNumber == 0 ? AT.LEVEL_COUNT - 1 : AT.LevelNumber - 1);
        Game.state.start('sPlay', true, false, {
            level: levelNum,
        });
    };

    AT.HideRestartButton = function() {
        if (AT.Buttons.Restart) {
            AT.Buttons.Restart.destroy();
            delete AT.Buttons.Restart;
        }
    };

    AT.RestartLevel = function() {
        Game.state.start('sPlay', true, false, {
            level: AT.LevelNumber,
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
                AT.SceneMeta.obj.OnSuccess(AT.NextScene, null, AT);
                AT.SceneMeta.obj.OnFailed(AT.SceneMeta.onTaskFailed, null, AT);
                AT.SceneMeta.obj.Start();
            } else if (sceneData.type == "AnimScene") {
                AT.SceneMeta.obj = new AnimScene(sceneData);
                AT.SceneMeta.obj.OnFinished(AT.NextScene, null, AT);
                AT.SceneMeta.obj.Start();
            } else if (sceneData.type == 'Wait') {
                AT.timer.stop();
                AT.timer.add(sceneData.dur * 1000, AT.NextScene, AT);
                AT.timer.start();
            } else if (sceneData.type == 'Win')
                AT.SceneMeta.onEnd(AT.NextScene);
        } else
            AT.SceneMeta.onEnd();
    };

    AT.LoadSprites = function() {
        AT.woman = new Woman(Game, AT.LevelData.woman);
        Game.add.existing(AT.woman);

        AT.man = new Man(Game, AT.LevelData.man);
        Game.add.existing(AT.man);
    };
})();
