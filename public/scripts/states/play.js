AT.SPEED = 200;
AT._timer = null;

sPlay.init = function(args) {
    // this.keys.up.onDown.add(function() {
    //     this.man.move(this._DIR.UP);
    // }, this);

    AT.level = 0;
    AT.timer = game.time.create(false);

    game.input.keyboard.enabled = true;

    game.input.mouse.capture = true;
    AT.mouseInput = game.input.activePointer;

    if (AT.debug) {
        console.log(" X  -  Y ");
        game.input.onDown.add(function() {
            console.log(AT.mouseInput.worldX.toFixed() + " - " + AT.mouseInput.worldY.toFixed());
        }, this);
    }
};

sPlay.create = function() {
    AT.graphics = game.add.graphics();

    // const VOLUME = 0.2;
    // this.sfx = {
    //     jump: game.add.audio('sfx:jump', VOLUME),
    // };

    // game.add.image(0, 0, 'background');

    var data = game.cache.getJSON(`level:${AT.level}`);
    AT.loadLevel(data);
    AT.startScenes(data.scenes, {
        onTaskFailed: function() {
            game.state.start('sFailed', false);
        },
        onEnd: function() {
            game.state.start('sWin', false);
        },
        isFake: false,
    });

    // if (!this.music)
    //     this.music = game.add.audio('music');
    // this.music.loopFull();

    // Session variables

    // this.createUI();

    // game.input.enabled = true;
};

sPlay.update = function() {
    AT.handleCollisions();
    AT.handleInput();
};

if (AT.debug) {
    sPlay.render = function() {
        // game.debug.inputInfo(32, 32);
    };
}



AT.createUI = function() {};

AT.showSuccessMessage = function() {
    var style = {
        font: "bold 45px Arial",
        fill: "lightgreen",
    };

    var text = game.add.text(100, 100, "Well done!", style);
    game.time.events.add(1000 * 1, function() {
        text.destroy();
    }, this);
};
