(function(that) {
    var introText =
        "AVOID TRUMP\n" +
        "\n" +
        "Careful! Trump is coming for you!\n" +
        "But what does he want? is it HOLDING HANDS? :O\n" +
        "Avoid Trump's hand by quickly pressing the correct character.\n" +
        "You have 3 TRIES to get it right!\n" +
        "\n" +
        "Good luck.";

    var style = {
        font: "bold 28px " + AT.Meta.Styles.OpenText.FontFamily,
        fill: "black",
        stroke: "white",
        strokeThickness: 4,
        boundsAlignH: "center",
        boundsAlignV: "middle",
        wordWrap: true,
        wordWrapWidth: 600,
    };

    function startGame() {
        sChapter.StartChapter(1);
    }

    sIntro.proto.init = function() {
        AT.InitInput();
        AT.Keys.enter.onDown.add(startGame);
    };

    sIntro.proto.create = function() {
        AT.BG = AT.AddImageLayer('bg_trump_black');
        AT.graphics = Game.add.graphics();

        var data = Game.cache.getJSON('intro');
        startAvoidTasks(data);
        loadIntroSprites();
    }

    function loadIntroSprites() {
        Game.add.text(100, 100, introText, style);

        var startButton = AT.AddTextButton(
            0,
            0, -1, -1,
            'START',
            null,
            null,
            startGame,
        );
        AT.MoveButtonToCorner(startButton, 1, 1);
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
                sPlay.SceneMeta.id = -1;
                sPlay.NextScene();
            },
        });
    }
})(this);
