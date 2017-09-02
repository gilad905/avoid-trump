AT.tweenTint = function() {
    let colorBlend = {
        step: 0,
    };

    this.game.add.tween(colorBlend).to({
            step: 100,
        }, duration, Phaser.Easing.Default, false)
        .onUpdateCallback(() => {
            spriteToTween.tint = Phaser.Color.interpolateColor(AT.BG.MAIN_COLOR, AT.BG.DARK_COLOR, 100, colorBlend.step, 1);
        }).start();
};
