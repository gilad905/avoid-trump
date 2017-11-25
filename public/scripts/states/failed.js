(function(that) {
    sPlay.failed = function() {
        if (sPlay.SubState != 'failed') {
            sPlay.SubState = 'failed';
            AT.Keys.enter.onDown.add(AT.DEBUG ? sPlay.RestartLevel : sChapter.RestartChapter);
            AT.FadeBackground(.3, .8);
            showMessage();
            if (!AT.DEBUG) {
                sPlay.HideRestartLevelButton();
                sChapter.ShowRestartChapterButton();
            }
        }
    };

    var style = {
        font: AT.Meta.FontStyle,
        fill: 'red',
    }

    function showMessage() {
        Game.add.text(100, 100, 'Awwww... you failed!', style);
    }
})(this);
