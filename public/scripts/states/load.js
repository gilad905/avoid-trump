var AT = {};
var game;

(function() {
    var states = ['sLoad', 'sPlay', 'sIntro', 'sFailed', 'sWin'];
    for (var i in states)
        this[states[i]] = {};

    window.onload = function() {
        game = new Phaser.Game(960, 600, Phaser.AUTO, 'game');
        for (var i in states)
            game.state.add(states[i], this[states[i]]);

        game.state.start('sLoad');
    };
})();

sLoad.init = function(args) {
    game.stage.disableVisibilityChange = true;
    game.renderer.renderSession.roundPixels = true;
    AT.keys = game.input.keyboard.addKeys({
        left: Phaser.KeyCode.LEFT,
        right: Phaser.KeyCode.RIGHT,
        up: Phaser.KeyCode.UP,
        down: Phaser.KeyCode.DOWN,
    });
};

sLoad.preload = function() {
    game.load.json('level:0', 'data/level00.json');
    game.load.json('intro', 'data/intro.json');

    game.load.image('black', 'assets/black.png');

    // game.load.audio('sfx:jump', 'audio/jump.wav');

    game.load.spritesheet('hero', 'assets/hero.png', 36, 42);
};

var loadingStyle = {
    font: "bold 24px Arial",
    fill: "#fff",
    boundsAlignH: "center",
    boundsAlignV: "middle",
    wordWrap: true,
    wordWrapWidth: 600,
};

sLoad.create = function() {
    var text = game.add.text(game.width / 2, game.height / 2, 'Loading...', loadingStyle);
    text.anchor = {
        x: .5,
        y: .5,
    };

    game.stage.backgroundColor = "#4488AA";

    game.state.start('sIntro');
};

AT.startScenes = function(data, options) {
    this.scene = {
        list: data,
        onTaskFailed: options.onTaskFailed,
        onEnd: options.onEnd,
        isFake: options.isFake,
        number: -1,
    };
    this.nextScene();
};

AT.nextScene = function() {
    this.scene.number++;
    var sceneData = this.scene.list[this.scene.number];
    if (this.scene.data && this.scene.obj)
        this.scene.obj.destroy();
    if (sceneData) {
        if (sceneData.type == "AvoidTask") {
            this.scene.obj = new AvoidTask(sceneData, this.scene.isFake);
            this.scene.obj.onSuccess(this.nextScene, null, this);
            this.scene.obj.onFailed(this.scene.onTaskFailed, null, this);
            this.scene.obj.start();
        } else if (sceneData.type == "AnimScene") {
            this.scene.obj = new AnimScene(sceneData);
            this.scene.obj.onFinished(this.nextScene, null, this);
            this.scene.obj.start();
        } else {
            this.timer.stop();
            this.timer.add(sceneData.dur * 1000, this.nextScene, this);
            this.timer.start();
        }
    } else {
        this.scene.onEnd();
    }
};

AT.addTextButton = function(x, y, width, height, text, textStyle, buttonStyle, onClick) {
    var gButton = game.add.group();
    gButton.x = x;
    gButton.y = y;

    var styles = AT.getTextButtonDefaults(textStyle, buttonStyle);

    var text = new Phaser.Text(game, 0, 0, text, styles.text);
    if (width == -1)
        width = text.width;
    if (height == -1)
        height = text.height;
    text.setTextBounds(0, 0, width, height);

    var button = new Phaser.Button(game, 0, 0, null, onClick);
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

AT.getTextButtonDefaults = function(text, button) {
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
