(function(that) {
    sWin.init = function() {
        game.input.keyboard.enabled = false;
    };

    sWin.create = function() {
        AT.graphics = game.add.graphics();
        showMessage();
        showButton();
        AT.fadeBackground();
    };

    function showMessage() {
        game.add.text(100, 100, AT.winMessage, {
            fill: 'lightgreen',
        });
    }

    function showButton() {
        AT.addTextButton(
            game.width - 200,
            game.height - 100,
            -1,
            -1,
            'NEXT LEVEL', {
                fill: 'white',
            }, null,
            function() {
                var nextLevel = ((AT.level + 1) % AT.LEVEL_COUNT);
                game.state.start('sPlay', true, false, {
                    level: nextLevel,
                });
            });
    }
})(this);
