(function() {
    sLoad.proto.preload = function() {
        loadLevelsData();
        loadSpritesheetAssets();

        Game.load.json('intro', 'data/intro.json');
        Game.load.image('black', 'assets/black.png');
        Game.load.image('btn_1', 'assets/blue_button00.png');
        Game.load.image('btn_2', 'assets/green_button05.png');
        Game.load.image('bg_trump', 'assets/trump_bg_edited.png');
        Game.load.image('bg_trump_black', 'assets/trump_bg_black.png');

        // A hack to preload custom fonts
        Game.add.text(0, 0, "hack", {font:"1px Indie Flower", fill:"#FFFFFF"});
    };

    sLoad.proto.create = function() {
        if (AT.DEBUG)
            sChapter.NextChapter();
        else
            Game.state.start('sIntro');
    };

    //////////////////////////////////////////////////////////////

    function loadLevelsData() {
        for (var chapterNum in AT.Meta.Chapters) {
            var chapter = AT.Meta.Chapters[chapterNum];
            var chapterPadded = AT.PaddedNum(chapterNum);
            for (var levelNum in chapter.Levels) {
                var level = chapter.Levels[levelNum];
                var levelPadded = AT.PaddedNum(levelNum);
                Game.load.json(`level:${chapterNum}-${levelNum}`, `data/chapter-${chapterPadded}/level-${levelPadded}.json`);
                for (var assetType in level) {
                    var asset = level[assetType];
                    Game.load.image(`${assetType}:${chapterNum}-${levelNum}`, `assets/levels/chapter-${chapterPadded}/${asset}`);
                }
            }
        }
    }

    function loadSpritesheetAssets() {
        var sheets = AT.Meta.Spritesheets;

        for (var key in sheets)
            Game.load.spritesheet(key, 'assets/spritesheets/' + sheets[key], 272, 334);
    }

    function fileExists(name) {
        return new Promise(function(resolve) {
            var xhr = new XMLHttpRequest();
            xhr.onload = function() {
                resolve(this.status == 200);
            };
            xhr.onerror = function(error) {
                console.error(error);
                resolve(false);
            };

            xhr.open('HEAD', name);
            xhr.send();
        });
    }
})();
