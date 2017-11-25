(function() {
    var style = {
        font: AT.Meta.FontStyle,
        fill: "white",
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
        AT.graphics = Game.add.graphics();

        var text =
            "You have won the game...\n" +
            "That means you must be the most amazing person that have ever lived.";

        Game.add.text(100, 100, text, style);

        AT.AddTextButton(
            Game.width - 250,
            Game.height - 100, -1, -1,
            'RESTART GAME',
            null,
            null,
            restartGame
        );
    };

    function restartGame() {
        sChapter.StartChapter(1);
    }
})();
