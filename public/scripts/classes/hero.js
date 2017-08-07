function Hero(game, x, y) {
    let X = 7;

    // call Phaser.Sprite constructor
    Phaser.Sprite.call(this, game, x, y, 'hero');
    this.anchor.set(0.5, 0.5);
    game.physics.enable(this);
    this.body.collideWorldBounds = true;

    this.animations.add('stop', [0]);
    this.animations.add('walk', [1, 2], 8, true);
    // this.animations.add('jump', [3]);
    // this.animations.add('fall', [4]);
    this.animations.add('die', [5, 6, 5, 6, 5, 6], 8);
    // var blinkAnim = this.animations.add('blink', [0, X, 0, X, 0, X, 0], 8);
    // blinkAnim.killOnComplete = true;

    this.animations.play('stop');
}

Hero.prototype = Object.create(Phaser.Sprite.prototype);
Hero.prototype.constructor = Hero;
