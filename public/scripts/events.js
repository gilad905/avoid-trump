AT.onKeyDown = function(event) {
    if (AT.scene && AT.scene.isAvoidTask) {
        if (event.key == AT.scene.char)
            AT.scene.obj.complete();
    }
}
