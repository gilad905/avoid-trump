var PlayState = {};
var AT = {};

AT.SPEED = 200;
AT._timer = null;

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
    AT.keys = this.game.input.keyboard.addKeys({
        left: Phaser.KeyCode.LEFT,
        right: Phaser.KeyCode.RIGHT,
        up: Phaser.KeyCode.UP,
        down: Phaser.KeyCode.DOWN,
    });

    // this.keys.up.onDown.add(function() {
    //     this.hero.move(this._DIR.UP);
    // }, this);

    AT.level = 0;
    AT.counter = 0;
    AT.sceneNumber = -1;

    AT.refreshCounter();

    AT.timer = this.game.time.create(false);

    this.game.input.keyboard.onDownCallback = AT.onKeyDown;
};

PlayState.create = function() {
    AT.graphics = this.game.add.graphics();
    // AT.graphics = this.game.add.graphics(this.game.world.centerX, this.game.world.centerY);

    // AT.bmd = this.game.make.bitmapData(this.game.width, this.game.height);
    // AT.bmd.addToWorld();

    // const VOLUME = 0.2;
    // this.sfx = {
    //     jump: this.game.add.audio('sfx:jump', VOLUME),
    // };

    // this.game.add.image(0, 0, 'background');
    this.game.stage.backgroundColor = "#4488AA";

    var data = this.game.cache.getJSON(`level:${AT.level}`);
    AT.loadLevel(data);
    AT.scenes = data.scenes;
    AT.nextScene();

    // if (!this.music)
    //     this.music = this.game.add.audio('music');
    // this.music.loopFull();

    // Session variables

    // this.createUI();

    // this.game.input.enabled = true;
};

AT.nextScene = function() {
    AT.sceneNumber++;
    var scene = this.scenes[this.sceneNumber];
    this.timer.stop();
    if (this.scene && this.scene.obj)
        this.scene.obj.destroy();
    if (scene) {
        if (scene.isAvoidTask) {
            scene.obj = new AvoidTask(scene);
            PlayState.game.add.existing(scene.obj);
        } else {
            this.timer.add(scene.dur * 1000, this.nextScene, this);
            this.timer.start();
        }
    }
    this.scene = scene;
};

PlayState.update = function() {
    AT.handleCollisions();
    AT.handleInput();
};

AT.createUI = function() {};

AT.refreshCounter = function() {
    PlayState.game.debug.text(this.counter, 100, 200, 'white', '50px Courier');
};
