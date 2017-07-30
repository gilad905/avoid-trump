PlayState.loadLevel = function(data) {
    // this.addGroups();

    // this.spawnDeco(data.decoration);
    // data.platforms.forEach(this.spawnPlatform, this);
    this.spawnCharacters({
        hero: data.hero,
        // spiders: data.spiders,
    });

    // const GRAVITY = 1200;
    // this.game.physics.arcade.gravity.y = GRAVITY;

    // this.fadeCamera(true);
};

PlayState.addGroups = function() {
    // this.platforms = this.game.add.group();
    // this.coins = this.game.add.group();
    // this.spiders = this.game.add.group();
    // this.enemyWalls = this.game.add.group();
    // this.deco = this.game.add.group();
};

// PlayState.spawnDeco = function(deco) {
//     for (var iDeco = 0, aDeco; aDeco = deco[iDeco]; iDeco++)
//         this.deco.create(aDeco.x, aDeco.y, 'deco', aDeco.frame);
// };

// PlayState.spawnDoor = function(door) {
//     this.door = this.game.add.sprite(door.x, door.y, 'door');
//     this.door.anchor.set(0.5, 1);
//     this.door.animations.add('closed', [0]);
//     this.door.animations.add('open', [1]);
//     this.door.animations.play('closed');
//
//     this.game.physics.enable(this.door);
//     this.door.body.allowGravity = false;
// };

PlayState.spawnCharacters = function(data) {
    // data.spiders.forEach(this.spawnSpider, this);
    // spawn hero
    this.hero = new Hero(this.game, data.hero.x, data.hero.y);
    this.game.add.existing(this.hero);
};

// PlayState.spawnSpider = function(spider) {
//     var sprite = new Spider(this.game, spider.x, spider.y);
//     this.spiders.add(sprite);
// };

// PlayState.spawnCoin = function(coin) {
//     var sprite = this.coins.create(coin.x, coin.y, 'coin');
//     sprite.anchor.set(0.5, 0.5);
//     sprite.animations.add('rotate', [0, 1, 2, 1], 6, true);
//     sprite.animations.play('rotate');
//
//     this.game.physics.enable(sprite);
//     sprite.body.allowGravity = false;
// };
