(function() {
    var style = {
        font: AT.Meta.Styles.OpenText.FontStyle,
        fill: "yellow",
        stroke: "black",
        strokeThickness: 4,
        boundsAlignH: "center",
        boundsAlignV: "middle",
        wordWrap: true,
        wordWrapWidth: 600,
    };

    sWinGame.proto.init = function(args) {
        AT.InitInput();
        AT.Keys.enter.onDown.add(restartGame);
    };

    sWinGame.proto.create = function() {
        AT.BG = AT.AddImageLayer('bg_trump_yellow');
        AT.graphics = Game.add.graphics();

        var text =
            "You have won the game...\n" +
            "That means you must be the most amazing person that have ever lived.";

        Game.add.text(100, 100, text, style);

        var restartButton = AT.AddTextButton(
            0,
            0, -1, -1,
            'RESTART GAME',
            null,
            null,
            restartGame
        );

        AT.MoveButtonToCorner(restartButton, 1, 1);

        AT.ShowExitButton();
    };

    function restartGame() {
        sChapter.StartChapter(1);
    }
})();
