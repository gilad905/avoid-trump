AT.loadLevel = function(data) {
    // this.addGroups();

    // this.spawnDeco(data.decoration);
    // data.platforms.forEach(this.spawnPlatform, this);
    this.spawnCharacters({
        man: data.man,
        woman: data.woman,
        // spiders: data.spiders,
    });

    // const GRAVITY = 1200;
    // game.physics.arcade.gravity.y = GRAVITY;

    // this.fadeCamera(true);
};

AT.addGroups = function() {
    // this.platforms = game.add.group();
    // this.coins = game.add.group();
    // this.spiders = game.add.group();
    // this.enemyWalls = game.add.group();
    // this.deco = game.add.group();
};

// AT.spawnDeco = function(deco) {
//     for (var iDeco = 0, aDeco; aDeco = deco[iDeco]; iDeco++)
//         this.deco.create(aDeco.x, aDeco.y, 'deco', aDeco.frame);
// };

// AT.spawnDoor = function(door) {
//     this.door = game.add.sprite(door.x, door.y, 'door');
//     this.door.anchor.set(0.5, 1);
//     this.door.animations.add('closed', [0]);
//     this.door.animations.add('open', [1]);
//     this.door.animations.play('closed');
//
//     game.physics.enable(this.door);
//     this.door.body.allowGravity = false;
// };

AT.spawnCharacters = function(data) {
    this.woman = new Woman(game, data.woman);
    game.add.existing(this.woman);
    
    this.man = new Man(game, data.man);
    game.add.existing(this.man);
};

// AT.spawnSpider = function(spider) {
//     var sprite = new Spider(game, spider.x, spider.y);
//     this.spiders.add(sprite);
// };

// AT.spawnCoin = function(coin) {
//     var sprite = this.coins.create(coin.x, coin.y, 'coin');
//     sprite.anchor.set(0.5, 0.5);
//     sprite.animations.add('rotate', [0, 1, 2, 1], 6, true);
//     sprite.animations.play('rotate');
//
//     game.physics.enable(sprite);
//     sprite.body.allowGravity = false;
// };
