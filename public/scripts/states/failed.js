(function(that) {
    sPlay.failed = function() {
        if (sPlay.SubState != 'failed') {
            sPlay.SubState = 'failed';
            AT.Keys.enter.onDown.add(sPlay.RestartLevel);
            AT.FadeBackground(.3, .8);
            showMessage();
            if (!AT.Buttons.Restart)
                sPlay.ShowRestartButton();
        }
    };

    function showMessage() {
        Game.add.text(100, 100, 'Awwww... you failed!', {
            fill: 'red',
        });
    }
})(this);
