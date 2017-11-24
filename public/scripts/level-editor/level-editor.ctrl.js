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

                    AT.SaveToFile();
                    $scope.$digest();
                }
            }
        };

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
            var url = `/Game%20Dev/avoid-trump/public/data/` +
                `chapter-${AT.PaddedNum(sChapter.CurChapterNum)}/` +
                `level-${AT.PaddedNum($scope.LevelNumber)}.json`;
            http(url, "PUT", reqBody, true, false, null);
            showSavedMsg();
        };

        AT.GodMode = true;

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

        le.godMode = AT.GodMode;
        le.ctrlPressed = false;
        le.selectedSceneId = null;

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

        le.selectedSceneChanged = function(id) {
            // le.selectedSceneId = id;
            // sPlay.SceneEditMode(le.selectedSceneId);
        };

        le.selectedSceneUpdated = function(sceneIdx) {
            sPlay.SceneEditMode(le.selectedSceneId);
        };

        le.godModeChanged = function() {
            AT.GodMode = le.godMode;
        };

        le.saveToFile = function() {
            AT.SaveToFile();
        };

        le.removeScene = function(id) {
            if (window.confirm("Remove scene?")) {
                $scope.Level.scenes.splice(id, 1);
                if (le.selectedSceneId == id)
                    le.selectedSceneChanged(id - 1);
            }
        };

        le.moveScene = function(id, dir) {
            var scenes = $scope.Level.scenes;
            if (scenes[id] && scenes[id + dir]) {
                var temp = scenes[id];
                scenes[id] = scenes[id + dir];
                scenes[id + dir] = temp;
                if (le.selectedSceneId == id)
                    le.selectedSceneChanged(le.selectedSceneId + dir);
            }
        };

        le.addScene = function(id, ev) {
            if (id === undefined)
                id = $scope.Level.scenes.length - 1;

            var newScene = angular.copy($scope.Level.scenes[id]);
            $scope.Level.scenes.splice(id + 1, 0, newScene);

            // prevent the button click to re-select current row
            // so the new row can be selected
            ev.stopPropagation();
            le.selectedSceneChanged(id + 1);
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
