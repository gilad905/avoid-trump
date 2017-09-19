var AT = {};
var Game;

AT.DEBUG = true;

(function() {
    (function() {
        var states = ['sLoad', 'sPlay', 'sIntro', 'sFailed', 'sWin'];
        for (var i in states)
            this[states[i]] = {};

        window.onload = function() {
            Game = new Phaser.Game(960, 600, Phaser.AUTO, 'game');
            for (var i in states)
                Game.state.add(states[i], this[states[i]]);

            Game.state.start('sLoad');
        };
    })();

    sLoad.init = function(args) {
        if (!AT.DEBUG)
            Game.stage.disableVisibilityChange = true;
        Game.renderer.renderSession.roundPixels = true;

        AT.Keys = Game.input.keyboard.addKeys({
            enter: Phaser.KeyCode.ENTER,
            esc: Phaser.KeyCode.ESC,
        });

        // on-screen buttons
        AT.Buttons = [];
    };

    sLoad.preload = function() {
        Game.load.json('intro', 'data/intro.json');

        LoadLevelsData(3);

        Game.load.image('black', 'assets/black.png');

        Game.load.spritesheet('man', 'assets/trump.png', 272, 334);
        Game.load.spritesheet('woman', 'assets/woman.png', 272, 334);
    };

    sLoad.create = function() {
        var loadingText = Game.add.text(Game.width / 2, Game.height / 2, 'Loading...', loadingStyle);
        loadingText.anchor = {
            x: .5,
            y: .5,
        };

        Game.stage.backgroundColor = AT.BG_COLOR;
        document.getElementsByTagName("body")[0].style.background = AT.BG_COLOR;

        if (AT.DEBUG) {
            Game.state.start('sPlay', true, false, {
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

    AT.BG_COLOR = "#4488AA";

    function textButtonDefaults(text, button) {
        text = text || {};
        text.boundsAlignH = text.boundsAlignH || 'center';
        text.boundsAlignV = text.boundsAlignV || 'middle';
        text.fill = text.fill || 'white';

        button = button || {};
        button.lineWidth = button.lineWidth || 0;
        button.lineColor = button.lineColor || 0x000000;
        button.lineAlpha = button.lineAlpha || 1;

        return {
            text: text,
            button: button,
        };
    }

    function LoadLevelsData(levelCount) {
        if (levelCount) {
            assetFetchers = [];
            AT.LEVEL_COUNT = levelCount;
            for (var i = 0; i < levelCount; i++) {
                var levelPad = i.toString().padStart(2, '0');
                var assetNames = [
                    ['json', `level:${i}`, `data/level${levelPad}.json`],
                    ['image', `${levelPad} bg`, `assets/${levelPad} bg.png`],
                    ['image', `${levelPad} fg`, `assets/${levelPad} fg.png`],
                ];
                for (var j = 0; j < assetNames.length; j++) {
                    (function(assetName) {
                        assetFetchers.push(new Promise(function(resolve) {
                            fileExists(assetName[2]).then(function(exists) {
                                resolve();
                                if (exists)
                                    Game.load[assetName[0]](assetName[1], assetName[2]);
                            })
                        }));
                    })(assetNames[j]);
                }
            }

            Promise.all(assetFetchers).then(function() {
                console.clear();
            });
        }
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

    AT.AddFader = function() {
        AT.fader = Game.add.sprite(0, 0, 'black');
        AT.fader.width = Game.width;
        AT.fader.height = Game.height;
        AT.fader.alpha = 0;
    };

    AT.AddTextButton = function(x, y, width, height, text, textStyle, buttonStyle, onClick) {
        var gButton = Game.add.group();
        gButton.x = x;
        gButton.y = y;

        var styles = textButtonDefaults(textStyle, buttonStyle);

        var text = new Phaser.Text(Game, 0, 0, text, styles.text);
        if (width == -1)
            width = text.width;
        if (height == -1)
            height = text.height;
        text.setTextBounds(0, 0, width, height);

        var button = new Phaser.Button(Game, 0, 0, null, onClick);
        button.width = width;
        button.height = height;

        if (styles.button.backgroundColor)
            AT.graphics.beginFill(styles.button.backgroundColor);
        AT.graphics.lineStyle(styles.button.lineWidth, styles.button.lineColor, styles.button.lineAlpha);
        AT.graphics.drawRect(x, y, width, height);
        AT.graphics.endFill();

        gButton.add(button);
        gButton.add(text);

        return gButton;
    }

    AT.InitInput = function() {
        Game.input.keyboard.enabled = true;
        Game.input.mouse.capture = true;
        AT.mouseInput = Game.input.activePointer;
        // if (AT.DEBUG) {
        //     console.log(" X  -  Y ");
        //     Game.input.onDown.add(function() {
        //         console.log(AT.mouseInput.worldX.toFixed() + " - " + AT.mouseInput.worldY.toFixed());
        //     }, this);
        // }
    };

    AT.GotoIntro = function() {
        Game.state.start('sIntro');
    };

    AT.DrawPoint = function(x, y) {
        Game.debug.geom(new Phaser.Point(x, y), 'rgba(255,255,255,1)');
    };
})();
