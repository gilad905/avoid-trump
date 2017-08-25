AT.SPEED = 200;
AT._timer = null;

sPlay.init = function(args) {
    AT.level = args.level;
    AT.timer = game.time.create(false);

    AT.initInput();

    if (AT.DEBUG) {
        console.log(" X  -  Y ");
        game.input.onDown.add(function() {
            console.log(AT.mouseInput.worldX.toFixed() + " - " + AT.mouseInput.worldY.toFixed());
        }, this);
    }
};

sPlay.create = function() {
    AT.graphics = game.add.graphics();

    var data = game.cache.getJSON(`level:${AT.level}`);
    AT.winMessage = data.winMessage;
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
};

sPlay.update = function() {
    AT.handleCollisions();
    AT.handleInput();
};

if (AT.DEBUG) {
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
