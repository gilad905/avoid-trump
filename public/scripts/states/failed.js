(function(that) {
    AT.failed = function() {
        game.input.keyboard.enabled = false;
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
            function() {
                game.state.start('sPlay', true, false, {
                    level: AT.level,
                });
            });
    }
})(this);
