function Man(Game, data) {
    Phaser.Sprite.call(this, Game, data.x, data.y, 'man');
    // AT.DrawPoint(data.x, data.y);
    this.anchor.set(0.5, 0.5);
    Game.physics.enable(this);
    // this.body.collideWorldBounds = true;

    this.scale.x = data.scaleX || 1;
    this.anchor.x = 0.65;

    this.animations.add('stop', [24]);
    this.animations.add('walk', Phaser.ArrayUtils.numberArray(6, 13), 8, true);
    this.animations.add('hand', Phaser.ArrayUtils.numberArray(66, 70), 3, true);
    this.animations.add('dance', Phaser.ArrayUtils.numberArray(87, 91), 8, true);
    this.animations.add('shocked', Phaser.ArrayUtils.numberArray(24, 28), 2);

    this.animations.play('stop');
}

Man.prototype = Object.create(Phaser.Sprite.prototype);
Man.prototype.constructor = Man;
