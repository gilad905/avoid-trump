(function(that) {
    AT.failed = function() {
        AT.keys.enter.onDown.add(restartLevel);
        AT.FadeBackground();
        showMessage();
        showButton();
    };

    function showMessage() {
        Game.add.text(100, 100, 'Awwww... you failed!', {
            fill: 'red',
        });
    }

    function showButton() {
        AT.AddTextButton(
            Game.width - 200,
            Game.height - 100, -1, -1,
            'RESTART', {
                fill: 'white',
            }, null,
            restartLevel
        );
    }

    function restartLevel() {
        Game.state.start('sPlay', true, false, {
            level: AT.level,
        });
    }
})(this);
