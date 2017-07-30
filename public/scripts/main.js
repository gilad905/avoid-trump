var PlayState = {};

PlayState.SPEED = 200;

window.onload = function() {
    // let game = new Phaser.Game(docoment.window.width, do, Phaser.AUTO, 'game');
    let game = new Phaser.Game(960, 600, Phaser.AUTO, 'game');
    game.state.add('play', PlayState);
    game.state.start('play', true, false, {
        level: 0
    });
};

//===================================

PlayState.preload = function() {
    this.game.load.json('level:0', 'data/level00.json');

    // this.game.load.image('background', 'images/background.png');

    // this.game.load.audio('sfx:jump', 'audio/jump.wav');

    this.game.load.spritesheet('hero', 'assets/hero.png', 37, 42);
};

PlayState.init = function(args) {
    this.game.renderer.renderSession.roundPixels = true;
    this.keys = this.game.input.keyboard.addKeys({
        left: Phaser.KeyCode.LEFT,
        right: Phaser.KeyCode.RIGHT,
        up: Phaser.KeyCode.UP,
        down: Phaser.KeyCode.DOWN,
    });

    // this.keys.up.onDown.add(function() {
    //     this.hero.move(this._DIR.UP);
    // }, this);
    //
    // this.keys.down.onDown.add(function() {
    //     this.hero.move(this._DIR.DOWN);
    // }, this);
    //
    // this.keys.left.onDown.add(function() {
    //     this.hero.move(this._DIR.LEFT);
    // }, this);
    //
    // this.keys.right.onDown.add(function() {
    //     this.hero.move(this._DIR.RIGHT);
    // }, this);

    this.level = 0;
};

PlayState.create = function() {
    // const VOLUME = 0.2;

    // this.sfx = {
    //     jump: this.game.add.audio('sfx:jump', VOLUME),
    // };

    // this.game.add.image(0, 0, 'background');

    var data = this.game.cache.getJSON(`level:${this.level}`);
    this.loadLevel(data);

    // if (!this.music)
    //     this.music = this.game.add.audio('music');
    // this.music.loopFull();

    // Session variables

    // this.createUI();

    // this.game.input.enabled = true;
};

PlayState.createUI = function() {
};

PlayState.update = function() {
    this.handleCollisions();
    this.handleInput();
};
