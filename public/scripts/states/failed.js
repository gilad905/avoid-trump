(function(that) {
    sPlay.failed = function() {
        if (sPlay.SubState != 'failed') {
            sPlay.SubState = 'failed';
            AT.Keys.enter.onDown.add(sChapter.RestartChapter);
            AT.FadeBackground(.3, .8);
            showMessage();
            sPlay.HideRestartLevelButton();
            sChapter.ShowRestartChapterButton();
        }
    };

    function showMessage() {
        Game.add.text(100, 100, 'Awwww... you failed!', {
            fill: 'red',
        });
    }
})(this);
