var LoadState = {};
var PlayState = {};
var IntroState = {};

var AT = {};

window.onload = function() {
    let game = new Phaser.Game(960, 600, Phaser.AUTO, 'game');
    game.state.add('load', LoadState);
    game.state.add('intro', IntroState);
    game.state.add('play', PlayState);

    game.state.start('load');
};

LoadState.init = function(args) {
    this.game.stage.disableVisibilityChange = true;
    this.game.renderer.renderSession.roundPixels = true;
    AT.keys = this.game.input.keyboard.addKeys({
        left: Phaser.KeyCode.LEFT,
        right: Phaser.KeyCode.RIGHT,
        up: Phaser.KeyCode.UP,
        down: Phaser.KeyCode.DOWN,
    });

    AT.sceneNumber = -1;
};

LoadState.preload = function() {
    this.game.load.json('level:0', 'data/level00.json');
    this.game.load.json('intro', 'data/intro.json');

    // this.game.load.image('background', 'images/background.png');

    // this.game.load.audio('sfx:jump', 'audio/jump.wav');

    this.game.load.spritesheet('hero', 'assets/hero.png', 37, 42);
};

LoadState.create = function() {
    // var text = this.game.add.text(this.game.width / 2, this.game.height / 2, 'Loading...', {
    //     font: "bold 24px Arial",
    //     fill: "#fff",
    //     boundsAlignH: "center",
    //     boundsAlignV: "middle",
    //     wordWrap: true,
    //     wordWrapWidth: 600,
    // });
    // text.anchor = {
    //     x: .5,
    //     y: .5
    // };

    this.game.stage.backgroundColor = "#4488AA";

    this.game.state.start('intro');
};
