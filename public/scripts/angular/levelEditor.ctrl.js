(function() {
    var app = angular.module('avoidTrump', []);
    app.controller('levelEditorController', function($http, $scope) {

        AT.RefreshLevelEditor = function() {
            $http.get("data/level" + AT.level.toString().padStart(2, '0') + ".json")
                .then(function(res) {
                    $scope.Level = res.data;

                    for (var i = 0, scene; scene = $scope.Level.scenes[i]; i++) {
                        if (scene.locker !== undefined)
                        scene.locker = true;
                    }
                });

            for (var i = 0, sprite; sprite = $scope.Meta.sprites[i]; i++) {
                $scope.Meta.animations[sprite] = [];
                for (var animName in AT[sprite].animations._anims)
                    $scope.Meta.animations[sprite].push(animName);
            }
        };

        $scope.Meta = {
            sceneTypes: [{
                name: 'Wait',
                desc: 'Wait',
            }, {
                name: 'AnimScene',
                desc: 'Animation',
            }, {
                name: 'AvoidTask',
                desc: 'Avoid task',
            }],
            sprites: ["man", "woman"],
            animations: {}, // populated at RefreshLevelEditor()
        };

        $scope.Level = "";

        $scope.copyLevel = function() {
            var textarea = document.querySelector('#level-editor textarea');
            textarea.select();
            try {
                document.execCommand('copy');
            } catch (exc) {};
            // textarea.blur();
        };

        function drawLevel() {}

        $scope.$watch('Level', drawLevel);
    });
})();
