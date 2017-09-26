AT.CreatePerson = function(Game, data, name) {
    var sprite = Game.add.sprite(data.x, data.y, name);
    sprite.anchor.set(0.5, 0.5);
    Game.physics.enable(sprite);

    sprite.scale.x = (data.facing && data.facing == "Right" ? -1 : 1);
    sprite.anchor.x = 0.65;

    sprite.animations.add('stop', [24]);
    sprite.animations.add('uptight', Phaser.ArrayUtils.numberArray(0, 4), 3, true);
    sprite.animations.add('walk', Phaser.ArrayUtils.numberArray(6, 13), 8, true);
    sprite.animations.add('run', Phaser.ArrayUtils.numberArray(15, 22), 8, true);
    if (name == 'trump')
        sprite.animations.add('shocked', [24, 25, 25, 25, 25, 25, 24], 4);
    // sprite.animations.add('shocked', Phaser.ArrayUtils.numberArray(24, 28), 2);
    else
        sprite.animations.add('nod', Phaser.ArrayUtils.numberArray(24, 28), 8, true);
    sprite.animations.add('jumpUp', Phaser.ArrayUtils.numberArray(41, 46), 8);
    sprite.animations.add('hand', Phaser.ArrayUtils.numberArray(66, 70), 3, true);
    sprite.animations.add('dance', Phaser.ArrayUtils.numberArray(87, 91), 8, true);
    sprite.animations.add('jump', Phaser.ArrayUtils.numberArray(92, 99), 8);

    sprite.animations.play('stop');

    return sprite;
};
