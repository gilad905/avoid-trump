(function() {
    var app = angular.module('avoidTrump', []);
    app.controller('levelEditorController', function($http, $scope) {

        AT.CreateLevelEditor = function() {
            $scope.Level = AT.LevelEditorData;

            for (var i = 0, scene; scene = $scope.Level.scenes[i]; i++) {
                if (scene.locker !== undefined)
                    scene.locker = true;
            }

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
            animations: {}, // populated at CreateLevelEditor()
        };

        $scope.Level = "";

        $scope.removeScene = function(sceneId) {
            if (window.confirm("Remove scene?"))
                $scope.Level.scenes.splice(sceneId, 1);
        };

        $scope.addScene = function() {
            $scope.Level.scenes.push({});
        };

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
