(function() {
    sPlay.proto.init = function(args) {
        sPlay.IsNewLevel = (sPlay.LevelNumber === undefined || sPlay.LevelNumber != args.level);
        sPlay.LevelNumber = args.level;
        sPlay.SubState = null;

        AT.InitInput();
        AT.Keys.esc.onDown.add(AT.GotoIntro);
        sPlay.timer = Game.time.create(false);
    };

    sPlay.proto.create = function() {
        loadLevelData();

        var levelPad = sPlay.LevelNumber.toString().padStart(2, '0');
        AT.BG = addImageLayer(`${levelPad} bg`);

        AT.graphics = Game.add.graphics();
        loadPeople();
        AT.FG = addImageLayer(`${levelPad} fg`);

        sPlay.StartScenes({
            onTaskFailed: sPlay.failed,
            onEnd: sPlay.win,
        });

        if (AT.DEBUG) {
            AT.CreateLevelEditor();
            sPlay.ShowRestartButton();
            showNextPrevButtons();
        }
    };

    sPlay.proto.update = function() {
        AT.PeopleGroup.sort('y', Phaser.Group.SORT_ASCENDING);
    };

    if (AT.DEBUG) {
        sPlay.proto.render = function() {
            Game.debug.text(Game.input.x + " - " + Game.input.y, Game.width - 100, Game.height - 30, "black", "20px Arial");
        };
    }

    sPlay.ShowRestartButton = function() {
        AT.Buttons.Restart = AT.AddTextButton(
            Game.width - 200,
            Game.height - 100, -1, -1,
            'RESTART', null, null,
            sPlay.RestartLevel
        );
    };

    sPlay.PreviousLevel = function() {
        var levelNum = (sPlay.LevelNumber == 0 ? sPlay.LEVEL_COUNT - 1 : sPlay.LevelNumber - 1);
        Game.state.start('sPlay', true, false, {
            level: levelNum,
        });
    };

    sPlay.NextLevel = function() {
        var levelNum = ((sPlay.LevelNumber + 1) % sPlay.LEVEL_COUNT);
        Game.state.start('sPlay', true, false, {
            level: levelNum,
        });
    };

    sPlay.RestartLevel = function() {
        Game.state.start('sPlay', true, false, {
            level: sPlay.LevelNumber,
        });
    };

    sPlay.StartScenes = function(options) {
        sPlay.SceneMeta = options;
        sPlay.SceneMeta.number = -1;

        this.NextScene();
    };

    sPlay.NextScene = function() {
        const AVOID_TASK_FADE_SPEED = .2;
        sPlay.SceneMeta.number++;
        var sceneData = sPlay.LevelData.scenes[sPlay.SceneMeta.number];
        if (sPlay.SceneMeta.obj)
            sPlay.SceneMeta.obj.destroy();
        if (sceneData) {
            if (sceneData.type == "AvoidTask") {
                sPlay.SceneMeta.obj = new AvoidTask(sceneData);
                sPlay.SceneMeta.obj.OnSuccess(sPlay.NextScene);
                sPlay.SceneMeta.obj.OnFailed(sPlay.SceneMeta.onTaskFailed);
                AT.FadeBackground(.7, AVOID_TASK_FADE_SPEED);
                sPlay.SceneMeta.obj.Start();
            } else if (sceneData.type == "AnimScene") {
                sPlay.SceneMeta.obj = new AnimScene(sceneData);
                sPlay.SceneMeta.obj.OnFinished(sPlay.NextScene);
                if (sPlay.SubState != 'win')
                    AT.FadeBackground(1, AVOID_TASK_FADE_SPEED);
                sPlay.SceneMeta.obj.Start();
            } else if (sceneData.type == 'Wait') {
                sPlay.timer.stop();
                sPlay.timer.add(sceneData.dur * 1000, sPlay.NextScene);
                if (sPlay.SubState != 'win')
                    AT.FadeBackground(1, AVOID_TASK_FADE_SPEED);
                sPlay.timer.start();
            } else if (sceneData.type == 'Win')
                sPlay.SceneMeta.onEnd(sPlay.NextScene);
        } else
            sPlay.SceneMeta.onEnd();
    };

    function addImageLayer(key) {
        if (Game.cache.checkImageKey(key))
            return Game.add.sprite(0, 0, key);
    };

    function loadLevelData() {
        if (AT.LevelEditorData && !sPlay.IsNewLevel)
            sPlay.LevelData = JSON.parse(JSON.stringify(AT.LevelEditorData));
        else {
            sPlay.LevelData = Game.cache.getJSON('level:' + sPlay.LevelNumber);
            AT.LevelEditorData = JSON.parse(JSON.stringify(sPlay.LevelData));
        }
    };

    function showNextPrevButtons() {
        AT.AddTextButton(
            50,
            Game.height - 100, -1, -1,
            'NEXT', null, null,
            sPlay.NextLevel
        );
        AT.AddTextButton(
            200,
            Game.height - 100, -1, -1,
            'PREVIOUS', null, null,
            sPlay.PreviousLevel
        );
    };

    function loadPeople() {
        AT.PeopleGroup = Game.add.group();
        AT.People = [];
        for (var key in sPlay.LevelData.people) {
            AT.People[key] = AT.CreatePerson(Game, sPlay.LevelData.people[key], key);
            Game.add.existing(AT.People[key]);
            AT.PeopleGroup.add(AT.People[key]);
        }
    }
})();
