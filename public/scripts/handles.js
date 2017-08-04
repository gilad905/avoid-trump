AT.handleCollisions = function() {
    // game.physics.arcade.collide(this.hero, this.platforms);
    // game.physics.arcade.overlap(this.hero, this.coins, this.onHeroVsCoin, null, this);
    // game.physics.arcade.collide(this.hero, this.spiders, this.onHeroVsSpider, null, this);
};

AT.handleInput = function() {
    if (this.hero.body.velocity) {
        this.hero.move(this.keys);
    }
};
