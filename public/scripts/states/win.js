(function(that) {
    AT.win = function() {
        AT.keys.enter.onDown.add(nextLevel);
        showMessage();
        AT.HideRestartButton();
        showButton();
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
            'NEXT LEVEL', {
                fill: 'white',
            }, null,
            nextLevel
        );
    }

    function nextLevel() {
        var levelNum = ((AT.level + 1) % AT.LEVEL_COUNT);
        Game.state.start('sPlay', true, false, {
            level: levelNum,
        });
    }
})(this);
