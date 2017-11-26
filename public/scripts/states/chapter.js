(function() {
    var style = {
        font: AT.Meta.Styles.OpenText.FontStyle,
        fill: "white",
        boundsAlignH: "center",
        boundsAlignV: "middle",
        wordWrap: true,
        wordWrapWidth: 600,
    };

    sChapter.proto.init = function(args) {
        sChapter.CurChapterNum = args.chapter;
        sChapter.LevelCount = Object.keys(AT.Meta.Chapters[sChapter.CurChapterNum].Levels).length;
        sPlay.CurLevelNum = 0;

        AT.InitInput();
        sChapter.nextLevelTimeout = setTimeout(sPlay.NextLevel, 2000);

        AT.Keys.enter.onDown.add(function() {
            clearTimeout(sChapter.nextLevelTimeout);
            sPlay.NextLevel();
        });

        AT.Keys.esc.onDown.add(function() {
            clearTimeout(sChapter.nextLevelTimeout);
            AT.GotoIntro();
        });
    };

    sChapter.proto.create = function() {
        AT.BG = AT.AddImageLayer('bg_trump_black');
        AT.graphics = Game.add.graphics();

        var text =
            "Chapter " + AT.PaddedNum(sChapter.CurChapterNum) + " - " +
            AT.Meta.Chapters[sChapter.CurChapterNum].Title;

        Game.add.text(100, 100, text, style);

        AT.ShowExitButton(function() {
            clearTimeout(sChapter.nextLevelTimeout);
        });
    };

    sChapter.PreviousChapter = function() {
        var chapterNum = (sChapter.CurChapterNum == 1 ? AT.ChapterCount : sChapter.CurChapterNum - 1);
        sChapter.StartChapter(chapterNum);
    };

    sChapter.NextChapter = function() {
        if (sChapter.CurChapterNum == AT.ChapterCount)
            Game.state.start('sWinGame');
        else {
            var nextChapterNum = (sChapter.CurChapterNum ? sChapter.CurChapterNum + 1 : 1);
            sChapter.StartChapter(nextChapterNum);
        }
    };

    sChapter.StartChapter = function(chapterNum) {
        AT.TransitionFade(function() {
            Game.state.start('sChapter', true, false, {
                chapter: chapterNum,
            });
        });
    };

    sChapter.RestartChapter = function() {
        sPlay.StartLevel(1);
    };

})();
