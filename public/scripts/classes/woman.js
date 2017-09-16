function Woman(Game, data) {
    Phaser.Sprite.call(this, Game, data.x, data.y, 'woman');
    // AT.DrawPoint(data.x, data.y);
    this.anchor.set(0.5, 0.5);
    Game.physics.enable(this);
    // this.body.collideWorldBounds = true;

    this.scale.x = data.scaleX || 1;
    this.anchor.x = 0.65;

    this.animations.add('stop', [24]);
    this.animations.add('walk', Phaser.ArrayUtils.numberArray(6, 13), 8, true);
    this.animations.add('uptight', Phaser.ArrayUtils.numberArray(0, 4), 3, true);
    this.animations.add('jump', Phaser.ArrayUtils.numberArray(92, 99), 8);
    this.animations.add('jumpUp', Phaser.ArrayUtils.numberArray(41, 46), 8);
    this.animations.add('run', Phaser.ArrayUtils.numberArray(15, 22), 8, true);
    this.animations.add('nod', Phaser.ArrayUtils.numberArray(24, 28), 8, true);

    this.animations.play('stop');
}

Woman.prototype = Object.create(Phaser.Sprite.prototype);
Woman.prototype.constructor = Man;
