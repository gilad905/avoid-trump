(function() {
    var style = {
        font: AT.Meta.FontStyle,
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
        AT.Keys.enter.onDown.add(sPlay.NextLevel);
    };

    sChapter.proto.create = function() {
        AT.graphics = Game.add.graphics();

        var text =
            "Chapter " + AT.PaddedNum(sChapter.CurChapterNum) + " - " +
            AT.Meta.Chapters[sChapter.CurChapterNum].Title;

        Game.add.text(100, 100, text, style);

        AT.AddTextButton(
            Game.width - 150,
            Game.height - 100, -1, -1,
            'START',
            null,
            null,
            sPlay.NextLevel
        );
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
        Game.state.start('sChapter', true, false, {
            chapter: chapterNum,
        });
    };

    sChapter.RestartChapter = function() {
        sPlay.StartLevel(1);
    };

    sChapter.ShowRestartChapterButton = function() {
        AT.Buttons.RestartChapter = AT.AddTextButton(
            Game.width - 200,
            Game.height - 100, -1, -1,
            'RESTART', null, null,
            sChapter.RestartChapter
        );
    };

})();
