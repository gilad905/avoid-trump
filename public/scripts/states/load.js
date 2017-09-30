(function() {
    sLoad.proto.init = function(args) {
        if (!AT.DEBUG)
            Game.stage.disableVisibilityChange = true;
        Game.renderer.renderSession.roundPixels = true;

        AT.Keys = Game.input.keyboard.addKeys({
            enter: Phaser.KeyCode.ENTER,
            esc: Phaser.KeyCode.ESC,
            ctrl: Phaser.KeyCode.CONTROL,
        });

        // on-screen buttons
        AT.Buttons = [];
    };

    sLoad.proto.preload = function() {
        Game.load.json('intro', 'data/intro.json');

        sPlay.LEVEL_COUNT = 3;

        loadLevelsData();

        Game.load.image('black', 'assets/black.png');

        Game.load.spritesheet('trump', 'assets/trump.png', 272, 334);
        Game.load.spritesheet('woman', 'assets/woman.png', 272, 334);
        Game.load.spritesheet('man2', 'assets/man - other color.png', 272, 334);
        Game.load.spritesheet('woman2', 'assets/woman - other color.png', 272, 334);
    };

    sLoad.proto.create = function() {
        var loadingText = Game.add.text(Game.width / 2, Game.height / 2, 'Loading...', loadingStyle);
        loadingText.anchor = {
            x: .5,
            y: .5,
        };

        Game.stage.backgroundColor = AT.Meta.BG_COLOR;
        document.getElementsByTagName("body")[0].style.background = AT.Meta.BG_COLOR;

        if (AT.DEBUG) {
            Game.state.start('sPlay', false, false, {
                level: 0,
            });
        } else
            Game.state.start('sIntro', true, false);
    };

    //////////////////////////////////////////////////////////////

    var loadingStyle = {
        font: "bold 24px Arial",
        fill: "#fff",
        boundsAlignH: "center",
        boundsAlignV: "middle",
        wordWrap: true,
        wordWrapWidth: 600,
    };

    function loadLevelsData(levelCount) {
        Game.load.json('level:0', 'data/level00.json');
        Game.load.json('level:1', 'data/level01.json');
        Game.load.json('level:2', 'data/level02.json');

        Game.load.image('00 bg', 'assets/00 bg.png');
        Game.load.image('01 bg', 'assets/01 bg.png');
        Game.load.image('02 bg', 'assets/02 bg.jpg');

        Game.load.image('01 fg', 'assets/01 fg.png');
    }

    function fileExists(name) {
        return new Promise(function(resolve) {
            var xhr = new XMLHttpRequest();
            xhr.onload = function() {
                resolve(this.status == 200);
            };
            xhr.onerror = function(error) {
                console.error(error);
                resolve(false);
            };

            xhr.open('HEAD', name);
            xhr.send();
        });
    }
})();
