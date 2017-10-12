(function() {
    sBoot.proto.init = function(args) {
        if (!AT.DEBUG)
            Game.stage.disableVisibilityChange = true;
        Game.renderer.renderSession.roundPixels = true;

        AT.Keys = Game.input.keyboard.addKeys({
            enter: Phaser.KeyCode.ENTER,
            esc: Phaser.KeyCode.ESC,
            ctrl: Phaser.KeyCode.CONTROL,
        });

        // on-screen buttons
        AT.Buttons = [];

        AT.ChapterCount = Object.keys(AT.Meta.Chapters).length;
    };

    sBoot.proto.create = function() {
        Game.stage.backgroundColor = AT.Meta.BgColor;
        document.body.style.background = AT.Meta.BgColor;

        var loadingText = Game.add.text(Game.width / 2, Game.height / 2, 'Loading...', loadingStyle);
        loadingText.anchor = {
            x: .5,
            y: .5,
        };

        Game.state.start('sLoad', false, false);
    };

    //////////////////////////////////////////////////////////////

    var loadingStyle = {
        fill: "#fff",
        boundsAlignH: "center",
        boundsAlignV: "middle",
        wordWrap: true,
        wordWrapWidth: 600,
    };
})();
