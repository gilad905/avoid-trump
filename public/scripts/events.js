AT.onKeyDown = function(event) {
    if (AT.scene && AT.scene.isAvoidTask) {
        if (event.key == AT.scene.char) {
            AT.counter++;
            AT.refreshCounter();
            AT.scene.obj.finish();
        }
    }
}
