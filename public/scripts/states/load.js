(function() {
    sLoad.proto.preload = function() {
        loadLevelsData();
        loadSpritesheetAssets();

        Game.load.json('intro', 'data/intro.json');
        Game.load.image('black', 'assets/black.png');
    };

    sLoad.proto.create = function() {
        if (AT.DEBUG)
            sChapter.NextChapter();
        else
            Game.state.start('sIntro');
    };

    //////////////////////////////////////////////////////////////

    function loadLevelsData() {
        for (var iChapter in AT.Meta.Chapters) {
            var chapter = AT.Meta.Chapters[iChapter];
            var chapterNum = AT.PaddedNum(iChapter);
            for (var levelNum in chapter.Levels) {
                var level = chapter.Levels[levelNum];
                var levelPadded = AT.PaddedNum(levelNum);
                Game.load.json(`level:${levelNum}`, `data/chapter-${chapterNum}/level-${levelPadded}.json`);
                for (var assetType in level) {
                    var asset = level[assetType];
                    Game.load.image(`${levelPadded} ${assetType}`, `assets/levels/chapter-${chapterNum}/${asset}`);
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
