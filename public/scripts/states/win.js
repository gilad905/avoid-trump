(function(that) {
    AT.win = function(next) {
        if (AT.SubState != 'win') {
            AT.SubState = 'win';
            AT.Keys.enter.onDown.add(AT.NextLevel);
            AT.FadeBackground(.3, .8);
            if (!AT.DEBUG)
                showButton();
            showMessage();

            if (next)
                next();
        }
    };

    function showMessage() {
        Game.add.text(100, 100, AT.LevelData.winMessage, {
            fill: 'lightgreen',
        });
    }

    function showButton() {
        AT.AddTextButton(
            Game.width - 200,
            Game.height - 100, -1, -1,
            'NEXT LEVEL', null, null,
            AT.NextLevel
        );
    }
})(this);
