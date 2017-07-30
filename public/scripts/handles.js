PlayState.handleCollisions = function() {
    // this.game.physics.arcade.collide(this.hero, this.platforms);
    // this.game.physics.arcade.overlap(this.hero, this.coins, this.onHeroVsCoin, null, this);
    // this.game.physics.arcade.collide(this.hero, this.spiders, this.onHeroVsSpider, null, this);
};

PlayState.handleInput = function() {
    if (this.hero.body.velocity) {
        this.hero.move(this.keys);
    }

    // if (this.keys.left.isDown)
    //     this.hero.move(-this.SPEED);
    // else if (this.keys.right.isDown)
    //     this.hero.move(1);
    // else
    //     this.hero.move(0);
    //
    // if (this.keys.up.isDown) {
    //     // holding the key for a short time
    //     if (this.keys.up.duration > 0 && this.keys.up.duration < 200 && this.hero.isJumping)
    //         this.hero.jump();
    // }
};
