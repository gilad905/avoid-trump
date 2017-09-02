(function(that) {
    AT.failed = function() {
        AT.keys.enter.onDown.add(restartLevel);
        AT.fadeBackground();
        showMessage();
        showButton();
    };

    function showMessage() {
        game.add.text(100, 100, 'Awwww... you failed!', {
            fill: 'red',
        });
    }

    function showButton() {
        AT.addTextButton(
            game.width - 200,
            game.height - 100, -1, -1,
            'RESTART', {
                fill: 'white',
            }, null,
            restartLevel
        );
    }

    function restartLevel() {
        game.state.start('sPlay', true, false, {
            level: AT.level,
        });
    }
})(this);
