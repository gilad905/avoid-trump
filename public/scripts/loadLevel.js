AT.loadLevel = function(data) {
    this.spawnCharacters({
        man: data.man,
        woman: data.woman,
    });
};

AT.addGroups = function() {
};

AT.spawnCharacters = function(data) {
    this.woman = new Woman(game, data.woman);
    game.add.existing(this.woman);

    this.man = new Man(game, data.man);
    game.add.existing(this.man);
};
