function Woman(game, data) {
    // call Phaser.Sprite constructor
    Phaser.Sprite.call(this, game, data.x, data.y, 'woman');
    this.anchor.set(0.5, 0.5);
    game.physics.enable(this);
    // this.body.collideWorldBounds = true;

    if (data.scaleX !== undefined)
        this.scale.x = data.scaleX;

    this.animations.add('stop', [24]);
    this.animations.add('walk', Phaser.ArrayUtils.numberArray(6, 13), 8, true);
    this.animations.add('uptight', Phaser.ArrayUtils.numberArray(0, 4), 8, true);
    this.animations.add('jump', Phaser.ArrayUtils.numberArray(92, 99), 8);
    this.animations.add('jumpUp', Phaser.ArrayUtils.numberArray(41, 46), 8);
    this.animations.add('run', Phaser.ArrayUtils.numberArray(15, 22), 8, true);
    this.animations.add('nod', Phaser.ArrayUtils.numberArray(24, 28), 8, true);

    this.animations.play('stop');
}

Woman.prototype = Object.create(Phaser.Sprite.prototype);
Woman.prototype.constructor = Man;
