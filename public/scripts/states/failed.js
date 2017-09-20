(function(that) {
    AT.failed = function() {
        if (AT.SubState != 'failed') {
            AT.SubState = 'failed';
            AT.Keys.enter.onDown.add(AT.RestartLevel);
            AT.FadeBackground(.3, .8);
            showMessage();
            if (!AT.Buttons.Restart)
                AT.ShowRestartButton();
        }
    };

    function showMessage() {
        Game.add.text(100, 100, 'Awwww... you failed!', {
            fill: 'red',
        });
    }
})(this);
