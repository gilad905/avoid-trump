(function() {
    sPlay.init = function(args) {
        AT.IsNewLevel = (AT.LevelNumber === undefined || AT.LevelNumber != args.level);
        AT.LevelNumber = args.level;
        AT.SubState = null;
        AT.timer = Game.time.create(false);

        AT.InitInput();
        AT.Keys.esc.onDown.add(AT.GotoIntro);
    };

    sPlay.create = function() {
        loadLevelData();

        var levelPad = AT.LevelNumber.toString().padStart(2, '0');
        AT.BG = addImageLayer(`${levelPad} bg`);
        // AT.AddFader();

        AT.graphics = Game.add.graphics();
        loadSprites();
        AT.FG = addImageLayer(`${levelPad} fg`);

        AT.StartScenes({
            onTaskFailed: AT.failed,
            onEnd: AT.win,
        });

        if (AT.DEBUG) {
            AT.CreateLevelEditor();
            AT.ShowRestartButton();
            showNextPrevButtons();
        }
    };

    // if (AT.DEBUG) {
    //     sPlay.render = function() {
    //         Game.debug.inputInfo(32, 32);
    //     };
    // }

    AT.FadeBackground = function(amount, duration) {
        duration *= 1000;

        var toColor = 0;
        for (var i = 0; i < 3; i++)
            toColor = (toColor << 8) + (amount * 0xFF);

        var toFade = [AT.BG, AT.FG];
        for (var i in toFade) {
            if (toFade[i]) {
                tweenTint(toFade[i], toColor, duration, Phaser.Easing.Circular.In);
                // Game.add.tween(toFade[i]).to({
                //     tint: amount,
                // }, duration, Phaser.Easing.Circular.In, true);
            }
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
        const AVOID_TASK_FADE_SPEED = .2;
        AT.SceneMeta.number++;
        var sceneData = AT.LevelData.scenes[AT.SceneMeta.number];
        if (AT.SceneMeta.obj)
            AT.SceneMeta.obj.destroy();
        if (sceneData) {
            if (sceneData.type == "AvoidTask") {
                AT.SceneMeta.obj = new AvoidTask(sceneData);
                AT.SceneMeta.obj.OnSuccess(AT.NextScene, null, AT);
                AT.SceneMeta.obj.OnFailed(AT.SceneMeta.onTaskFailed, null, AT);
                AT.FadeBackground(.7, AVOID_TASK_FADE_SPEED);
                AT.SceneMeta.obj.Start();
            } else if (sceneData.type == "AnimScene") {
                AT.SceneMeta.obj = new AnimScene(sceneData);
                AT.SceneMeta.obj.OnFinished(AT.NextScene, null, AT);
                if (AT.SubState != 'win')
                    AT.FadeBackground(1, AVOID_TASK_FADE_SPEED);
                AT.SceneMeta.obj.Start();
            } else if (sceneData.type == 'Wait') {
                AT.timer.stop();
                AT.timer.add(sceneData.dur * 1000, AT.NextScene, AT);
                if (AT.SubState != 'win')
                    AT.FadeBackground(1, AVOID_TASK_FADE_SPEED);
                AT.timer.start();
            } else if (sceneData.type == 'Win')
                AT.SceneMeta.onEnd(AT.NextScene);
        } else
            AT.SceneMeta.onEnd();
    };

    function addImageLayer(key) {
        if (Game.cache.checkImageKey(key))
            return Game.add.sprite(0, 0, key);
    };

    function tweenTint(obj, endColor, time, easing, delay, callback) {
        if (obj) {
            let colorBlend = {
                step: 0
            };

            let colorTween = Game.add.tween(colorBlend).to({
                step: 100
            }, time, easing || Phaser.Easing.Linear.None, delay);

            colorTween.onUpdateCallback(() => {
                obj.tint = Phaser.Color.interpolateColor(obj.tint, endColor, 100, colorBlend.step);
            });

            if (callback)
                colorTween.onComplete.add(callback, this);

            colorTween.start();
        }
    }

    function loadLevelData() {
        if (AT.LevelEditorData && !AT.IsNewLevel)
            AT.LevelData = JSON.parse(JSON.stringify(AT.LevelEditorData));
        else {
            AT.LevelData = Game.cache.getJSON('level:' + AT.LevelNumber);
            AT.LevelEditorData = JSON.parse(JSON.stringify(AT.LevelData));
        }
    };

    function showNextPrevButtons() {
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

    function loadSprites() {
        AT.woman = new Woman(Game, AT.LevelData.woman);
        Game.add.existing(AT.woman);

        AT.man = new Man(Game, AT.LevelData.man);
        Game.add.existing(AT.man);
    };
})();
