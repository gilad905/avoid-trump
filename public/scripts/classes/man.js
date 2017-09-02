function Man(game, data) {
    let X = 7;

    // call Phaser.Sprite constructor
    Phaser.Sprite.call(this, game, data.x, data.y, 'man');
    Phaser.Sprite.call(this, game, data.x, data.y, 'man');
    this.anchor.set(0.5, 0.5);
    game.physics.enable(this);
    // this.body.collideWorldBounds = true;

    if (data.scaleX !== undefined)
        this.scale.x = data.scaleX;

    this.animations.add('stop', [24]);
    this.animations.add('walk', Phaser.ArrayUtils.numberArray(6, 13), 8, true);
    this.animations.add('hand', Phaser.ArrayUtils.numberArray(66, 70), 8, true);
    this.animations.add('dance', Phaser.ArrayUtils.numberArray(87, 91), 8, true);
    this.animations.add('shocked', Phaser.ArrayUtils.numberArray(24, 28), 2);

    this.animations.play('stop');
}

Man.prototype = Object.create(Phaser.Sprite.prototype);
Man.prototype.constructor = Man;
