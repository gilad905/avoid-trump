function Man(game, data) {
    let X = 7;

    // call Phaser.Sprite constructor
    Phaser.Sprite.call(this, game, data.x, data.y, 'man');
    this.anchor.set(0.5, 0.5);
    game.physics.enable(this);
    // this.body.collideWorldBounds = true;

    if (data.scaleX !== undefined)
        this.scale.x = data.scaleX;

    this.animations.add('stop', [24]);
    this.animations.add('walk', Phaser.ArrayUtils.numberArray(6, 13), 8, true);
    // this.animations.add('walk', [1, 2], 8, true);
    // this.animations.add('jump', [3]);
    // this.animations.add('fall', [4]);
    this.animations.add('hand', Phaser.ArrayUtils.numberArray(66, 70), 8);
    // var blinkAnim = this.animations.add('blink', [0, X, 0, X, 0, X, 0], 8);
    // blinkAnim.killOnComplete = true;

    this.animations.play('stop');
}

Man.prototype = Object.create(Phaser.Sprite.prototype);
Man.prototype.constructor = Man;
