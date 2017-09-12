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

    sIntro.init = function() {
        AT.InitInput();
        AT.Keys.enter.onDown.add(startPlay);
        AT.timer = Game.time.create(false);
    };

    sIntro.create = function() {
        AT.graphics = Game.add.graphics();

        var data = Game.cache.getJSON('intro');
        loadIntro();

        var taskX = Game.width - 100;
        var taskY = Game.height / 2;
        for (var i in data.scenes) {
            data.scenes[i].x = taskX;
            data.scenes[i].y = taskY;
        }
        AT.StartScenes(
            data.scenes, {
                onTaskFailed: AT.NextScene,
                onEnd: function() {
                    AT.SceneMeta.number = -1;
                    AT.NextScene();
                },
                isFake: false,
            }
        );
    }

    function loadIntro() {
        Game.add.text(100, 100, introText, style);

        AT.AddTextButton(
            Game.width - 150,
            Game.height - 100, -1, -1,
            'START',
            style,
            null,
            startPlay
        );
    };

    function startPlay() {
        Game.state.start('sPlay', true, false, {
            level: 0,
        });
    }
})(this);
