(function() {
    var app = angular.module('avoidTrump', []);
    app.controller('levelEditorController', function($http, $scope) {

        AT.CreateLevelEditor = function() {
            $scope.Level = AT.LevelEditorData;
            $scope.LevelNumber = AT.LevelNumber;
            $scope.$apply();

            $scope.PropsShowing = true;
            $scope.ScenesShowing = true;

            for (var i = 0, scene; scene = $scope.Level.scenes[i]; i++) {
                if (scene.locker === undefined)
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

        $scope.removeScene = function(id) {
            if (window.confirm("Remove scene?"))
                $scope.Level.scenes.splice(id, 1);
        };

        $scope.moveScene = function(id, dir) {
            var temp = $scope.Level.scenes[id];
            $scope.Level.scenes[id] = $scope.Level.scenes[id + dir];
            $scope.Level.scenes[id + dir] = temp;
        };

        $scope.addScene = function() {
            $scope.Level.scenes.push({
                locker: true,
            });
        };

        $scope.copyLevel = function() {
            var textarea = document.querySelector('#level-editor textarea');
            textarea.select();
            try {
                document.execCommand('copy');
            } catch (exc) {};
        };

        $scope.toggleProps = function() {
            $scope.PropsShowing = !$scope.PropsShowing;
        };

        $scope.toggleScenes = function() {
            $scope.ScenesShowing = !$scope.ScenesShowing;
        };

        // $scope.$watch('Level', drawLevel);
    });
})();
