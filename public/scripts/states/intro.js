(function(that) {
    var introText =
        "AVOID TRUMP\n" +
        "\n" +
        "Careful! Trump is coming for you!\n" +
        "Avoid shaking Trump's hand by quickly pressing the correct keys.\n" +
        "When you see a key like in the example, you need to press that key before the time ends.\n" +
        "Good luck!\n";

    var style = {
        font: "bold 24px Arial",
        fill: "#fff",
        boundsAlignH: "center",
        boundsAlignV: "middle",
        wordWrap: true,
        wordWrapWidth: 600,
    };

    IntroState.init = function() {
        AT.timer = this.game.time.create(false);    
    };

    IntroState.create = function() {
        AT.graphics = this.game.add.graphics();
        var data = this.game.cache.getJSON('intro');
        AT.loadIntro();
        var taskX = this.game.width - 100;
        var taskY = this.game.height / 2;
        for (var i in data.scenes) {
            data.scenes[i].x = taskX;
            data.scenes[i].y = taskY;
        }
        AT.startScenes(data.scenes);
    }

    AT.loadIntro = function() {
        IntroState.game.add.text(100, 100, introText, style);

        var startButton = IntroState.game.add.group();
        startButton.x = IntroState.game.width - 150;
        startButton.y = IntroState.game.height - 100;

        var text = new Phaser.Text(IntroState.game, 0, 0, 'START', style);
        var button = new Phaser.Button(IntroState.game, 0, 0, null, function() {
            IntroState.game.state.start('play', true, false, {
                level: 0
            });
        });
        button.width = text.width;
        button.height = text.height;

        startButton.add(button);
        startButton.add(text);
    };

})(this);
