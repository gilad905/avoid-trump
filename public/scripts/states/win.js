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
        game.add.text(100, 100, 'Nice! you\'re a goddamn genius!!!', {
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
            function() {
                game.state.start('sPlay', true, false, {
                    level: AT.level,
                });
            });
    }
})(this);
