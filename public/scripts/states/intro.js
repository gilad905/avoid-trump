(function(that) {
   var introText =
      "AVOID TRUMP\n" +
      "\n" +
      "Careful! Trump is coming for you!\n" +
      "Avoid shaking Trump's hand by quickly pressing the correct keys.\n" +
      "When you see a key like in the example, you need to press that key before the time runs out.\n" +
      "Good luck!\n";

   var style = {
      font: "bold 24px Arial",
      fill: "#fff",
      boundsAlignH: "center",
      boundsAlignV: "middle",
      wordWrap: true,
      wordWrapWidth: 600,
   };

   sIntro.init = function() {
      AT.timer = game.time.create(false);
   };

   sIntro.create = function() {
      AT.graphics = game.add.graphics();
      var data = game.cache.getJSON('intro');
      AT.loadIntro();
      var taskX = game.width - 100;
      var taskY = game.height / 2;
      for (var i in data.scenes) {
         data.scenes[i].x = taskX;
         data.scenes[i].y = taskY;
      }
      AT.startScenes(data.scenes);
   }

   AT.loadIntro = function() {
      game.add.text(100, 100, introText, style);

      AT.addTextButton(
         game.width - 150,
         game.height - 100,
         -1, -1,
         'START',
         style,
         null,
         function() {
            game.state.start('sPlay', true, false, {
               level: 0
            });
         }
      );
   };

})(this);
