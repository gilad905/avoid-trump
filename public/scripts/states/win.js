(function(that) {
    AT.win = function() {
        AT.Keys.enter.onDown.add(AT.NextLevel);
        if (!AT.DEBUG)
            showButton();
        showMessage();
        AT.FadeBackground();
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
