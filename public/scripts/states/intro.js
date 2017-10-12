(function(that) {
    var introText =
        "AVOID TRUMP\n" +
        "\n" +
        "Careful! Trump is coming for you!\n" +
        "Avoid shaking Trump's hand by quickly pressing the correct keys.\n" +
        "When you see a key like in the example ------------->\n" +
        "you need to press that key before the time runs out.\n" +
        "Good luck!\n";

    var style = {
        font: "bold 24px Arial",
        fill: "white",
        boundsAlignH: "center",
        boundsAlignV: "middle",
        wordWrap: true,
        wordWrapWidth: 600,
    };

    sIntro.proto.init = function() {
        AT.InitInput();
        AT.Keys.enter.onDown.add(sChapter.NextChapter);
    };

    sIntro.proto.create = function() {
        AT.graphics = Game.add.graphics();

        var data = Game.cache.getJSON('intro');
        startAvoidTasks(data);
        loadIntroSprites();
    }

    function loadIntroSprites() {
        Game.add.text(100, 100, introText, style);

        AT.AddTextButton(
            Game.width - 150,
            Game.height - 100, -1, -1,
            'START',
            style,
            null,
            sPlay.NextLevel
        );
    };

    function startAvoidTasks(data) {
        var taskX = Game.width - 100;
        var taskY = Game.height / 2;
        for (var i in data.scenes) {
            data.scenes[i].x = taskX;
            data.scenes[i].y = taskY;
        }

        sPlay.LevelData = {
            scenes: data.scenes,
        };

        sPlay.StartScenes({
            onTaskFailed: sPlay.NextScene,
            onEnd: function() {
                sPlay.SceneMeta.number = -1;
                sPlay.NextScene();
            },
        });
    }
})(this);
