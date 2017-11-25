(function() {
    const AVOID_TASK_FADE_SPEED = .2;
    var showingSingleScene = false;

    sPlay.proto.init = function(args) {
        sChapter.InNewLevel = (sPlay.CurLevelNum === undefined || sPlay.CurLevelNum != args.level);
        sPlay.CurLevelNum = args.level;
        sPlay.SubState = null;

        AT.InitInput();
        AT.Keys.esc.onDown.add(AT.GotoIntro);
    };

    sPlay.proto.create = function() {
        loadLevelData();

        // Order here is important:
        AT.BG = addImageLayer(`bg:${sChapter.CurChapterNum}-${sPlay.CurLevelNum}`);
        AT.graphics = Game.add.graphics();
        loadPeople();
        AT.FG = addImageLayer(`fg:${sChapter.CurChapterNum}-${sPlay.CurLevelNum}`);

        if (AT.DEBUG) {
            AT.CreateLevelEditor();
            sPlay.ShowRestartLevelButton();
            showNextPrevButtons();
        }

        showingSingleScene = false;
        AT.DeselectScenes();
        sPlay.StartScenes({
            onTaskFailed: sPlay.failed,
            onEnd: sPlay.win,
        });
    };

    sPlay.proto.update = function() {
        AT.PeopleGroup.sort('y', Phaser.Group.SORT_ASCENDING);
    };

    if (AT.DEBUG) {
        sPlay.proto.render = function() {
            Game.debug.text(Game.input.x + " - " + Game.input.y, Game.width - 100, Game.height - 30, "white", "20px");
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
        sPlay.SceneMeta.id = -1;
        sPlay.timer = Game.time.create(false);

        this.NextScene();
    };

    sPlay.NextScene = function() {
        if (showingSingleScene)
            return;
        sPlay.SceneMeta.id++;
        var sceneData = sPlay.LevelData.scenes[sPlay.SceneMeta.id];
        if (sPlay.SceneMeta.obj)
            sPlay.SceneMeta.obj.destroy();
        if (sceneData) {
            if (sceneData.type == "AvoidTask") {
                playAvoidTask(sceneData, sPlay.NextScene, sPlay.SceneMeta.onTaskFailed, true);
            } else if (sceneData.type == "AnimScene") {
                playAnimeScene(sceneData, sPlay.NextScene);
            } else if (sceneData.type == 'Wait') {
                playWaitScene(sceneData.dur, sPlay.NextScene);
            } else if (sceneData.type == 'Win')
                sPlay.SceneMeta.onEnd(sPlay.NextScene);
        } else
            sPlay.SceneMeta.onEnd();
    };

    sPlay.ShowSingleScene = function(levelData, sceneId) {
        showingSingleScene = true;
        sPlay.SubState = null;

        sPlay.SceneMeta.id = sceneId;
        var sceneData = levelData.scenes[sPlay.SceneMeta.id];
        if (sPlay.SceneMeta.obj)
            sPlay.SceneMeta.obj.destroy();

        for (var name in AT.People)
            AT.People[name].visible = false;

        if (sceneData.type == "AvoidTask") {
            playAvoidTask(sceneData);
        } else if (sceneData.type == "AnimScene") {
            var person = AT.People[sceneData.sprite];

            var previousScene = findPreviousScene(levelData, sceneData.sprite);
            person.x = previousScene.x;
            person.y = previousScene.y;

            playAnimeScene(sceneData);

            person.inputEnabled = true;
            person.input.enableDrag();
            // person.events.onDragStart.add(function() {
            //     console.log("drag");
            // }, this);
            person.events.onDragStop.add(AT.PersonDropped, this);
        }
    };

    function playAvoidTask(sceneData, onSuccess, onFailed, fadeBackground) {
        sPlay.SceneMeta.obj = new AvoidTask(sceneData);
        sPlay.SceneMeta.obj.OnSuccess(onSuccess);
        sPlay.SceneMeta.obj.OnFailed(onFailed);
        if (fadeBackground)
            AT.FadeBackground(.7, AVOID_TASK_FADE_SPEED);
        sPlay.SceneMeta.obj.Start();
    }

    function playAnimeScene(sceneData, onFinished) {
        sPlay.SceneMeta.obj = new AnimScene(sceneData);
        sPlay.SceneMeta.obj.OnFinished(onFinished);
        if (sPlay.SubState != 'win')
            AT.FadeBackground(1, AVOID_TASK_FADE_SPEED);
        sPlay.SceneMeta.obj.Start();
    }

    function playWaitScene(dur, onFinished) {
        sPlay.timer.stop();
        sPlay.timer.add(dur * 1000 * AT.GAME_SPEED, onFinished);
        if (sPlay.SubState != 'win')
            AT.FadeBackground(1, AVOID_TASK_FADE_SPEED);
        sPlay.timer.start();
    }

    function findPreviousScene(levelData, spriteName) {
        var previousScene = levelData.people[spriteName];
        for (var iScene = sPlay.SceneMeta.id - 1; iScene >= 0; iScene--) {
            var aScene = levelData.scenes[iScene];
            if (aScene.type == "AnimScene" && aScene.sprite == spriteName) {
                previousScene = levelData.scenes[iScene];
                break;
            }
        }

        return previousScene;
    }

    function recordCanvas() {
        var eGame = document.getElementsByTagName("canvas")[0];
        var recorder = new CanvasRecorder(eGame, {
            disableLogs: true,
        });

        recorder.record();
        setTimeout(function() {
            recorder.stop(function(blob) {
                var saveBlob = (function() {
                    var a = document.createElement("a");
                    document.body.appendChild(a);
                    a.style = "display: none";
                    return function(blob, fileName) {
                        var url = window.URL.createObjectURL(blob);
                        a.href = url;
                        a.download = fileName;
                        a.click();
                        window.URL.revokeObjectURL(url);
                    };
                }());
                saveBlob(blob, "test.webm");
            });
        }, 4000);
    }

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

    const NEXT_PREV_BTN_STYLE = {
        fill: 'brown'
    };

    function showNextPrevButtons() {
        AT.AddTextButton(
            50,
            Game.height - 100, -1, -1,
            'NEXT', NEXT_PREV_BTN_STYLE, null,
            sPlay.NextLevel
        );
        AT.AddTextButton(
            200,
            Game.height - 100, -1, -1,
            'PREVIOUS', NEXT_PREV_BTN_STYLE, null,
            sPlay.PreviousLevel
        );
    };

    function loadPeople() {
        AT.PeopleGroup = Game.add.group();
        AT.People = {};
        for (var key in sPlay.LevelData.people) {
            AT.People[key] = AT.CreatePerson(Game, sPlay.LevelData.people[key], key);
            Game.add.existing(AT.People[key]);
            AT.PeopleGroup.add(AT.People[key]);
        }
    }
})();
