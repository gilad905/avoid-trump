(function(that) {
    AT.win = function() {
        AT.keys.enter.onDown.add(nextLevel);
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
            game.height - 100, -1, -1,
            'NEXT LEVEL', {
                fill: 'white',
            }, null,
            nextLevel
        );
    }

    function nextLevel() {
        var levelNum = ((AT.level + 1) % AT.LEVEL_COUNT);
        game.state.start('sPlay', true, false, {
            level: levelNum,
        });
    }
})(this);
