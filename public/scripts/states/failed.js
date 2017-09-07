(function(that) {
    AT.failed = function() {
        AT.keys.enter.onDown.add(AT.RestartLevel);
        AT.FadeBackground();
        showMessage();
        if (!AT.RestartButton)
            AT.ShowRestartButton();
    };

    function showMessage() {
        Game.add.text(100, 100, 'Awwww... you failed!', {
            fill: 'red',
        });
    }
})(this);
