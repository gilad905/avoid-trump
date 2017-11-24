var AT = {};
var Game;

// AT.DEBUG = false;
AT.DEBUG = true;
AT.GAME_SPEED = 1;

(function() {
    var states = ['sBoot', 'sLoad', 'sIntro', 'sChapter', 'sPlay', 'sWinGame'];
    for (var i in states) {
        this[states[i]] = {
            proto: {},
        };
    }

    window.onload = function() {
        Game = new Phaser.Game(960, 600, Phaser.AUTO, 'game');
        for (var i in states)
            Game.state.add(states[i], this[states[i]].proto);

        Game.state.start('sBoot');
    };

    AT.SetGameFrozen = function(isFrozen) {
        Game.paused = isFrozen;
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
    };

    AT.GotoIntro = function() {
        Game.state.start('sIntro');
    };

    AT.DrawPoint = function(x, y) {
        Game.debug.geom(new Phaser.Point(x, y), 'rgba(255,255,255,1)');
    };

    AT.FadeBackground = function(amount, duration) {
        duration *= 1000;

        var toColor = 0;
        for (var i = 0; i < 3; i++)
            toColor = (toColor << 8) + (amount * 0xFF);

        var toFade = [AT.BG, AT.FG];
        for (var i in toFade) {
            if (toFade[i]) {
                tweenTint(toFade[i], toColor, duration, Phaser.Easing.Circular.In);
                // Game.add.tween(toFade[i]).to({
                //     tint: amount,
                // }, duration, Phaser.Easing.Circular.In, true);
            }
        }
    };

    AT.PaddedNum = function(num) {
        return num.toString().padStart(2, '0');
    };

    function tweenTint(obj, endColor, time, easing, delay, callback) {
        if (obj) {
            let colorBlend = {
                step: 0
            };

            let colorTween = Game.add.tween(colorBlend).to({
                step: 100
            }, time, easing || Phaser.Easing.Linear.None, delay);

            colorTween.onUpdateCallback(() => {
                obj.tint = Phaser.Color.interpolateColor(obj.tint, endColor, 100, colorBlend.step);
            });

            if (callback)
                colorTween.onComplete.add(callback, this);

            colorTween.start();
        }
    }

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


})();
