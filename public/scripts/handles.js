AT.handleCollisions = function() {};

AT.handleInput = function() {
    AT.debugMousePosition();
};

AT.debugMousePosition = function() {
    if (AT.DEBUG && AT.mouseInput.leftButton.isDown)
        console.log(AT.mouseInput.worldX.toFixed() + " - " + AT.mouseInput.worldY.toFixed());
};
