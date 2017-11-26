(function(that) {
    sPlay.win = function(next) {
        if (sPlay.SubState != 'win') {
            sPlay.SubState = 'win';
            AT.Keys.enter.onDown.add(sPlay.NextLevel);
            AT.FadeBackground(.3, .8);
            if (!AT.DEBUG)
                showButton();
            showMessage();

            if (next)
                next();
        }
    };

    var style = {
        font: AT.Meta.Styles.OpenText.FontStyle,
        fill: 'green',
        stroke: "white",
        strokeThickness: 4,
    };

    function showMessage() {
        Game.add.text(100, 100, sPlay.LevelData.winMessage, style);
    }

    function showButton() {
        AT.AddTextButton(
            Game.width - 250,
            Game.height - 100, -1, -1,
            'NEXT LEVEL', null, null,
            sPlay.NextLevel
        );
    }
})(this);
