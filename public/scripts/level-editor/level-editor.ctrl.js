(function() {
    var app = angular.module('avoidTrump', []);
    app.controller('levelEditorController', function($scope) {

        var eArea = null;

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
            }, {
                name: 'Win',
                desc: 'Win',
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
            var scenes = $scope.Level.scenes;
            if (scenes[id] && scenes[id + dir]) {
                var temp = scenes[id];
                scenes[id] = scenes[id + dir];
                scenes[id + dir] = temp;
            }
        };

        $scope.addScene = function(index) {
            if (index === undefined)
                index = $scope.Level.scenes.length - 1;
            $scope.Level.scenes.splice(index + 1, 0, {
                locker: true,
            });
        };

        $scope.copyLevel = function() {
            var earea = $scope.getEArea();
            earea.select();
            try {
                document.execCommand('copy');
            } catch (exc) {};
        };

        $scope.getEArea = function() {
            eArea = eArea || document.querySelector('#level-editor textarea');
            return eArea;
        };

        $scope.toggleProps = function() {
            $scope.PropsShowing = !$scope.PropsShowing;
        };

        $scope.toggleScenes = function() {
            $scope.ScenesShowing = !$scope.ScenesShowing;
        };

        $scope.saveToFile = function() {
            var earea = $scope.getEArea();
            var reqBody = {
                fileData: eArea.textContent
            };
            var url = "/Game%20Dev/avoid-trump/public/data/level" +
                $scope.LevelNumber.toString().padStart(2, '0') + ".json";
            http(url, "PUT", reqBody, true, false, null);
        };

        // $scope.$watch('Level', drawLevel);
    });
})();
