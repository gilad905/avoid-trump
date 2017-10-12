(function() {
    var app = angular.module('avoidTrump', []);
    app.controller('levelEditorController', function($scope, $document, $timeout) {

        var le = this;

        document.onkeydown = function(e) {
            e = e || window.event;
            if (e.ctrlKey) {
                var c = e.which || e.keyCode;
                if (c == 83) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            }
        };

        $document.bind('keyup', function(e) {
            if (e.keyCode == 17)
                le.ctrlPressed = false;
        });

        $document.bind('keydown', function(e) {
            if (e.keyCode == 17)
                le.ctrlPressed = true;
            if (e.keyCode == 83 && le.ctrlPressed == true) {
                AT.SaveToFile();
                $scope.$digest();
            }
        });

        AT.CreateLevelEditor = function() {
            $scope.Level = AT.LevelEditorData;
            $scope.LevelNumber = sPlay.CurLevelNum;

            for (var i = 0, scene; scene = $scope.Level.scenes[i]; i++) {
                if (scene.locker === undefined)
                    scene.locker = true;
            }

            for (var i = 0, sprite; sprite = le.Meta.sprites[i]; i++) {
                if (AT.People[sprite]) {
                    le.Meta.animations[sprite] = [];
                    for (var animName in AT.People[sprite].animations._anims)
                        le.Meta.animations[sprite].push(animName);
                }
            }

            $scope.$digest();
        };

        AT.SaveToFile = function() {
            var earea = getEArea();
            var reqBody = {
                fileData: eArea.textContent,
            };
            var url = "/Game%20Dev/avoid-trump/public/data/level" + AT.PaddedNum($scope.LevelNumber) + ".json";
            http(url, "PUT", reqBody, true, false, null);
            showSavedMsg();
            // safeDigest();
            // $scope.$digest();
        };

        //////////////////////////////////////////////////

        var eArea = null;

        var getEArea = function() {
            eArea = eArea || document.querySelector('#level-editor textarea');
            return eArea;
        };

        function showSavedMsg() {
            var secTime = 2;
            $timeout(function() {
                $scope.SavedMsgOn = false;
            }, secTime * 1000);
            $scope.SavedMsgOn = true;
        }

        function safeDigest() {
            if (!['$apply', '$digest'].includes($scope.$root.$$phase))
                $scope.$digest();
        }

        //////////////////////////////////////////////////

        $scope.SavedMsgOn = false;
        $scope.Level = "";
        $scope.PropsShowing = true;
        $scope.ScenesShowing = true;

        le.ctrlPressed = false;

        le.Meta = {
            labelsEvery: 7,
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
            facing: ['', "Left", "Right"],
            sprites: ["trump", "woman", "man2", "woman2"],
            animations: {}, // populated at CreateLevelEditor()
        };

        le.saveToFile = function() {
            AT.SaveToFile();
        };

        le.removeScene = function(id) {
            if (window.confirm("Remove scene?"))
                $scope.Level.scenes.splice(id, 1);
        };

        le.moveScene = function(id, dir) {
            var scenes = $scope.Level.scenes;
            if (scenes[id] && scenes[id + dir]) {
                var temp = scenes[id];
                scenes[id] = scenes[id + dir];
                scenes[id + dir] = temp;
            }
        };

        le.addScene = function(index) {
            if (index === undefined)
                index = $scope.Level.scenes.length - 1;

            var newScene = angular.copy($scope.Level.scenes[index]);

            $scope.Level.scenes.splice(index + 1, 0, newScene);
        };

        le.copyLevel = function() {
            var earea = getEArea();
            earea.select();
            try {
                document.execCommand('copy');
            } catch (exc) {};
        };

        le.toggleProps = function() {
            $scope.PropsShowing = !$scope.PropsShowing;
        };

        le.toggleScenes = function() {
            $scope.ScenesShowing = !$scope.ScenesShowing;
        };
    });
})();
