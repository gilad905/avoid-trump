(function() {
    sPlay.proto.init = function(args) {
        sChapter.InNewLevel = (sPlay.CurLevelNum === undefined || sPlay.CurLevelNum != args.level);
        sPlay.CurLevelNum = args.level;
        sPlay.SubState = null;

        AT.InitInput();
        AT.Keys.esc.onDown.add(AT.GotoIntro);
    };

    sPlay.proto.create = function() {
        loadLevelData();

        AT.BG = addImageLayer(`bg:${sChapter.CurChapterNum}-${sPlay.CurLevelNum}`);
        AT.graphics = Game.add.graphics();
        loadPeople();
        AT.FG = addImageLayer(`fg:${sChapter.CurChapterNum}-${sPlay.CurLevelNum}`);

        sPlay.StartScenes({
            onTaskFailed: sPlay.failed,
            onEnd: sPlay.win,
        });

        if (AT.DEBUG) {
            AT.CreateLevelEditor();
            sPlay.ShowRestartLevelButton();
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

    sPlay.PreviousLevel = function() {
        if (sPlay.CurLevelNum == 1)
            sChapter.PreviousChapter();
        else
            sPlay.StartLevel(sPlay.CurLevelNum - 1);
    };

    sPlay.NextLevel = function() {
        if (sPlay.CurLevelNum == sChapter.LevelCount)
            sChapter.NextChapter();
        else {
            var nextLevelNum = sPlay.CurLevelNum ? sPlay.CurLevelNum + 1 : 1;
            sPlay.StartLevel(nextLevelNum);
        }
    };

    sPlay.RestartLevel = function() {
        sPlay.StartLevel(sPlay.CurLevelNum);
    };

    sPlay.StartLevel = function(levelNum) {
        Game.state.start('sPlay', true, false, {
            level: levelNum,
        });
    };

    sPlay.ShowRestartLevelButton = function() {
        AT.Buttons.RestartLevel = AT.AddTextButton(
            Game.width - 200,
            Game.height - 100, -1, -1,
            'RESTART', null, null,
            sPlay.RestartLevel
        );
    };

    sPlay.HideRestartLevelButton = function() {
        if (AT.Buttons.RestartLevel)
            AT.Buttons.RestartLevel.destroy();
    };

    sPlay.StartScenes = function(options) {
        sPlay.SceneMeta = options;
        sPlay.SceneMeta.number = -1;
        sPlay.timer = Game.time.create(false);

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
        if (AT.LevelEditorData && !sChapter.InNewLevel)
            sPlay.LevelData = JSON.parse(JSON.stringify(AT.LevelEditorData));
        else {
            sPlay.LevelData = Game.cache.getJSON(`level:${sChapter.CurChapterNum}-${sPlay.CurLevelNum}`);
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
