(function() {
    AT.LoadLevel = function(data) {
        spawnCharacters({
            man: data.man,
            woman: data.woman,
        });
    };

    function addGroups() {};

    function spawnCharacters(data) {
        AT.woman = new Woman(Game, data.woman);
        Game.add.existing(AT.woman);

        AT.man = new Man(Game, data.man);
        Game.add.existing(AT.man);
    };
})();
