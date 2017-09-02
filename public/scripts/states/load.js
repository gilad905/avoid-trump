var AT = {};
var Game;

// AT.DEBUG = true;
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
        // Game.input.resetLocked = true;
        if (!AT.DEBUG)
            Game.stage.disableVisibilityChange = true;
        Game.renderer.renderSession.roundPixels = true;

        AT.keys = Game.input.keyboard.addKeys({
            enter: Phaser.KeyCode.ENTER,
            esc: Phaser.KeyCode.ESC,
        });
    };

    sLoad.preload = function() {
        Game.load.json('intro', 'data/intro.json');

        Game.load.json('level:0', 'data/level00.json');
        Game.load.json('level:1', 'data/level01.json');
        AT.LEVEL_COUNT = 2;

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

        Game.stage.backgroundColor = AT.BG.MAIN_COLOR;

        Game.state.start('sIntro');
        // Game.state.start('sPlay', true, false, {
        // level: 1,
        // });
    };

    //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////

    var loadingStyle = {
        font: "bold 24px Arial",
        fill: "#fff",
        boundsAlignH: "center",
        boundsAlignV: "middle",
        wordWrap: true,
        wordWrapWidth: 600,
    };
    AT.BG = {
        MAIN_COLOR: "#4488AA",
        BG_DARK_COLOR: "#4488AA",
    };

    function textButtonDefaults(text, button) {
        text = text || {};
        text.boundsAlignH = text.boundsAlignH || 'center';
        text.boundsAlignV = text.boundsAlignV || 'middle';

        button = button || {};
        button.lineWidth = button.lineWidth || 0;
        button.lineColor = button.lineColor || 0x000000;
        button.lineAlpha = button.lineAlpha || 1;

        return {
            text: text,
            button: button,
        };
    }

    AT.AddFader = function() {
        AT.fader = Game.add.sprite(0, 0, 'black');
        AT.fader.width = Game.width;
        AT.fader.height = Game.height;
        AT.fader.alpha = 0;
    };

    AT.StartScenes = function(data, options) {
        this.scene = {
            list: data,
            onTaskFailed: options.onTaskFailed,
            onEnd: options.onEnd,
            isFake: options.isFake,
            number: -1,
        };
        this.NextScene();
    };

    AT.NextScene = function() {
        this.scene.number++;
        var sceneData = this.scene.list[this.scene.number];
        if (this.scene.data && this.scene.obj)
            this.scene.obj.destroy();
        if (sceneData) {
            if (sceneData.type == "AvoidTask") {
                this.scene.obj = new AvoidTask(sceneData, this.scene.isFake);
                this.scene.obj.OnSuccess(this.NextScene, null, this);
                this.scene.obj.OnFailed(this.scene.onTaskFailed, null, this);
                this.scene.obj.Start();
            } else if (sceneData.type == "AnimScene") {
                this.scene.obj = new AnimScene(sceneData);
                this.scene.obj.OnFinished(this.NextScene, null, this);
                this.scene.obj.Start();
            } else {
                this.timer.stop();
                this.timer.add(sceneData.dur * 1000, this.NextScene, this);
                this.timer.start();
            }
        } else {
            this.scene.onEnd();
        }
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

    AT.FadeBackground = function() {
        Game.add.tween(AT.fader).to({
            alpha: 0.7,
        }, 500, Phaser.Easing.Circular.In, true);
    };

})();
