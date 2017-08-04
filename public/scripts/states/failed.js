(function(that) {
   const DURATION = 500;
   var fader;

   sFailed.create = function() {
      AT.graphics = game.add.graphics();
      fadeBackground();
      showMessage();
      showButton();
   };

   function fadeBackground() {
      fader = game.add.sprite(0, 0, 'black');
      fader.width = game.width;
      fader.height = game.height;
      fader.alpha = 0;

      game.add.tween(fader).to({
         alpha: .3,
      }, DURATION, null, true);
   }

   function showMessage() {
      game.add.text(100, 100, 'Awwww... you failed!', {
         fill: 'red',
      });
   }

   function showButton() {
      AT.addTextButton(
         game.width - 200,
         game.height - 100, -1, -1,
         'RESTART', {
            fill: 'white',
         }, null,
         function() {
            game.state.start('sPlay', true, false, {
               level: AT.level,
            });
         });
   }

})(this);
