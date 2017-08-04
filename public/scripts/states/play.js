AT.SPEED = 200;
AT._timer = null;

PlayState.init = function(args) {
    // this.keys.up.onDown.add(function() {
    //     this.hero.move(this._DIR.UP);
    // }, this);

    AT.level = 0;
    AT.counter = 0;
    AT.timer = this.game.time.create(false);

    AT.refreshCounter();

    this.game.input.keyboard.onDownCallback = AT.onKeyDown;
};

PlayState.create = function() {
    AT.graphics = this.game.add.graphics();

    // const VOLUME = 0.2;
    // this.sfx = {
    //     jump: this.game.add.audio('sfx:jump', VOLUME),
    // };

    // this.game.add.image(0, 0, 'background');

    var data = this.game.cache.getJSON(`level:${AT.level}`);
    AT.loadLevel(data);
    AT.startScenes(data.scenes);

    // if (!this.music)
    //     this.music = this.game.add.audio('music');
    // this.music.loopFull();

    // Session variables

    // this.createUI();

    // this.game.input.enabled = true;
};

PlayState.update = function() {
    AT.handleCollisions();
    AT.handleInput();
};

AT.startScenes = function(data) {
    this.scenes = data;
    this.sceneNumber = -1;
    this.nextScene();
};

AT.nextScene = function() {
    this.sceneNumber++;
    var scene = this.scenes[this.sceneNumber];
    if (this.scene && this.scene.obj)
        this.scene.obj.destroy();
    if (scene) {
        if (scene.isAvoidTask) {
            scene.obj = new AvoidTask(scene);
            scene.obj.onFinished(this.nextScene, null, this);
            scene.obj.start();
        } else {
            this.timer.stop();
            this.timer.add(scene.dur * 1000, this.nextScene, this);
            this.timer.start();
        }
    }
    this.scene = scene;
};

AT.createUI = function() {};

AT.refreshCounter = function() {
    PlayState.game.debug.text(this.counter, 100, 200, 'white', '50px Courier');
};
